import fs from "node:fs";
import logger from "../Utils/logger.js";
import * as T from "../Utils/types.js";

export default class Engine {
  private tokens: Map<string, number> = new Map();

  constructor(private Tokenizer: T.Tokenizable) {}

  async index(files: fs.PathLike[]) {
    await this.indexFiles(files);
  }

  private async indexFiles(files: fs.PathLike[]): Promise<void> {
    const promises = files.map((file) => this.indexFile(file));

    return Promise.all(promises).then(() => {});
  }

  private async indexFile(file: fs.PathLike): Promise<void> {
    const filePromise = fs.promises.readFile(file, "utf-8");

    return filePromise
      .then((content) => {
        const iter = this.Tokenizer.getIterator(content);

        for (const token of iter) {
          console.log("token is", token);
        }
      })
      .catch((err) => {
        logger(err);
      });
  }
}
