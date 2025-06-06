import { TileSet } from "./types";
import { compareTileSets } from "./utils";

describe("utils", () => {
  test("compareTileSets", () => {
    const tilesetA: TileSet = [["1", "1", "0"]];
    const tilesetB: TileSet = [["1", "1", "0"]];

    const result = compareTileSets(tilesetA, tilesetB);
    expect(result).toBe(true);
  });

  test("compareTileSets - same tiles, different order", () => {
    const tilesetA: TileSet = [["1", "1", "0"], ["2", "2", "1"]];
    const tilesetB: TileSet = [["2", "2", "1"], ["1", "1", "0"]];
    expect(compareTileSets(tilesetA, tilesetB)).toBe(true);
  });

  test("compareTileSets - different tiles", () => {
    const tilesetA: TileSet = [["1", "1", "0"]];
    const tilesetB: TileSet = [["2", "1", "0"]];
    expect(compareTileSets(tilesetA, tilesetB)).toBe(false);
  });

  test("compareTileSets - different tiles, different size", () => {
    const tilesetA: TileSet = [["1", "0", "1"]];
    const tilesetB: TileSet = [["1", "1", "0"],["1", "1", "1"]];
    expect(compareTileSets(tilesetA, tilesetB)).toBe(false);
  })

  test("compareTileSets - different sizes", () => {
    const tilesetA: TileSet = [["1", "1", "0"]];
    const tilesetB: TileSet = [["1", "1", "0"], ["2", "2", "2"]];
    expect(compareTileSets(tilesetA, tilesetB)).toBe(false);
  });
});
