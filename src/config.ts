import os from "node:os";

enum NODE_ENV {
  development = "development",
  production = "production",
}

const START_PATH = `${os.homedir()}`;
const PATHES_CACHE = `${os.tmpdir()}/wayce_pathes.txt`;
const ENGINE_CACHE = `${os.tmpdir()}/wayce_engine.txt`;

const options: { [key: string]: string } = {
  NODE_ENV: NODE_ENV.development,
  START_PATH,
  PATHES_CACHE,
  ENGINE_CACHE,
};

for (const key in options) process.env[key] = options[key];
