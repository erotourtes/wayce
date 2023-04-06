import Engine from "./Engine.js";
import * as T from "../Utils/types.js";
import fs from "node:fs";

const fileParsers: T.Parsers = {
  // txt: (path: fs.PathLike) => fs.promises.readFile(path, "utf-8"),
  // js: (path: fs.PathLike) => fs.promises.readFile(path, "utf-8"),
  ".md": (path: fs.PathLike) => fs.promises.readFile(path, "utf-8"),
};

export default function engineFactory() {
  return new Engine(fileParsers);
}
