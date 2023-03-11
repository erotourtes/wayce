import fs from "node:fs";
import { logger } from "../../Utils/Utils.js";
import * as T from "../../Utils/types.js";
import Tokenizer from "./Tokenizer.js";
import LexerCache from "../Cache/LexerCache.js";

export default class Lexer {
  private tokens: Map<fs.PathLike, Map<string, number>> = new Map();

  constructor(
    private parsers: T.Parsers,
    private cacheManager: T.CacheManager<T.Tokens> = new LexerCache()
  ) {}

  print() {
    console.log(this.tokens);
  }

  async index(files: fs.PathLike[]) {
    logger("indexing");

    const cache = await this.cacheManager.getCache();
    if (cache) {
      logger("Reading lexer from cache");
      this.tokens = cache;
    }

    const promises = files
      .filter((file) => this.filterIndexed(file))
      .map((newFile) => this.indexFile(newFile));

    return Promise.all(promises).then(async () => {
      await this.cacheManager.save(this.tokens);
      return this.tokens;
    });
  }

  private async indexFile(file: fs.PathLike): Promise<void> {
    const ext = this.fileExtension(file);
    const content = await this.parsers[ext](file).catch((err) => {
      logger(err);
    });

    if (!content) return Promise.resolve();

    if (!this.tokens.has(file)) this.tokens.set(file, new Map());
    const tokens = this.tokens.get(file) as Map<string, number>;

    let totalWordsCount = 0;
    const iter = new Tokenizer(content);
    for (const token of iter) {
      tokens.set(token, (tokens.get(token) || 0) + 1);
      totalWordsCount++;
    }

    for (const [token, count] of tokens) {
      tokens.set(token, count / totalWordsCount);
    }
  }

  private fileExtension(file: fs.PathLike) {
    return file.toString().split(".").pop() as string;
  }

  private filterIndexed(file: fs.PathLike) {
    return !this.tokens.has(file);
  }
}
