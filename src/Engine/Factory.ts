import Lexer from "./Lexer.js";
import Tokenizer from "./Tokenizer.js";
import * as T from "../Utils/types.js";
import LexerCacheManager from "../FileManager/Cache/LexerCacheManager.js";

export default class Factory {
  static get defaultLexer() {
    const tokenizer: T.Tokenizable = {
      getIterator(content: string) {
        return new Tokenizer(content);
      },
    };

    const cacheManager = new LexerCacheManager();

    const lexer = new Lexer(tokenizer, cacheManager);

    return lexer;
  }
}
