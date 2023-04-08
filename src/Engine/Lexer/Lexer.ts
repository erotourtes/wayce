import fs from "node:fs";
import { logger } from "../../Utils/Utils.js";
import * as T from "../../Utils/types.js";
import Tokenizer from "./Tokenizer.js";
import LexerCache from "../Cache/LexerCache.js";

export default class Lexer {
  private tokensPerFile: Map<fs.PathLike, Map<string, number>> = new Map();

  constructor(
    private cacheManager: T.CacheManager<T.Tokens> = new LexerCache()
  ) {}

  print() {
    console.log(this.tokensPerFile);
  }

  clearCache() {
    return this.cacheManager.clear();
  }

  async index(contentProvider: T.ContentProvider) {
    logger("indexing");

    const cache = await this.cacheManager.getCache();
    const allContent =  contentProvider.getContent();

    // TODO isCacheValid
    const paths = contentProvider.getPaths();
    const toIndex = paths.filter((path) => !cache?.has(path)).length;
    if (cache && toIndex === 0) {
      logger("Reading lexer from cache");
      this.tokensPerFile = cache;
      return this.tokensPerFile;
    }

    logger(`New files: ${toIndex}`);

    const promises = allContent
      .map(async ([path, content]) => this.indexContent(path, await content));

    await Promise.all(promises);

    this.applyIDF();
    await this.cacheManager.save(this.tokensPerFile);

    return this.tokensPerFile;
  }

  private async indexContent(path: string, content: string): Promise<void> {
    if (!this.tokensPerFile.has(path)) this.tokensPerFile.set(path, new Map());
    if (!content) return Promise.resolve();

    let totalTokens = 0;
    const tokens = this.tokensPerFile.get(path) as Map<string, number>;
    const iter = new Tokenizer(content);
    for (const token of iter) {
      tokens.set(token, (tokens.get(token) || 0) + 1);
      totalTokens++;
    }

    logger(`\t\t--> total tokens: ${totalTokens} -- applying TF`);
    this.applyTF(totalTokens, tokens);
    logger(`\t\t--> indexed ${path}`);
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
