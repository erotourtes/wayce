import Lexer from "./Lexer.js";
import Factory from "./Factory.js";
import fs from "node:fs";
import Tokenizer from "./Tokenizer.js";

export default class Engine {
  lexer: Lexer;

  constructor() {
    this.lexer = Factory.defaultLexer;
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
