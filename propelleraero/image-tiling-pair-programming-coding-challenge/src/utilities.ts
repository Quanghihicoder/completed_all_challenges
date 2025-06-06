import { join } from "path";
import fs from "fs-extra";

export const setupOutputDir = async (path: string) => {
  const exists = await fs.pathExists(path);
  if (exists) {
    await fs.emptyDir(path);
    return;
  }
  await fs.mkdir(path);
};

export const prepareLevelDirectory = async (
  outputPath: string,
  level: number
) => {
  const tileLevelDirectory = join(outputPath, `${level}`);
  await fs.mkdir(tileLevelDirectory);
  return tileLevelDirectory;
};

export const getImageName = (x: number, y: number) => `${x}_${y}.png`;
