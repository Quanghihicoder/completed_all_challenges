import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Room from "./pages/Room";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/xogame">
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="game/">
              <Route index element={<Game mode={1} />} />
              <Route path="computer" element={<Game mode={2} />} />
              <Route path="newroom" element={<Room />} />
              <Route path="room/:id" element={<Game mode={3} />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
