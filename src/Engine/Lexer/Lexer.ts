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

  clearCache() {
    return this.cacheManager.clear();
  }

  async index(...contentProviders: T.ContentProvider[]) {
    logger("indexing");

    const cache = await this.cacheManager.getCache();
    const entries: [T.Path, string][] = [];

    await Promise.all(
      contentProviders.map((contentProvider) =>
        this.loadContent(contentProvider, entries)
      )
    );

    const paths = entries.flatMap(([path, _]) => path);
    const toIndex = paths.filter((path) => !cache?.has(path)).length;
    logger(`new files to index: ${toIndex}`);

    if (toIndex > 0 || !cache) {
      entries.forEach(([path, content]) => this.indexContent(path, content));
      this.applyIDF();
      await this.cacheManager.save(this.tokensPerFile);
    } else {
      this.tokensPerFile = cache;
    }

    return this.tokensPerFile;
  }

  private async loadContent(
    contentProvider: T.ContentProvider,
    entries: [T.Path, string][]
  ) {
    // TODO: think about this
    const allContent = await contentProvider.getContent();
    await Promise.all(
      allContent.map(async ([path, content]) => {
        try {
          entries.push([path, await content]);
        } catch (error) {
          logger(`Error while reading file: ${path}`);
        }
      })
    );
  }

  private indexContent(path: string, content: string) {
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
