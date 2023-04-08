import * as T from "../../../Utils/types.js";
import fs from "node:fs";
import { logger } from "../../../Utils/Utils.js";
import { extname } from "node:path";

export default class LocalContent implements T.ContentProvider {
  constructor(private paths: string[], private parsers: T.Parsers) {}

  private getContentOf(path: fs.PathLike) {
    const ext = extname(path as string) || "";
    const parser = this.parsers[ext];
    if (!parser) {
      logger(`No parser for ${ext} files`);
      return Promise.resolve("");
    }

    const content = parser(path).catch((err) => {
      logger(err);
      return "";
    });

    return content;
  }

  getContent() {
    return this.paths.map(
      (path) => [path, this.getContentOf(path)] as [string, Promise<string>]
    );
  }

  getPaths() {
    return this.paths;
  }
}

/*
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
*/
