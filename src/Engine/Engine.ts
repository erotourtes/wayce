import fs from "node:fs";
import Lexer from "./Lexer/Lexer.js";
import Tokenizer from "./Lexer/Tokenizer.js";
import PathesManager from "./FileManager/PathesManager.js";

const lexer = new Lexer();
const pathesManager = new PathesManager();

const tokensFrom = (query: string) => {
  const tokenizer = new Tokenizer(query);
  return [...tokenizer];
};

export default async function search(query: string) {
  const pathes = await pathesManager.getPathes(["txt"]);
  const indexed = await lexer.index(pathes);
  const tokens = tokensFrom(query);

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
