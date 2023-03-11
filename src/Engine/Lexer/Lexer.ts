import fs from "node:fs";
import { logger } from "../../Utils/Utils.js";
import * as T from "../../Utils/types.js";
import Tokenizer from "./Tokenizer.js";
import LexerCache from "../Cache/LexerCache.js";

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
    if (cache) {
      logger("Reading lexer from cache");
      this.tokensPerFile = cache;
    }

    const toIndex = files.filter((file) => this.filterIndexed(file));
    if (toIndex.length > 0) {
      await this.indexFiles(toIndex);

      this.applyIDF();
      await this.cacheManager.save(this.tokensPerFile);
    }

    return this.tokensPerFile;
  }

  private async indexFiles(files: fs.PathLike[]) {
    const promises = files.map((file) => this.indexFileWithTF(file));

    return Promise.all(promises);
  }

  private async indexFileWithTF(file: fs.PathLike): Promise<void> {
    console.log(`\t--> indexing ${file}`);
    const ext = this.fileExtensionOf(file);
    const parser = this.parsers[ext];
    if (!parser) {
      logger(`No parser for ${ext} files`);
      return Promise.resolve();
    }

    const parsedPromise = parser(file);
    const content = await parsedPromise.catch((err) => {
      logger(err);
    });

    if (!this.tokensPerFile.has(file)) this.tokensPerFile.set(file, new Map());
    const tokens = this.tokensPerFile.get(file) as Map<string, number>;

    if (!content) return Promise.resolve();

    let totalWordsCount = 0;
    const iter = new Tokenizer(content);
    for (const token of iter) {
      tokens.set(token, (tokens.get(token) || 0) + 1);
      totalWordsCount++;
    }

    this.applyTF(totalWordsCount, tokens);
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
    const N = this.tokensPerFile.size;

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

  private fileExtensionOf(file: fs.PathLike) {
    return file.toString().split(".").pop() as string;
  }

  private filterIndexed(file: fs.PathLike) {
    return !this.tokensPerFile.has(file);
  }
}
