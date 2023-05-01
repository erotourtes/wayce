import os from "node:os";
import { Config } from "./Utils/types.js";

const getConfigOf = (defaults: Config, args: string[]): Config => {
  const parser = {
    number: (value: string) => Number(value),
    string: (value: string) => value,
  };

  const options: Partial<Config> = {};
  for (const arg of args) {
    if (!arg.startsWith("--")) continue;

    const [key, value] = arg.split("=");
    // makes from --option-name -> optionName
    const optionName = key
      .substring(2)
      .replace(/-([a-z])/g, (_, match) =>
        match.toUpperCase()
      ) as keyof Config;

    if (!defaults[optionName]) throw new Error(`Unknown option: ${key}`);

    const type = typeof defaults[optionName] as keyof typeof parser;
    options[optionName]! = parser[type](value) as never;
  }

  return { ...defaults, ...options } as Config;
};

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
