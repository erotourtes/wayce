import Engine from "./Engine.js";
import * as T from "../Utils/types.js";
import fs from "node:fs";

import WikiContent from "./ContentProviders/WikiContent/WikiContent.js";
import LocalContent from "./ContentProviders/LocalContent/LocalContent.js";

import loadPdf from "../Parsers/Pdf/pdf.js";

const fileParsers: T.Parsers = {
  // ".md": (path: fs.PathLike) => fs.promises.readFile(path, "utf-8"),
  ".pdf": (path) => loadPdf(path as string),
};
const localProvider = new LocalContent(fileParsers);

const baseUrl = "https://en.wikipedia.org/wiki/Javascript";
const wikiProvider = new WikiContent([baseUrl], 2);
await wikiProvider.init();

export default function engineFactory() {
  return new Engine([wikiProvider, localProvider]);
}
