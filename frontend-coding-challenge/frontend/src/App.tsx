import { useEffect, useRef, useState } from "react";

type TileCoords = {
  z: number;
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

  // Calculate visible tiles 
  const [visibleTiles, setVisibleTiles] = useState([]);

  useEffect(() => {
    const maxNumberOfTiles = Math.pow(2, zoom);

    const tiles = [];

    for (let x = 0; x < maxNumberOfTiles; x++) {
      for (let y = 0; y < maxNumberOfTiles; y++) {
        tiles.push({ z: zoom, x: x, y: y });
      }
    }

    setVisibleTiles(tiles);
  }, [zoom]);

  const tileUrl = ({ z, x, y }: TileCoords): string =>
    `http://localhost:8000/assets/tiles/${z}/${x}/${y}.jpg`;

  // Group by 'y' value to form rows
  const groupByY = (data: TileCoords[]) => {
    const grouped: Record<number, TileCoords[]> = {};
    data.forEach(({z, x, y }) => {
      if (!grouped[y]) grouped[y] = [];
      grouped[y].push({z, x, y });
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
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative min-w-screen min-h-screen bg-blue-200 no-scrollbar flex items-center justify-center"
      >
        <GridDisplay data={visibleTiles} />
      </div>

      <div className="fixed bottom-6 right-6 z-10 flex flex-col gap-2">
        <button
          className="w-12 h-12 rounded-full bg-white text-gray-800 shadow-md border border-gray-300 flex items-center justify-center text-2xl hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Zoom In"
          onClick={() => {
            if (!(zoom + 1 > MAX_TILE_LEVEL)) {
              setZoom(zoom + 1);
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
              setZoom(zoom - 1);
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