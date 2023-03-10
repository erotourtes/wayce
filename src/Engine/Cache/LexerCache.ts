import fs from "node:fs";
import * as T from "../../Utils/types.js";
import { logger } from "../../Utils/Utils.js";

export default class LexerCache implements T.CacheManager<T.Tokens> {
  private PATH = process.env.ENGINE_CACHE as string;

  async getCache() {
    try {
      const cache = fs.readFileSync(this.PATH, "utf-8").toString();
      const parsedCache = JSON.parse(cache);

      return this.parseTokensFromArr(parsedCache);
    } catch (err) {
      logger(`Engine cache has some problems ${err}`);
      return null;
    }
  }

  async save(tokens: T.Tokens) {
    logger("saving engine cache");
    return fs.promises.writeFile(
      this.PATH,
      JSON.stringify(this.parseTokensToArray(tokens))
    );
  }

  async clear() {
    logger("clearing engine cache");
    return fs.promises.rm(this.PATH).catch((err) => {
      logger(`can't remove engine cache ${err}`);
    });
  }

  private parseTokensFromArr(arr: [fs.PathLike, [string, number][]][]) {
    const tokens: Map<fs.PathLike, Map<string, number>> = new Map();
    for (const [key, value] of arr) {
      tokens.set(key, new Map(value));
    }

    return tokens;
  }

  private parseTokensToArray(tokens: T.Tokens) {
    const arr = [];

    for (const [key, value] of tokens) {
      logger(`parsing -> ${key}`);
      arr.push([key, [...value]]);
    }

    return arr;
  }
}
