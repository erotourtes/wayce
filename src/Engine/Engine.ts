import fs from "node:fs";
import Lexer from "./Lexer/Lexer.js";
import Tokenizer from "./Lexer/Tokenizer.js";
import * as T from "../Utils/types.js";
import PathsManager from
  "./ContentProviders/LocalContent/FileManager/PathsManager.js";
import LocalContent from "./ContentProviders/LocalContent/LocalContent.js";

export default class Engine {
  private lexer: Lexer;
  private pathsManager: PathsManager;

  constructor(private fileParsers: T.Parsers) {
    this.lexer = new Lexer();

    this.pathsManager = new PathsManager();
  }

  async init() {
    await this.getIndexed();
  }

  async search(query: string, limit = 10) {
    const tokens = this.tokensFrom(query);
    const indexed = await this.getIndexed();

    const res: [fs.PathLike, number][] = [];

    for (const [file, fileTokens] of indexed) {
      const count = tokens
        .map((token) => fileTokens.get(token) || 0)
        .reduce((val, acc) => val + acc, 0);

      if (count > 0) res.push([file, count]);
    }

    res.sort((a, b) => b[1] - a[1]);

    return res.slice(0, limit);
  }

  async syncWithFileSystem() {
    return Promise.all([
      this.pathsManager.clearCache(),
      this.lexer.clearCache(),
      this.init(),
    ]);
  }

  private async getIndexed() {
    const parsers = Object.keys(this.fileParsers);
    const paths = await this.pathsManager.getPaths(parsers);
    const localProvider = new LocalContent(paths, this.fileParsers);

    const indexed = await this.lexer.index(localProvider);
    return indexed;
  }

  private tokensFrom = (query: string) => {
    const tokenizer = new Tokenizer(query);
    return [...tokenizer];
  };
}
