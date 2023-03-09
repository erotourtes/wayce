import fs from "node:fs";
import logger from "../Utils/logger.js";
import * as T from "../Utils/types.js";

export default class Lexer {
  private tokens: Map<fs.PathLike, Map<string, number>> = new Map();

  constructor(
    private Tokenizer: T.Tokenizable,
    private cacheManager: T.CacheManager<T.Tokens>
  ) {}

  print() {
    console.log(this.tokens);
  }

  async index(files: fs.PathLike[]): Promise<void> {
    logger("indexing");

    const cache = await this.cacheManager.getCache();
    if (cache?.size === files.length) {
      logger("Reading lexer from cache");
      this.tokens = cache;
      return Promise.resolve();
    }

    const promises = files.map((file) => this.indexFile(file));

    return Promise.all(promises).then(() => {
      this.cacheManager.save(this.tokens);
    });
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
}
