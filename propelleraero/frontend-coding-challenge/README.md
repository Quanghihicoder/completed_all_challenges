# 🗺️ Tile-Based Map Viewer

This project is a tile-based map viewer with an efficient frontend-backend architecture. It supports smooth zooming and panning, loading only the necessary tiles plus a small buffer around the viewport for optimal performance.

---

## ✨ Features (All extras)

- **Zoom Controls**
  - Zoom using buttons
  - Zoom using mouse scroll & panning
  - Zoom centered around mouse pointer for intuitive navigation (so hard!)

- **Smart Tile Loading**
  - Loads only visible tiles + 2-tile buffer in all directions. Smooth transition. (so hard!)
  - Check backend logs to confirm tile loading behavior

- **Viewport Memory**
  - Remembers previous panning offset and restores it

---

## Notes

Oh, I just realized during the QA challenge that you guys are using translate3d instead of position: absolute with top and left.

Besides the fact that the production is 3D and this might be the only viable approach, it also benefits from GPU utilization and results in smoother animations.

---

## 🚀 Getting Started

### Prerequisites

- Linux/macOS environment
- Node 22 Or Docker
- Bash

### Run Instructions (Using Docker)

1. Navigate to the backend dir, I already built the frontend code into the backend, so you don't have to:
   ```bash
   cd backend  
   ```

2. Copy environment template:
   ```bash
   cp .env.template .env
   ```

3. Build the backend:
   ```bash
   ./build.sh
   ```

4. Start the application:
   ```bash
   ./run.sh
   ```

### Run Instructions (Using Node)

1. Navigate to the backend dir, I already built the frontend code into the backend, so you don't have to:
   ```bash
   cd backend  
   ```

2. Copy environment template:
   ```bash
   cp .env.template .env
   ```

3. Build the backend:
   ```bash
   npm install
   ```

4. Start the application:
   ```bash
   npm start
   ```

---
