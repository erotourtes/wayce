import os from "node:os";

enum NODE_ENV {
  development = "development",
  production = "production",
}

const START_PATH = `${os.homedir()}`;
const PATHES_CACHE = `${os.tmpdir()}/wayce_pathes.txt`;
const ENGINE_CACHE = `${os.tmpdir()}/wayce_engine.txt`;
const MAX_FILE_SIZE = Number(10 ** 5).toString();

const options: { [key: string]: string } = {
  NODE_ENV: NODE_ENV.development,
  START_PATH,
  PATHES_CACHE,
  ENGINE_CACHE,
  MAX_FILE_SIZE,
};

for (const key in options) process.env[key] = options[key];
