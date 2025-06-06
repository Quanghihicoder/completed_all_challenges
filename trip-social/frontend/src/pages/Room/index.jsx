import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/room.css";
import { useNavigate, useLocation } from "react-router-dom";
import reload from "../../icons/reload.png";
import gameControl from "../../icons/game-controller.png";
import axios from 'axios'

const Room = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve game settings from Redux store
  const size = Number(useSelector((state) => state.size));
  const winCondition = Number(useSelector((state) => state.winingCondition));

  const [overlay, setOverlay] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const goBack = () => {
    navigate("/", {replace: true});
  };

  const handleNewRoom = () => {
    setOverlay(true);
  };

  const handleNewRoomCancel = () => {
    setOverlay(false);
  };

  const handleNewPublicRoom = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/xogame/api/rooms`, {
        status: "public",
        mapSize: size,
        winCondition: winCondition,
      });
      navigate(`/game/room/${response.data.id}`);
    } catch (error) {
      console.error("Error creating public room:", error);
    }
  };

  const handleNewPrivateRoom = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/xogame/api/rooms`, {
        status: "private",
        mapSize: size,
        winCondition: winCondition,
      });
      navigate(`/game/room/${response.data.id}`);
    } catch (error) {
      console.error("Error creating public room:", error);
    }
  };

  const handleJoinRoom = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/xogame/api/rooms/${roomId}`);
      if (response.status === 200) {
        navigate(`/game/room/${roomId}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Room not found");
      } else {
        console.error("Error checking room:", error);
      }
    }
  };

  const handleReload = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/xogame/api/rooms?status=public&mapSize=${size}&winCondition=${winCondition}`
      );
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    handleReload();
  }, []);

  return (
    <div className="Container Room">
      <div
        className={`Overlay ${overlay === false && "None"}`}
        onClick={() => handleNewRoomCancel()}
      />

      <div className={`OverlayControl ${overlay === false && "None"}`}>
        <div>
          <button
            className="Button Medium Green"
            onClick={() => handleNewPublicRoom()}
          >
            Public Room
          </button>

          <button
            className="Button Medium Orange"
            onClick={() => handleNewPrivateRoom()}
          >
            Private Room
          </button>
        </div>
        <button
          className="Button Medium Red"
          onClick={() => handleNewRoomCancel()}
        >
          Cancel
        </button>
      </div>

      <div className="Header">
        <button className="Button Medium Navy" onClick={() => goBack()}>
          Home
        </button>

        <button className="Button Medium Green" onClick={() => handleNewRoom()}>
          New Room
        </button>
      </div>

      <div className="Body">
        <div className="List">
          <div className="Header">
            <div className="Input">
              <div>
                <p className="InputTitle">Enter room ID or join a room below</p>
                <input className="InputBox" type="text"  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)} />
                {errorMessage && <p className="ErrorMessage">{errorMessage}</p>}
              </div>
              <button onClick={()=>handleJoinRoom()}>Join</button>
            </div>

            <div>
              <button className="Reload" onClick={()=>handleReload()}><p>Reload</p><img src={reload} alt="Reload Icon" width={30} height={30}/></button>
            </div>
          </div>

          {rooms.length === 0 && <p>No public rooms have the same game settings</p>}

          {rooms.map((room) => (
            <div
              key={room.id}
              className="Item"
              onClick={() => navigate(`/game/room/${room.id}`)}
            >
              <img src={gameControl} alt="Game Icon" width={18} height={18} />
              <p className="Name">Room: {room.id}</p>
            </div>
          ))}
         
        </div>
      </div>
    </div>
  );
};

export default Room;
