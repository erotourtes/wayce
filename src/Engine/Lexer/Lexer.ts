import fs from "node:fs";
import { logger } from "../../Utils/Utils.js";
import * as T from "../../Utils/types.js";
import Tokenizer from "./Tokenizer.js";
import LexerCache from "../Cache/LexerCache.js";

export default class Lexer {
  private tokens: Map<fs.PathLike, Map<string, number>> = new Map();

  constructor(
    private cacheManager: T.CacheManager<T.Tokens> = new LexerCache()
  ) {}

  print() {
    console.log(this.tokens);
  }

  async index(files: fs.PathLike[]) {
    logger("indexing");

    const cache = await this.cacheManager.getCache();
    if (cache?.size === files.length) {
      logger("Reading lexer from cache");
      this.tokens = cache;
      return Promise.resolve(this.tokens);
    }

    const promises = files.map((file) => this.indexFile(file));

    return Promise.all(promises).then(() => {
      this.cacheManager.save(this.tokens);
      return this.tokens;
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
        let totalWordsCount = 0;

        const iter = new Tokenizer(content);
        for (const token of iter) {
          tokens.set(token, (tokens.get(token) || 0) + 1);
          totalWordsCount++;
        }

        for (const [token, count] of tokens) {
          tokens.set(token, count / totalWordsCount);
        }
      })
      .catch((err) => {
        logger(err);
      });
  }
}
