import os from "node:os";
import FindFiles from "./FileManager/FindFiles.js";

const START_PATH = `${os.homedir()}`;

const findFiles = new FindFiles(["txt"]);
const files = await findFiles.find(START_PATH);

console.log(files);
