const express = require("express");
const sequelize = require("./config/database");
const router = require("./routes/index");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Room = require("./models/Room");

const dirname = path.resolve();

// Function to handle 404 errors
const sendError = (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.set("Content-Type", "text/html");
    res.status(404).send(`
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <title>NutriChief</title>
                <meta name="description" content="Description Goes Here">
            </head>
            <body>
                <p>Not Found! Please check your url.</p>
            </body>
            </html>
        `);
    return;
  }

  // Respond with JSON
  if (req.accepts("json")) {
    res.json({ status: 0, message: "API not found!", data: [] });
    return;
  }
};

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.ALLOW_ORIGIN?.split(',') || [];

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null,false);
        }
    },
};

// Apply CORS middleware to Express
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Socket.IO configuration with CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET", "POST"],
  },
  path: "/xogame/socket.io",
});

// Route for API endpoints
app.use("/xogame/api", router);

app.get("/xogame/api", (req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200).send("<p>Welcome to Quang's APIs</p>");
});

// Serve static files correctly under /xogame/static
app.use("/xogame", express.static(path.join(dirname, "./xogame")));

// Route to serve the XO game HTML file
app.get("/xogame/*", function (req, res) {
  res.sendFile(path.join(dirname, "./xogame/index.html"));
});


// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

const rooms = {};

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("joinRoom", async (roomId) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [], viewers: [], gameState: null };
    }

    if (rooms[roomId].players.length < 2) {
      let player = "X";

      if (rooms[roomId].players.some((player) => player.play === "X")) {
        player = "O";
      }

      rooms[roomId].players.push({ id: socket.id, play: player });

      socket.join(roomId);

      socket.emit("playerJoined", player);

      if (rooms[roomId].players.length === 2) {
        io.to(roomId).emit("waitingForPlayer", false);

        try {
          const room = await Room.findByPk(roomId);
          if (room) {
            let gameState = {
              squares: Array(room.mapSize * room.mapSize).fill(null),
              isXNext: Math.random() < 0.5,
              xScore: 0,
              oScore: 0,
              winner: null,
              winSquares: Array(room.winCondition).fill(null),
            };

            rooms[roomId].gameState = gameState;
            io.to(roomId).emit("updateGame", gameState);
          } else {
            console.log("Room not found");
          }
        } catch (error) {
          console.error("Error finding room:", error);
        }
      } else {
        io.to(roomId).emit("waitingForPlayer", true);
      }
    } else {
      rooms[roomId].viewers.push(socket.id);
      socket.join(roomId);
      socket.emit("roomFull");
    }

    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("click", ({ roomId, gameState }) => {
    rooms[roomId].gameState = gameState;

    io.to(roomId).emit("updateGame", gameState);
  });

  socket.on("leaveRoom", async (roomId) => {
    socket.leave(roomId);
    rooms[roomId].players = rooms[roomId].players.filter(
      (player) => player.id !== socket.id
    );
    rooms[roomId].viewers = rooms[roomId].viewers.filter(
      (viewer) => viewer !== socket.id
    );
    if (
      rooms[roomId].players.length === 0 &&
      rooms[roomId].viewers.length === 0
    ) {
      delete rooms[roomId];
      const room = await Room.findByPk(roomId);
      room.destroy();
    } else if (rooms[roomId].players.length < 2) {
      io.to(roomId).emit("waitingForPlayer", true);
    }
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on("disconnect", async () => {
    // Iterate through all rooms to find the one the user was in
    for (const roomId in rooms) {
      if (
        rooms[roomId].players.some((player) => player.id === socket.id) ||
        rooms[roomId].viewers.includes(socket.id)
      ) {
        socket.leave(roomId);
        rooms[roomId].players = rooms[roomId].players.filter(
          (player) => player.id !== socket.id
        );
        rooms[roomId].viewers = rooms[roomId].viewers.filter(
          (viewer) => viewer !== socket.id
        );
        if (
          rooms[roomId].players.length === 0 &&
          rooms[roomId].viewers.length === 0
        ) {
          delete rooms[roomId];
          const room = await Room.findByPk(roomId);
          room.destroy();
        } else if (rooms[roomId].players.length < 2) {
          io.to(roomId).emit("waitingForPlayer", true);
        }
        console.log(`User ${socket.id} disconnected from room ${roomId}`);
      }
    }
  });
});

// Handle 404 errors
app.use(function (req, res) {
  sendError(req, res);
});

// Start the server
const PORT = 8000;

server.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`Open localhost:${PORT}/`);
  } else console.log("Error occurred, server can't start", error);
});
