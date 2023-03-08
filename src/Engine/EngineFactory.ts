import Lexer from "./Lexer.js";
import Tokenizer from "./Tokenizer.js";
import * as T from "../Utils/types.js";

export default class EngineFactory {
  static get defaultEngine() {
    const tokenizer: T.Tokenizable = {
      getIterator(content: string) {
        return new Tokenizer(content);
      },
    };

    const engine = new Lexer(tokenizer);

    return engine;
  }
}
