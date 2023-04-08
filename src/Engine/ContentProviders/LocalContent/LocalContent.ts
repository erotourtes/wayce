import * as T from "../../../Utils/types.js";
import fs from "node:fs";
import { logger } from "../../../Utils/Utils.js";
import { extname } from "node:path";

export default class LocalContent implements T.ContentProvider {
  constructor(private paths: string[], private parsers: T.Parsers) {}

  async getContent() {
    return this.paths.map(
      (path) => [path, this.getContentOf(path)] as [string, Promise<string>]
    );
  }

  private getContentOf(path: fs.PathLike) {
    const ext = extname(path as string) || "";
    const parser = this.parsers[ext];
    if (!parser) {
      logger(`No parser for ${ext} files`);
      return Promise.resolve("");
    }

    const content = parser(path).catch((err) => {
      logger(err);
      return "";
    });

    return content;
  }

}
