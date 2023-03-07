import os from "node:os";

enum NODE_ENV {
  development = "development",
  production = "production",
}

const START_PATH = `${os.homedir()}`;
const TMP_PATH = `${os.tmpdir()}/wayce.txt`;

const options: { [key: string]: string } = {
  NODE_ENV: NODE_ENV.development,
  START_PATH,
  TMP_PATH,
};

for (const key in options) process.env[key] = options[key];
