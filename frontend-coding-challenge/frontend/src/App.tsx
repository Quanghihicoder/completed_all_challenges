import { useEffect, useRef, useState } from "react";

type TileCoords = {
  z: number;
  x: number;
  y: number;
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
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isTilesOverflow, setIsTileOverflow] = useState(false);
  const draggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const offsetStartRef = useRef({ x: 0, y: 0 });
  const prevOffsetRef = useRef({ x: 0, y: 0 });

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

    const worldX = (centerX - prevOffsetRef.current.x) / scaleBefore;
    const worldY = (centerY - prevOffsetRef.current.y) / scaleBefore;

    // New offset to keep the same world point centered
    const newOffsetX = centerX - worldX * scaleAfter;
    const newOffsetY = centerY - worldY * scaleAfter;

    return { x: newOffsetX, y: newOffsetY };
  };

  // Mouse events for panning
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
  const handleWheel = (e: WheelEvent) => {
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
      setTransitionZoom(newZoom);
      setTimeout(() => setZoom(newZoom), 100);
    }
  };

  // Generate tile URL
  const tileUrl = ({ z, x, y }: TileCoords): string =>
    `http://localhost:8000/assets/tiles/${z}/${x}/${y}.jpg`;

  // Group by 'y' value to form rows
  const groupByY = (data: TileCoords[]) => {
    const grouped: Record<number, TileCoords[]> = {};
    data.forEach(({ z, x, y }) => {
      if (!grouped[y]) grouped[y] = [];
      grouped[y].push({ z, x, y });
    });
    return Object.values(grouped);
  };

  const GridDisplay = ({ data }: { data: TileCoords[] }) => {
    const rows = groupByY(data);

    return (
      <div className="flex flex-col">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row">
            {row
              .sort((a, b) => a.x - b.x)
              .map((point) => (
                <img
                  key={`${point.z}-${point.x}-${point.y}`}
                  src={tileUrl(point)}
                  alt={`Tile ${point.z}-${point.x}-${point.y}`}
                  width={TILE_SIZE}
                  height={TILE_SIZE}
                  draggable={false}
                />
              ))}
          </div>
        ))}
      </div>
    );
  };

  // Load tiles on zoom change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add scroll listener
    container.addEventListener("wheel", handleWheel, { passive: false });

    // Get all tiles in a zoom level
    const maxNumberOfTiles = Math.pow(2, zoom);
    const tiles: TileCoords[] = [];
    for (let x = 0; x < maxNumberOfTiles; x++) {
      for (let y = 0; y < maxNumberOfTiles; y++) {
        tiles.push({ z: zoom, x, y });
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
      if (isTilesOverflow == true) {
        setIsTileOverflow(false);
      }
      setOffset({ x: 0, y: 0 });
    } else {
      // If true, the image has never been fully zoomed out.
      // We calculate the new corresponding offset.
      // Otherwise, we use the previous offset stored in prevOffsetRef.
      if (isTilesOverflow == true) {

        const calculatedOffset: Offset | null = calculateOffsetAfterZoom();

        if (calculatedOffset) {
          const { x: newOffsetX, y: newOffsetY } = calculatedOffset;
          const clamped = clampOffset(newOffsetX, newOffsetY);
          prevOffsetRef.current = clamped;
          setOffset(clamped);
        }
      } else {
        setOffset(prevOffsetRef.current);
        setIsTileOverflow(true);
      }
    }

    // Update previous zoom
    prevZoomRef.current = zoom;


    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [zoom]);

  return (
    <>
      <div className="min-w-screen min-h-screen flex justify-center items-center bg-blue-200">
        <div
          ref={containerRef}
          className="max-w-screen max-h-screen overflow-hidden select-none no-scrollbar "
        >
          <div
            className={`transition-transform duration-100 ease-in-out`}
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
      <div className="fixed bottom-6 right-6 z-10 flex flex-col gap-2">
        <button
          className="w-12 h-12 rounded-full bg-white text-gray-800 shadow-md border border-gray-300 flex items-center justify-center text-2xl hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Zoom In"
          onClick={() => {
            if (!(zoom + 1 > MAX_TILE_LEVEL)) {
              setTransitionZoom(zoom + 1);
              setTimeout(() => setZoom(zoom + 1), 100);
            }
          }}
        >
          +
        </button>
        <button
          className="w-12 h-12 rounded-full bg-white text-gray-800 shadow-md border border-gray-300 flex items-center justify-center text-2xl hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Zoom Out"
          onClick={() => {
            if (!(zoom - 1 < MIN_TILE_LEVEL)) {
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
