import Lexer from "./Lexer.js";
import Tokenizer from "./Tokenizer.js";
import * as T from "../Utils/types.js";
import EngineCacheManager from "../FileManager/EngineCacheManager.js";

export default class EngineFactory {
  static get defaultEngine() {
    const tokenizer: T.Tokenizable = {
      getIterator(content: string) {
        return new Tokenizer(content);
      },
    };

    const cacheManager = new EngineCacheManager();


    const engine = new Lexer(tokenizer, cacheManager);

    return engine;
  }
}
