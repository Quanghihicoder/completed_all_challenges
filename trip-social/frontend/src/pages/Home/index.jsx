import { useNavigate } from "react-router-dom";
import "../../styles/home.css";
import xogame from "../../icons/xogame.png";
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setMapSize, setWiningCondition } from '../../store/store';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [size, setSize] = useState(Number(useSelector((state) => state.size)) || 3);
  const [winCondition, setWinCondition] = useState(Number(useSelector((state) => state.winingCondition)) || 3);

  
  const updateSettings = () => {
    dispatch(setMapSize(size));
    dispatch(setWiningCondition(winCondition));
  };

  return (
    <div className="Container Home">
      <img className="BackgroundIcon" src={xogame} alt="XO Game Icon" />;
      <div className="Overlay">
        <div className="Title">
          <p className="Green">X</p>
          <p className="Navy">/</p>
          <p className="Orange">O</p>
          <p className="Navy">Game</p>
        </div>

        <div className="Settings">
          <p className="Title Navy">Game Settings</p>
          <div className="InputContainer">
            <p>
              Map Size {size} x {size}:{" "}
            </p>
            <input
              type="number"
              min={3}
              max={6}
              value={size}
              onChange={(e) => {
                if (Number(e.target.value) >= 3 && Number(e.target.value) <= 6) {
                  setSize(e.target.value);
                }
              }}
            />
          </div>

          <div className="InputContainer">
            <p>Wining Condition: </p>
            <input
              type="number"
              min={3}
              max={size}
              value={winCondition}
              onChange={(e) => {
                if (Number(e.target.value) >= 3 && Number(e.target.value) <= size) {
                  setWinCondition(e.target.value);
                }
              }}
            />
          </div>
        </div>

        <div className="Buttons">
          <button
            className="Button Big Navy"
            onClick={() => {
              updateSettings();
              navigate("/game");
            }}
          >
            Play
          </button>
          <button
            className="Button Big Green"
            onClick={() => {
              updateSettings();
              navigate("/game/computer");
            }}
          >
            Play With Computer
          </button>
          <button
            className="Button Big Orange"
            onClick={() => {
              updateSettings();
              navigate("/game/newroom");
            }}
          >
            Play Online
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
