import { Image } from "./Image";
import { getImageName, prepareLevelDirectory } from "./utilities";
import { join } from "path";

export const getNumberOfLevelsForImage = (width: number, height: number) => {
  const maxDimension = Math.max(width, height);
  return Math.ceil(1 + Math.log10(maxDimension));
};

const produceTiles = async (
  image: Image,
  outputPath: string,
  maxTileDimension: number,
  deps = { prepareLevelDirectory }
) => {
  const { width, height } = image.properties;
  const maxDimension = Math.max(width, height);
  const numberOfLevels = getNumberOfLevelsForImage(width, height);

  console.log(`Number of levels expected: ${numberOfLevels}`);

  for (let tileLevel = 0; tileLevel < numberOfLevels; tileLevel++) {
    // because tileLevels start at 0 and not 1 we need to subtract 1 in order to have 1*1 pixel at the lowest level
    // and the levelMaxDimension at the highest level equal to the full resolution of the image
    const levelMaxDimension = Math.ceil(
      maxDimension / 2 ** (numberOfLevels - 1 - tileLevel)
    );
    const tileLevelDirectory = await deps.prepareLevelDirectory(
      outputPath,
      tileLevel
    );

    // TODO: should handle rectangles to get ratio of sides
    const levelWidth = levelMaxDimension;
    const levelHeight = levelMaxDimension;

    const resized = await image.resize(levelWidth, levelHeight);

    // TODO: if the max dimension is greater than the maximum allowed tile size cut it up into tiles
    if (levelMaxDimension >= maxTileDimension) {
      const extracted = await resized.extract(
        0,
        0,
        maxTileDimension,
        maxTileDimension
      );
      await extracted.save(join(tileLevelDirectory, getImageName(0, 0)));
    } else {
      await resized.save(join(tileLevelDirectory, getImageName(0, 0)));
    }
  }
};

export default produceTiles;
