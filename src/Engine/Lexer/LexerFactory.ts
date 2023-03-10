import Lexer from "./Lexer.js";
import LexerCacheManager from "../Cache/LexerCache.js";

export default function LexerFactory() {
  const cacheManager = new LexerCacheManager();

  return new Lexer(cacheManager);
}
