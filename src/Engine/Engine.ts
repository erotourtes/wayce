import fs from "node:fs";
import logger from "../Utils/logger.js";
import * as T from "../Utils/types.js";

export default class Engine {
  private tokens: Map<fs.PathLike, Map<string, number>> = new Map();

  constructor(private Tokenizer: T.Tokenizable) {}

  async index(files: fs.PathLike[]) {
    await this.indexFiles(files);
  }

  print() {
    console.log(this.tokens);
  }

  private async indexFiles(files: fs.PathLike[]): Promise<void> {
    logger("indexing");

    const cache = this.loadIfExists();
    if (cache?.size === files.length) {
      logger("Engine's Cache found");
      this.tokens = cache;
      return Promise.resolve();
    }

    const promises = files.map((file) => this.indexFile(file));

    return Promise.all(promises).then(() => {});
  }

  private async indexFile(file: fs.PathLike): Promise<void> {
    const filePromise = fs.promises.readFile(file, "utf-8");

    if (!this.tokens.has(file)) {
      this.tokens.set(file, new Map());
    }

    const tokens = this.tokens.get(file) as Map<string, number>;

    return filePromise
      .then((content) => {
        const iter = this.Tokenizer.getIterator(content);

        for (const token of iter) {
          tokens.set(token, (tokens.get(token) || 0) + 1);
        }
      })
      .catch((err) => {
        logger(err);
      });
  }

  save() {
    logger("saving engine cache");
    fs.writeFileSync(
      process.env.ENGINE_CACHE as string,
      JSON.stringify(this.parseTokensToArray())
    );
  }

  private parseTokensToArray() {
    const arr = [];

    for (const [key, value] of this.tokens) {
      logger(`parsing -> ${key}`);
      arr.push([key, [...value]]);
    }

    return arr;
  }

  loadIfExists() {
    if (!fs.existsSync(process.env.ENGINE_CACHE as string)) return null;

    const cache = fs.readFileSync(process.env.ENGINE_CACHE as string, "utf-8");
    return this.parseTokensFromArr(JSON.parse(cache));
  }

  private parseTokensFromArr(arr: [fs.PathLike, [string, number][]][]) {
    const tokens: Map<fs.PathLike, Map<string, number>> = new Map();
    for (const [key, value] of arr) {
      tokens.set(key, new Map(value));
    }

    return tokens;
  }
}
