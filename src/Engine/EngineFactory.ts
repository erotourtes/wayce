import Engine from "./Engine.js";
import Tokenizer from "./Tokenizer.js";
import * as T from "../Utils/types.js";

export default class EngineFactory {
  static get defaultEngine() {
    const tokenizer: T.Tokenizable = {
      getIterator(content: string) {
        return new Tokenizer(content);
      },
    };

    const engine = new Engine(tokenizer);

    return engine;
  }
}
