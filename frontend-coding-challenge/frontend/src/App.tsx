import { useEffect, useRef, useState, useCallback } from "react";

type TileCoords = {
  z: number;
  x: number;
  y: number;
  left: number;
  top: number;
};

type Offset = {
  x: number;
  y: number;
};

const TILE_SIZE = 256;
const MIN_TILE_LEVEL = 0;
const MAX_TILE_LEVEL = 3;

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // State: zoom level
  const [zoom, setZoom] = useState(MIN_TILE_LEVEL);
  const [transitionZoom, setTransitionZoom] = useState<number | null>(null);
  const prevZoomRef = useRef(zoom);

  // Panning state
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [isTilesOverflow, setIsTileOverflow] = useState(false);
  const draggingRef = useRef(false);
  const dragStartRef = useRef<Offset | null>(null);
  const offsetStartRef = useRef<Offset>({ x: 0, y: 0 });
  const prevOffsetRef = useRef<Offset>({ x: 0, y: 0 });

  // Zoom based on mouse position
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  // Calculate visible tiles
  const [visibleTiles, setVisibleTiles] = useState<TileCoords[]>([]);

  // Clamp offset so user can't pan beyond edges
  const clampOffset = (x: number, y: number) => {
    const container = containerRef.current;
    if (!container) return { x, y };

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const maxGridSize = TILE_SIZE * Math.pow(2, zoom);

    // Max pan is zero (can't pan right/down beyond edge)
    // Min pan is container size minus grid size (negative value)
    const minX = Math.min(containerWidth - maxGridSize, 0);
    const minY = Math.min(containerHeight - maxGridSize, 0);
    const clampedX = Math.max(Math.min(x, 0), minX);
    const clampedY = Math.max(Math.min(y, 0), minY);

    return { x: clampedX, y: clampedY };
  };

  // Calculate correspond offset after zoom, by compare with centre location
  const calculateOffsetAfterZoom = (): Offset | null => {
    const container = containerRef.current;
    if (!container) return null;

    const prevZoom = prevZoomRef.current;
    if (prevZoom === zoom) return null;

    // Get center of the container
    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;

    // Convert screen center to world coordinates before zoom
    const scaleBefore = Math.pow(2, prevZoom);
    const scaleAfter = Math.pow(2, zoom);

    // New offset to keep the same world point centered
    const worldX = (centerX - prevOffsetRef.current.x) / scaleBefore;
    const worldY = (centerY - prevOffsetRef.current.y) / scaleBefore;

    const newOffsetX = centerX - worldX * scaleAfter;
    const newOffsetY = centerY - worldY * scaleAfter;

    return { x: newOffsetX, y: newOffsetY };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...offset };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current || !dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newOffsetX = offsetStartRef.current.x + dx;
    const newOffsetY = offsetStartRef.current.y + dy;

    const clamped = clampOffset(newOffsetX, newOffsetY);

    prevOffsetRef.current = clamped;
    setOffset(clamped);
  };

  const onMouseUp = () => {
    draggingRef.current = false;
    dragStartRef.current = null;
  };

  const onMouseLeave = () => {
    draggingRef.current = false;
    dragStartRef.current = null;
  };

  // Scroll up: zoom in, Scroll down: zoom out
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
  
    const delta = Math.sign(e.deltaY);
    let newZoom = zoom;
  
    if (delta > 0 && zoom > MIN_TILE_LEVEL) {
      newZoom = zoom - 1;
    } else if (delta < 0 && zoom < MAX_TILE_LEVEL) {
      newZoom = zoom + 1;
    }
  
    if (newZoom !== zoom) {
      // Calculate new offset based on mouse position
      if (mousePosition) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        
        // Mouse position in world coordinates
        const worldX = (mousePosition.x) / Math.pow(2, zoom);
        const worldY = (mousePosition.y) / Math.pow(2, zoom);
        
        // New offset to keep the mouse over the same world point
        const newOffsetX = containerRect.width/2 - worldX * Math.pow(2, newZoom);
        const newOffsetY = containerRect.height/2 - worldY * Math.pow(2, newZoom);
        
        const clamped = clampOffset(newOffsetX, newOffsetY);
        prevOffsetRef.current = clamped;
        setOffset(clamped);
      }
  
      setTransitionZoom(newZoom);
      setTimeout(() => setZoom(newZoom), 100);
    }
  }, [zoom, mousePosition]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left - offset.x;
    const y = e.clientY - containerRect.top - offset.y;
    
    setMousePosition({ x, y });
  };

  // Generate tile URL
  const tileUrl = ({ z, x, y }: TileCoords): string =>
    `http://localhost:8000/assets/tiles/${z}/${x}/${y}.jpg`;

  const GridDisplay = ({ data }: { data: TileCoords[] }) => {
    const gridsize = Math.pow(2, zoom) * TILE_SIZE;

    return (
      <div style={{ width: gridsize, height: gridsize, position: "relative" }}>
        {data.map((img) => (
          <img
            key={`${img.z}-${img.x}-${img.y}`}
            src={tileUrl(img)}
            alt={`Tile ${img.z}-${img.x}-${img.y}`}
            width={TILE_SIZE}
            height={TILE_SIZE}
            draggable={false}
            className="absolute"
            style={{
              left: img.left,
              top: img.top,
              position: "absolute",
            }}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    // Get all tiles in a zoom level
    const maxNumberOfTiles = Math.pow(2, zoom);
    const tiles: TileCoords[] = [];

    for (let x = 0; x < maxNumberOfTiles; x++) {
      for (let y = 0; y < maxNumberOfTiles; y++) {
        tiles.push({
          z: zoom,
          x,
          y,
          left: x * TILE_SIZE,
          top: y * TILE_SIZE,
        });
      }
    }
    setVisibleTiles(tiles);

    // To give the user the best experience, we need to calculate the corresponding offset after zoom.
    if (
      TILE_SIZE * Math.pow(2, zoom) <= window.innerWidth &&
      TILE_SIZE * Math.pow(2, zoom) <= window.innerHeight
    ) {
      // After zooming out, if the image fits within the window,
      // the offset should be (0, 0) to display the image correctly.
      // We won't update prevOffsetRef, as it preserves the previous state,
      // so the next time the user zooms in, it returns to the same spot.
      if (isTilesOverflow === true) {
        setIsTileOverflow(false);
      }
      setOffset({ x: 0, y: 0 });
    } else {
      // If true, the image has never been fully zoomed out.
      // We calculate the new corresponding offset.
      // Otherwise, we use the previous offset stored in prevOffsetRef.
      if (isTilesOverflow === true) {
        const calculatedOffset = calculateOffsetAfterZoom();
        if (calculatedOffset) {
          const clamped = clampOffset(calculatedOffset.x, calculatedOffset.y);
          prevOffsetRef.current = clamped;
          setOffset(clamped);
        }
      } else {
        setOffset(prevOffsetRef.current);
        setIsTileOverflow(true);
      }
    }

    prevZoomRef.current = zoom;

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [zoom, handleWheel]);

  return (
    <>
      <div className="min-w-screen min-h-screen flex justify-center items-center bg-blue-200">
        <div
          ref={containerRef}
          className="max-w-screen max-h-screen overflow-hidden select-none no-scrollbar"
          onMouseMove={handleMouseMove}
        >
          <div
            className="transition-transform duration-100 ease-in-out"
            style={{
              cursor: draggingRef.current ? "grabbing" : "grab",
              transform: `translate(${offset.x}px, ${offset.y}px) ${
                transitionZoom !== null
                  ? `scale(${Math.pow(2, zoom - transitionZoom)})`
                  : "scale(1)"
              }`,
            }}
            onTransitionEnd={() => setTransitionZoom(null)}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            <GridDisplay data={visibleTiles} />
          </div>
        </div>
      </div>

      {/* Zoom Buttons */}
      <div className="fixed bottom-6 right-6 z-10 flex flex-col gap-2">
        <button
          className="w-12 h-12 rounded-full bg-white text-gray-800 shadow-md border border-gray-300 flex items-center justify-center text-2xl hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={() => {
            if (zoom < MAX_TILE_LEVEL) {
              setTransitionZoom(zoom + 1);
              setTimeout(() => setZoom(zoom + 1), 100);
            }
          }}
        >
          +
        </button>
        <button
          className="w-12 h-12 rounded-full bg-white text-gray-800 shadow-md border border-gray-300 flex items-center justify-center text-2xl hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={() => {
            if (zoom > MIN_TILE_LEVEL) {
              setTransitionZoom(zoom - 1);
              setTimeout(() => setZoom(zoom - 1), 100);
            }
          }}
        >
          −
        </button>
      </div>
    </>
  );
}

export default App;
