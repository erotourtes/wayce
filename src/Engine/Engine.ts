import fs from "node:fs";
import LexerFactory from "./LexerFactory.js";
import Tokenizer from "./Tokenizer.js";
import PathesManager from "../FileManager/PathesManager.js";

export default class Engine {
  private lexer;

  constructor() {
    this.lexer = LexerFactory();
    const pathes = new PathesManager();
    pathes.getPathes(["txt"]).then((p) => this.lexer.index(p));
  }

  search(query: string): fs.PathLike[] {
    const tokens = this.tokensFrom(query);

    return tokens;
  }

  private tokensFrom(query: string) {
    const tokenizer = new Tokenizer(query);
    return [...tokenizer];
  }
}
