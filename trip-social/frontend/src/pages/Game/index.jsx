import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/game.css";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect(process.env.REACT_APP_API_URL, {
  path: "/xogame/socket.io",
});

const Game = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [roomDetailsFetched, setRoomDetailsFetched] = useState(false);

  // Retrieve game settings from Redux store
  const [size, setSize] = useState(Number(useSelector((state) => state.size)));
  const [winCondition, setWinCondition] = useState(
    Number(useSelector((state) => state.winingCondition))
  );
  const [squares, setSquares] = useState(Array(size * size).fill(null));
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [isXNext, setIsXNext] = useState(Math.random() < 0.5);
  const [winner, setWinner] = useState(null);
  const [winSquares, setWinSquares] = useState(Array(winCondition).fill(null));

  // Online state
  const [waiting, setWaiting] = useState(true);
  const [player, setPlayer] = useState("X");
  const [isViewer, setIsViewer] = useState(false);

  const goBack = () => {
    if(mode === 3) {
      navigate("/game/newroom", { replace: true })
    } 
    else {
      navigate("/", { replace: true })
    }
  };

  const handleNewGame = () => {
    let tempOScore = oScore;
    let tempXScore = xScore;
    let resetTurn = false

    if (winner == null && !calculateMapUnfilled(squares)) {
      if (isXNext) {
        setOScore(oScore + 1);
        tempOScore += 1;
        resetTurn = true
      } else {
        setXScore(xScore + 1);
        tempXScore += 1;
        resetTurn = true
      }
    }

    if (mode === 3) {
      const gameState = {
        squares: Array(size * size).fill(null),
        isXNext: resetTurn ? isXNext : !isXNext,
        xScore: tempXScore,
        oScore: tempOScore,
        winner: null,
        winSquares: Array(winCondition).fill(null),
      };

      socket.emit("click", { roomId: id, gameState });
    } else {
      setSquares(Array(size * size).fill(null));
      setWinSquares(Array(winCondition).fill(null));
      setWinner(null);
      setIsXNext(resetTurn ? isXNext : !isXNext);
    }
  };

  const handleWinner = () => {
    if (isXNext) {
      setWinner("X");
      setXScore(xScore + 1);
    } else {
      setWinner("O");
      setOScore(oScore + 1);
    }
  };

  const handleDraw = () => {
    setWinner("Draw");
  };

  const handleClick = async (i) => {
    const newSquares = squares.slice();

    if (mode === 3 && (waiting || isViewer)) {
      return;
    }

    if (mode === 3 && player === "X" && isXNext === false) {
      return;
    }

    if (mode === 3 && player === "O" && isXNext === true) {
      return;
    }

    if (calculateWinner(newSquares, size, winCondition) || newSquares[i]) {
      return;
    }

    newSquares[i] = isXNext ? "X" : "O";
    setSquares(newSquares);

    if (mode === 3) {
      let tempWinner = null;
      let tempXScore = xScore;
      let tempOScore = oScore;

      if (calculateDraw(newSquares)) {
        tempWinner = "Draw";
      }

      let result = calculateWinner(newSquares, size, winCondition);

      let [tempWin, tempWinSquares] = [undefined, []];

      if (result) {
        [tempWin, tempWinSquares] = result;
      } else {
        [tempWin, tempWinSquares] = [false, []];
      }

      if (tempWin === true) {
        if (isXNext) {
          tempWinner = "X";
          tempXScore = xScore + 1;
        } else {
          tempWinner = "O";
          tempOScore = oScore + 1;
        }
      }

      const gameState = {
        squares: newSquares,
        isXNext: tempWin ? isXNext : !isXNext,
        xScore: tempXScore,
        oScore: tempOScore,
        winner: tempWinner,
        winSquares: tempWinSquares,
      };

      socket.emit("click", { roomId: id, gameState });
    }

    if (calculateWinner(newSquares, size, winCondition)) {
      handleWinner();
    } else if (calculateDraw(newSquares)) {
      handleDraw();
    } else {
      setIsXNext(!isXNext);
    }
  };

  const calculateMapUnfilled = (squares) => {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] != null) {
        return false;
      }
    }
    return true;
  };

  const calculateDraw = (squares) => {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] == null) {
        return false;
      }
    }
    return true;
  };

  const calculateWinner = (squares, size, winCondition) => {
    // Find all possible group of win squares
    const lines = [];

    // Rows
    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= size - winCondition; j++) {
        const line = [];
        for (let k = 0; k < winCondition; k++) {
          line.push(i * size + j + k);
        }
        lines.push(line);
      }
    }

    // Columns
    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= size - winCondition; j++) {
        const line = [];
        for (let k = 0; k < winCondition; k++) {
          line.push((j + k) * size + i);
        }
        lines.push(line);
      }
    }

    // Diagonals
    for (let i = 0; i <= size - winCondition; i++) {
      for (let j = 0; j <= size - winCondition; j++) {
        const line1 = [];
        const line2 = [];
        for (let k = 0; k < winCondition; k++) {
          line1.push((i + k) * size + (j + k));
          line2.push((i + k) * size + (j + winCondition - 1 - k));
        }
        lines.push(line1);
        lines.push(line2);
      }
    }

    let allWinSquares = [];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, ...rest] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        rest.every((index) => squares[a] === squares[index])
      ) {
        // Merge lines[i] into allWinSquares and remove duplicates
        allWinSquares = [...new Set([...allWinSquares, ...lines[i]])];
      }
    }

    if (allWinSquares.length > 0) {
      setWinSquares(allWinSquares);
      if (mode === 3) {
        return [true, allWinSquares];
      } else {
        return true;
      }
    }

    return null;
  };

  // With out alpha beta pruning in can not work at map size greater than 5x5 with win condition is 4
  const minimax = (
    squares,
    depth,
    isMaximizing,
    size,
    winCondition,
    alpha = -Infinity,
    beta = Infinity
  ) => {
    const winner = calculateWinner(squares, size, winCondition);
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (squares.every((square) => square !== null)) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = "O";
          let score = minimax(
            squares,
            depth + 1,
            false,
            size,
            winCondition,
            alpha,
            beta
          );
          squares[i] = null;
          maxEval = Math.max(maxEval, score);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) {
            break; // Beta cut-off
          }
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = "X";
          let score = minimax(
            squares,
            depth + 1,
            true,
            size,
            winCondition,
            alpha,
            beta
          );
          squares[i] = null;
          minEval = Math.min(minEval, score);
          beta = Math.min(beta, score);
          if (beta <= alpha) {
            break; // Alpha cut-off
          }
        }
      }
      return minEval;
    }
  };

  const findRandomMove = (squares) => {
    const emptySquares = squares
      .map((square, index) => (square === null ? index : null))
      .filter((index) => index !== null);
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  };

  const findBestMove = (squares, size, winCondition) => {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "O";
        let moveVal = minimax(
          squares,
          0,
          false,
          -Infinity,
          Infinity,
          size,
          winCondition
        );
        squares[i] = null;

        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  };

  useEffect(() => {
    if (mode === 2 && isXNext === false) {
      const newSquares = squares.slice();

      if (calculateMapUnfilled(newSquares)) {
        const randomMove = findRandomMove(newSquares);
        newSquares[randomMove] = "O";
        setSquares(newSquares);
      } else {
        const bestMove = findBestMove(newSquares, size, winCondition);
        newSquares[bestMove] = "O";
        setSquares(newSquares);
      }

      if (calculateWinner(newSquares, size, winCondition)) {
        handleWinner();
      } else if (calculateDraw(newSquares)) {
        handleDraw();
      } else {
        setIsXNext(true);
      }
    }
  }, [isXNext]);

  useEffect(() => {
    if (mode === 3) {
      const fetchRoomDetails = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/xogame/api/rooms/${id}`
          );
          if (response.status === 200) {
            setSize(response.data.mapSize);
            setWinCondition(response.data.winCondition);
            setSquares(
              Array(response.data.mapSize * response.data.mapSize).fill(null)
            );
            setRoomDetailsFetched(true);
          } else {
            navigate(-1);
          }
        } catch (error) {
          navigate(-1);
        }
      };

      fetchRoomDetails();
    }
  }, []);

  useEffect(() => {
    if (mode === 3 && roomDetailsFetched) {
      socket.emit("joinRoom", id);

      socket.on("updateGame", (gameState) => {
        setSquares(gameState.squares);
        setIsXNext(gameState.isXNext);
        setXScore(gameState.xScore);
        setOScore(gameState.oScore);
        setWinner(gameState.winner);
        setWinSquares(gameState.winSquares);
      });

      socket.on("playerJoined", (p) => {
        setPlayer(p);
      });

      socket.on("waitingForPlayer", (waiting) => {
        setWaiting(waiting);
      });

      socket.on("roomFull", () => {
        setIsViewer(true);
        setWaiting(false);
        setPlayer("")
      });

      return () => {
        socket.emit("leaveRoom", id);
        socket.off("updateGame");
        socket.off("playerJoined");
        socket.off("waitingForPlayer");
        socket.off("roomFull");
      };
    }
  }, [roomDetailsFetched]);

  return (
    <div className="Container Game">
      <div className="Header">
        <button className="Button Medium Navy" onClick={() => goBack()}>
          {mode === 3 ? "Back" : "Home" }
        </button>

        {mode === 3 && <div>{isViewer && <p>"You are viewing!"</p>} <p>Room ID: {id}</p> {!isViewer && <p>Player: {player}</p>}</div>}

        {!isViewer && (<button className={`Button Medium Green ${mode == 3 && waiting == true && "None"}`} onClick={() => handleNewGame()}>
          New Game
        </button>)}        
      </div>

      {waiting && mode === 3 ? (
        <p>Waiting for another player...</p>
      ) : (
        <div className="Body">
          <div className="Info">
            <div className="Player X">
              <div>
                <p
                  className={`Button Small ${
                    isXNext && (winner == null || winner === "X")
                      ? "Green"
                      : "Gray"
                  }`}
                >
                  X
                </p>
                <p className={`${winner === "X" && "Green"}`}>
                  Score: {xScore}
                </p>
              </div>
              <div className="Turn">
                <p
                  className={`${
                    isXNext && winner == null ? "Green" : "Hidden"
                  }`}
                >
                  {mode !== 3 && "Your turn"}
                  {mode === 3 && player === "X" && "Your turn"}
                  {mode === 3 && player === "O" && "Opponent turn"}
                  {mode === 3 && isViewer && "X turn"}
                </p>
              </div>
            </div>

            <div
              className={`Status ${
                winner === "X" || winner === "O" ? "Win" : "Draw"
              } ${winner === "X" && "Green"} ${winner === "O" && "Orange"} ${
                winner !== "X" && winner !== "O" && "Gray"
              } ${winner == null && "Hidden"}`}
            >
              {winner === "X" && <p>Win</p>}
              {winner === "O" && <p>Win</p>}
              {winner === "Draw" && <p>Draw</p>}
              {winner == null && <p>Draw</p>}
            </div>

            <div className="Player O">
              <div className="Turn">
                <p
                  className={`${
                    !isXNext && winner == null ? "Orange" : "Hidden"
                  }`}
                >
                  {mode !== 3 && "Your turn"}
                  {mode === 3 && player === "X" && "Opponent turn"}
                  {mode === 3 && player === "O" && "Your turn"}
                  {mode === 3 && isViewer && "O turn"}
                </p>
              </div>

              <div>
                <p
                  className={`Button Small ${
                    !isXNext && (winner == null || winner === "O")
                      ? "Orange"
                      : "Gray"
                  }`}
                >
                  O
                </p>
                <p className={`${winner === "O" && "Orange"}`}>
                  Score: {oScore}
                </p>
              </div>
            </div>
          </div>

          <div className="Board">
            {Array.from({ length: size }, (_, rowIndex) => (
              <div className="Row" key={rowIndex}>
                {squares
                  .slice(rowIndex * size, (rowIndex + 1) * size)
                  .map((square, i) => (
                    <div
                      className={`Square ${
                        winner === "X" &&
                        winSquares.includes(rowIndex * size + i) &&
                        "Green"
                      } ${
                        winner === "O" &&
                        winSquares.includes(rowIndex * size + i) &&
                        "Orange"
                      }`}
                      key={rowIndex * size + i}
                      onClick={() => {
                        handleClick(rowIndex * size + i).then(() => {});
                      }}
                    >
                      {square === "X" && <p className="Green">X</p>}
                      {square === "O" && <p className="Orange">O</p>}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
