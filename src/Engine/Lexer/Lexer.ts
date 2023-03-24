import fs from "node:fs";
import { logger } from "../../Utils/Utils.js";
import * as T from "../../Utils/types.js";
import Tokenizer from "./Tokenizer.js";
import LexerCache from "../Cache/LexerCache.js";
import { extname } from "node:path";

export default class Lexer {
  private tokensPerFile: Map<fs.PathLike, Map<string, number>> = new Map();

  constructor(
    private parsers: T.Parsers,
    private cacheManager: T.CacheManager<T.Tokens> = new LexerCache()
  ) {}

  print() {
    console.log(this.tokensPerFile);
  }

  async index(files: fs.PathLike[]) {
    logger("indexing");

    const cache = await this.cacheManager.getCache();
    const toIndex = files.filter((file) => !cache?.has(file)).length;

    // Every new file causes reindexing
    if (cache && toIndex === 0) {
      logger("Reading lexer from cache");
      this.tokensPerFile = cache;
    } else {
      logger(`New files: ${toIndex}`);
      await this.indexFiles(files);

      this.applyIDF();
      await this.cacheManager.save(this.tokensPerFile);
    }

    return this.tokensPerFile;
  }

  private async indexFiles(files: fs.PathLike[]) {
    const promises = files.map((file, index) => {
      logger(`\t--> indexing ${index + 1} / ${files.length} -- ${file}`);
      return this.indexFile(file);
    });

    return Promise.all(promises);
  }

  private async indexFile(file: fs.PathLike): Promise<void> {
    const content = await this.getContentOf(file);

    // It needed to be here for cache to understand that file is indexed
    if (!this.tokensPerFile.has(file)) this.tokensPerFile.set(file, new Map());
    const tokens = this.tokensPerFile.get(file) as Map<string, number>;

    if (!content) return Promise.resolve();

    let totalTokens = 0;
    const iter = new Tokenizer(content);
    for (const token of iter) {
      tokens.set(token, (tokens.get(token) || 0) + 1);
      totalTokens++;
    }

    logger(`\t\t--> total tokens: ${totalTokens} -- applying TF`);
    this.applyTF(totalTokens, tokens);
    logger(`\t\t--> indexed ${file}`);
  }

  private async getContentOf(file: fs.PathLike) {
    const ext = extname(file as string) || "";
    const parser = this.parsers[ext];
    if (!parser) {
      logger(`No parser for ${ext} files`);
      return Promise.resolve();
    }

    const content = await parser(file).catch((err) => {
      logger(err);
    });

    return content;
  }

  private applyTF(totalWordsCount: number, tokens: Map<string, number>) {
    for (const [token, count] of tokens) {
      tokens.set(token, count / totalWordsCount);
    }
  }

  private applyIDF() {
    logger("applying IDF to all files");
    const calulatedTokens = new Set();
    for (const [, fileTokens] of this.tokensPerFile) {
      const tokens = fileTokens.keys();

      for (const token of tokens) {
        if (calulatedTokens.has(token)) continue;

        const idf = this.calculateIDF(token);
        this.applyIDFForEveryToken(token, idf);

        calulatedTokens.add(token);
      }
    }
  }

  private calculateIDF(token: string) {
    const N = this.tokensPerFile.size + 1;

    let n = 1; // to avoid division by zero
    for (const [, fileTokens] of this.tokensPerFile) {
      if (fileTokens.has(token)) n++;
    }

    return Math.log(1 + N / n);
  }

  private applyIDFForEveryToken(token: string, idf: number) {
    for (const [, fileTokens] of this.tokensPerFile) {
      if (fileTokens.has(token)) {
        const tf = fileTokens.get(token) as number;
        fileTokens.set(token, tf * idf);
      }
    }
  }
}
