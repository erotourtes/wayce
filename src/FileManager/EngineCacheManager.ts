import fs from "node:fs";
import * as T from "../Utils/types.js";
import logger from "../Utils/logger.js";

export default class EngineCacheManager implements T.CacheManager {
  async getCache() {
    const cache = fs.readFileSync(process.env.ENGINE_CACHE as string, "utf-8");

    const parsedCache = JSON.parse(cache);

    return this.parseTokensFromArr(parsedCache);
  }

  save(tokens: T.Tokens) {
    logger("saving engine cache");
    fs.promises.writeFile(
      process.env.ENGINE_CACHE as string,
      JSON.stringify(this.parseTokensToArray(tokens))
    );
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
