import fs from "node:fs";
import FindFiles from "../FileManager/FindFiles.js";
import logger from "../Utils/logger.js";
import CacheParser from "./CacheParser.js";

export async function getPathes(extensions: string[]) {
  const parser = new CacheParser();

  const isSame = parser.isSame(extensions);
  if (isSame) {
    return parser.pathes();
  }

  logger("Searching files");
  const finder = FindFiles.builder.addExtensions(...extensions).build();

  const pathes = await finder.find(process.env.START_PATH as string);

  logger("Writing to cache");
  fs.writeFileSync(
    process.env.TMP_PATH as string,
    CacheParser.format(extensions, pathes)
  );

  return pathes;
}

export function clearCache() {
  const TMP_PATH = process.env.TMP_PATH as string;
  const isExists = fs.existsSync(TMP_PATH);

  if (isExists) {
    logger("Removing cache");
    fs.rmSync(TMP_PATH);
  }
}
