import os from "node:os";
import fs from "node:fs";
import logger from "../Utils/logger.js";

export default class CacheParser {
  private content: string[] = [];
  private extensions: string[] = [];

  pathes() {
    this.readIfEmpty();

    return this.content;
  }

  isSame(extensions: string[]) {
    const isExists = fs.existsSync(process.env.PATHES_CACHE as string);
    if (!isExists) return false;

    this.readIfEmpty();

    const isSame =
      extensions.length === this.extensions.length &&
      extensions.every((extension) => this.extensions.includes(extension));

    logger(isSame ? "Cache is actual" : "Cache is outdated");

    return isSame;
  }

  static format(extensions: string[], content: string[]) {
    const line = extensions.join(" ") + os.EOL;
    return line + content.join(os.EOL);
  }

  private readContent() {
    logger("Reading cache");
    try {
      const TMP_PATH = process.env.PATHES_CACHE as string;

      const [line, ...content] = fs
        .readFileSync(TMP_PATH, "utf-8")
        .split(os.EOL);
      this.extensions = line.split(" ");
      this.content = content;
    } catch (err) {
      logger(`Can't open cache file\n ${err}`);
    }
  }

  private readIfEmpty() {
    if (this.content.length === 0) this.readContent();
  }
}
