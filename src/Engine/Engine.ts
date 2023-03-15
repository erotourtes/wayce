import fs from "node:fs";
import Lexer from "./Lexer/Lexer.js";
import Tokenizer from "./Lexer/Tokenizer.js";
import PathesManager from "./FileManager/PathesManager.js";
import * as T from "../Utils/types.js";
import LexerCache from "./Cache/LexerCache.js";

export default class Engine {
  private fileParsers: T.Parsers = {
    txt: (path: fs.PathLike) => fs.promises.readFile(path, "utf-8"),
    js: (path: fs.PathLike) => fs.promises.readFile(path, "utf-8"),
  };

  private lexerCache = new LexerCache();
  private lexer = new Lexer(this.fileParsers, this.lexerCache);

  private pathesManager = new PathesManager();

  async search(query: string) {
    const tokens = this.tokensFrom(query);
    const indexed = await this.getIndexed();

    const res: Map<fs.PathLike, number> = new Map();

    for (const [file, fileTokens] of indexed) {
      let count = 0;
      for (const token of tokens) {
        const fileTokenCount = fileTokens.get(token) || 0;
        count += fileTokenCount;
      }

      res.set(file, count);
    }

    const sorted = [...res.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

    return sorted;
  }

  async cleanIndexCache() {
    this.lexerCache.clear();
  }

  async syncWithFileSystem() {
    return Promise.all([
      this.pathesManager.clearCache(),
      this.cleanIndexCache(),
    ]);
  }

  private async getIndexed() {
    const parsers = Object.keys(this.fileParsers);
    const pathes = await this.pathesManager.getPathes(parsers);
    const indexed = await this.lexer.index(pathes);
    return indexed;
  }

  private tokensFrom = (query: string) => {
    const tokenizer = new Tokenizer(query);
    return [...tokenizer];
  };
}