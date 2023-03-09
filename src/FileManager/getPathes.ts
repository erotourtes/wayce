import fs from "node:fs";
import FindFiles from "../FileManager/FindFiles.js";
import logger from "../Utils/logger.js";
import CacheParser from "./CacheParser.js";

const filterLargeFiles = (path: string, index: number) => {
  const size = fs.statSync(path).size;
  const maxSize = parseInt(process.env.MAX_FILE_SIZE as string);
  return size < maxSize;
};

export async function getPathes(extensions: string[]) {
  const parser = new CacheParser();

  const isSame = parser.isSame(extensions);
  if (isSame) {
    logger("Reading from cache");
    return parser.pathes();
  }

  logger("Searching files");
  const finder = FindFiles.builder.addExtensions(...extensions).build();

  const pathes = (await finder.find(process.env.START_PATH as string)).filter(
    filterLargeFiles
  );

  logger("Writing to cache");
  fs.writeFileSync(
    process.env.PATHES_CACHE as string,
    CacheParser.format(extensions, pathes)
  );

  return pathes;
}

export function clearCache() {
  const TMP_PATH = process.env.PATHES_CACHE as string;
  const isExists = fs.existsSync(TMP_PATH);

  if (isExists) {
    logger("Removing cache");
    fs.rmSync(TMP_PATH);
  }
}