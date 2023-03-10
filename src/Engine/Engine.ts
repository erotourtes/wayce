import fs from "node:fs";
import LexerFactory from "./Lexer/LexerFactory.js";
import Tokenizer from "./Lexer/Tokenizer.js";
import PathesManager from "./FileManager/PathesManager.js";

export default class Engine {
  private lexer;
  private pathes;

  constructor() {
    this.lexer = LexerFactory();
    this.pathes = new PathesManager();
  }

  async search(query: string) {
    const pathes = await this.pathes.getPathes(["txt"]);
    const indexed = await this.lexer.index(pathes);
    const tokens = this.tokensFrom(query);

    const res: Map<fs.PathLike, number> = new Map();

    for (const [file, fileTokens] of indexed) {
      let count = 0;
      for (const token of tokens) {
        const fileTokenCount = fileTokens.get(token) || 0;
        count += fileTokenCount;
      }

      res.set(file, count);
    }

    return res;
  }

  private tokensFrom(query: string) {
    const tokenizer = new Tokenizer(query);
    return [...tokenizer];
  }
}
