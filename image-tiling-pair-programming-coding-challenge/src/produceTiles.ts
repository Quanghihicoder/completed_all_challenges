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

    // In image sample 0, cropping starts at level 2
    // Level 0: 75 < 256
    // Level 1: 150 < 256
    // Level 2: 300 > 256

    // In image sample 1, cropping starts at level 1
    // Level 0: 252 < 256
    // Level 1: 504 > 256
    
    const levelMaxDimension = Math.ceil(
      maxDimension / 2 ** (numberOfLevels - 1 - tileLevel)
    );
    const tileLevelDirectory = await deps.prepareLevelDirectory(
      outputPath,
      tileLevel
    );

    // TODO: should handle rectangles to get ratio of sides

    // So the bug is that in image sample 1 the resolution is 3024 x 4032, 
    // it is wrong if resize to 504 x 504
    // it should be 504 x 3024 / 4032 = 378; means 378 x 504

    // In image sample 2: the resolution is 3176 x 2117
    // it is wrong if resize to 397 x 397
    // it should be 397 x 2117 / 3176 = ; means 397 x 265

    const ratio = width / height;
    const levelWidth = ratio > 1 ? levelMaxDimension : Math.ceil(levelMaxDimension * ratio);
    const levelHeight = ratio > 1 ? Math.ceil(levelMaxDimension / ratio) : levelMaxDimension;

    const resized = await image.resize(levelWidth, levelHeight);

    // TODO: if the max dimension is greater than the maximum allowed tile size cut it up into tiles
    if (levelMaxDimension >= maxTileDimension) {
      // Maximum number of images
      // Example: In image sample 1, level 1 — height is 504
      // Each image is 256 pixels high, so 256 * 2 = 512 > 504
      // Therefore, we need 2 images to cover the full height
    
      const maxNumTileWidth = Math.ceil(levelWidth / maxTileDimension)
      const maxNumTileHeight = Math.ceil(levelHeight / maxTileDimension) 

      // This part is a bit tricky
      // Let's say the width is 700. From above, we know we need 3 images: 256 * 3 = 768 > 700
      // Image index 0 starts at x = 0 * 256 = 0 (y = 0, top of the image)
      // Image index 1 starts at x = 1 * 256 = 256 (y = 0, top of the image)
      // Image index 2 (last image) starts at x = 700 - 256 = 444 (y = 0, top of the image)
      // If we started index 2 at 2 * 256 = 512, the image would extend to 512 + 256 = 768,
      // which overshoots the original width, leaving a 68-pixel gap at the end

      // sometimes even this edge-aligned extraction can throw errors, 
      // especially due to rounding or internal padding in libvips.
      // I will throw an error in image sample 2: `extract_area: bad extract area`
      // I can't think of other solution other than -1. Lose 1 x 256. 

      for (let x = 0; x < maxNumTileWidth; x++) {
        for (let y = 0; y < maxNumTileHeight; y++) {
          const extracted = await resized.extract(
            (x == maxNumTileWidth - 1) ? (levelWidth - maxTileDimension - 1) : x * maxTileDimension,
            (y == maxNumTileHeight - 1) ? (levelHeight - maxTileDimension - 1) : y * maxTileDimension,
            maxTileDimension,
            maxTileDimension
          );
          await extracted.save(join(tileLevelDirectory, getImageName(x, y)));
        }
      }
    } else {
      await resized.save(join(tileLevelDirectory, getImageName(0, 0)));
    }
  }
};

export default produceTiles;
