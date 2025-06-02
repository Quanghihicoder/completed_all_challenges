# 🗺️ Tile-Based Map Viewer

This project is a tile-based map viewer with an efficient frontend-backend architecture. It supports smooth zooming and panning, loading only the necessary tiles plus a small buffer around the viewport for optimal performance.

---

## Live Demo

http://52.64.183.96:8000/

I set up a simple host on AWS EC2 (Ubuntu, t2.small).

I'm not sure if it can handle a heavy load, and it's currently running manually without a large cloud setup.

If the URL changes, I’ll update it here.

Please note: it's using HTTP (not HTTPS) because I’m not using a domain name or paid certificate.
A self-signed HTTPS certificate would show an urly browser warning, so HTTP is the better option for now.

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
