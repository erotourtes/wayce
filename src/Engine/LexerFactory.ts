import Lexer from "./Lexer.js";
import LexerCacheManager from "../FileManager/Cache/LexerCacheManager.js";

export default function LexerFactory() {
  const cacheManager = new LexerCacheManager();

  return new Lexer(cacheManager);
}
