import os from "node:os";
import FindFiles from "./FileManager/FindFiles.js";

const START_PATH = `${os.homedir()}`;

const files = await FindFiles.builder
  .addExtensions("pdf")
  .addForbidenFolders("node_modules")
  .build()
  .find(START_PATH);

console.log(files);
