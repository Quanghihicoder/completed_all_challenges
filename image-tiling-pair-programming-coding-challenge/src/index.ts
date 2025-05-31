import sharp from "sharp";
import fs from "fs-extra";
import { getImage } from "./Image";
import { setupOutputDir } from "./utilities";
import produceTiles from "./produceTiles";

const outputDirectory = "./tiled-image";
const MAX_TILE_DIMENSION_PIXELS = 256;

const parseArgs = async (args: string[]) => {
  const imagePath = args[0];
  if (typeof imagePath !== "string") {
    throw Error("Must pass path to image as first argument to script.");
  }
  const exists = await fs.pathExists(imagePath);
  if (!exists) {
    throw Error(
      `Path ${imagePath} does not exist. Please check the path and try again.`
    );
  }
  return {
    imagePath,
  };
};

const main = async () => {
  const args = process.argv.slice(2);
  const { imagePath } = await parseArgs(args);
  await setupOutputDir(outputDirectory);
  const image = await getImage(sharp(imagePath));
  await produceTiles(image, outputDirectory, MAX_TILE_DIMENSION_PIXELS);
};

main().catch((err) => {
  if (err instanceof Error) {
    console.log(err.message);
  }
  process.exit(1);
});
