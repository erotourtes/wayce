import os from "node:os";
import { Config } from "./Utils/types.js";
import { getConfigOf } from "./Utils/Utils.js";

const defaults: Config = {
  env: "development",
  startPath: `${os.homedir()}`,
  pathsCache: `${os.tmpdir()}/wayce_paths.txt`,
  engineCache: `${os.tmpdir()}/wayce_engine.txt`,
  maxFileSize: 10 ** 6,
  port: 3000,
};

const args = process.argv.slice(2);
const config = getConfigOf(defaults, args);

export default config;
