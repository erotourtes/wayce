import os from "node:os";

export enum NODE_ENV {
  development = "development",
  production = "production",
  test = "test",
}

const args = process.argv.slice(2);

const defaults: { [key: string]: string } = {
  "--env": NODE_ENV.development,
  "--start-path": `${os.homedir()}`,
  "--paths-cache": `${os.tmpdir()}/wayce_paths.txt`,
  "--engine-cache": `${os.tmpdir()}/wayce_engine.txt`,
  "--max-file-size": Number(10 ** 6).toString(),
  "--cli": "false",
};

for (const arg of args) {
  const [key, value] = arg.split("=");

  if (defaults[key])
    defaults[key] = value ? value : "true";
}

for (const key in defaults) process.env[key] = defaults[key];
