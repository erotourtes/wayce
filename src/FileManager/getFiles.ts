import os from "node:os";
import fs from "node:fs";
import FindFiles from "../FileManager/FindFiles.js";
import logger from "../Utils/logger.js";

const START_PATH = `${os.homedir()}`;
const TMP_PATH = `${os.tmpdir()}/wayce.txt`;

export default async function getPathes() {
  const isExists = fs.existsSync(TMP_PATH);

  if (isExists) {
    logger("Reading from cache");

    const pathes = fs.readFileSync(TMP_PATH, "utf-8").split(os.EOL);

    return pathes;
  }

  logger("Searching files");
  const finder = FindFiles.builder.addExtensions("pdf").build();

  const pathes = await finder.find(START_PATH);

  logger("Writing to cache");
  fs.writeFileSync(TMP_PATH, pathes.join(os.EOL));

  return pathes;
}
