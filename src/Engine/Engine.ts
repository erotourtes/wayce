import fs from "node:fs";
import Lexer from "./Lexer/Lexer.js";
import Tokenizer from "./Lexer/Tokenizer.js";
import PathesManager from "./FileManager/PathesManager.js";
import * as T from "../Utils/types.js";

const fileParsers: T.Parsers = {
  txt: (path: fs.PathLike) => fs.promises.readFile(path, "utf-8"),
};

const lexer = new Lexer(fileParsers);
const pathesManager = new PathesManager();

const tokensFrom = (query: string) => {
  const tokenizer = new Tokenizer(query);
  return [...tokenizer];
};

export default async function search(query: string) {
  const parsers = Object.keys(fileParsers);
  const pathes = await pathesManager.getPathes(parsers);
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
