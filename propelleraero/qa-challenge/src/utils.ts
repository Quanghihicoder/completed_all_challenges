import { TileDescriptor, TileSet } from "./types";

// e.g url https://maps.hereapi.com/v3/base/mc/11/1885/1226/png
export const extractTileCoordinate = (url: string): TileDescriptor => {
  const a = url.split("mc/");
  const b = a[1].split("/");

  const z = b[0];
  const x = b[1];
  const y = b[2];

  return [x, y, z];
};

export const compareTileSets = (
  received: TileSet,
  expected: TileSet,
): boolean => {
  // TODO
  const serialize = (tile: TileDescriptor) => tile.join(",");

  const setA = new Set(received.map(serialize));
  const setB = new Set(expected.map(serialize));

  if (setA.size !== setB.size) return false;

  for (const tile of setA) {
    if (!setB.has(tile)) return false;
  }

  return true;
};
