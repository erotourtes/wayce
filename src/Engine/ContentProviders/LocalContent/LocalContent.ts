import * as T from "../../../Utils/types.js";
import fs from "node:fs";
import { logger } from "../../../Utils/Utils.js";
import { extname } from "node:path";
import PathsManager from "./FileManager/PathsManager.js";

export default class LocalContent implements T.CachableContentProvider {
  constructor(
    private parsers: T.Parsers,
    private pathsManager = new PathsManager()
  ) {}

  clearCache() {
    return this.pathsManager.clearCache();
  }

  async getContent() {
    const paths = await this.getPaths();
    return paths.map(
      (path) => [path, this.getContentOf(path)] as [string, Promise<string>]
    );
  }

  public async getPaths() {
    const parsers = Object.keys(this.parsers);
    const paths = await this.pathsManager.getPaths(parsers);
    return paths;
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
