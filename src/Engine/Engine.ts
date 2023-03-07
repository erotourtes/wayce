import fs from "node:fs";
import logger from "../Utils/logger.js";
import * as T from "../Utils/types.js";

export default class Engine {
  private tokens: Map<fs.PathLike, Map<string, number>> = new Map();

  constructor(private Tokenizer: T.Tokenizable) {}

  async index(files: fs.PathLike[]) {
    await this.indexFiles(files);
  }

  print() {
    console.log(this.tokens);
  }

  private async indexFiles(files: fs.PathLike[]): Promise<void> {
    const promises = files.map((file) => this.indexFile(file));

    return Promise.all(promises).then(() => {});
  }

  private async indexFile(file: fs.PathLike): Promise<void> {
    const size = fs.statSync(file).size;
    if (size > parseInt(process.env.MAX_FILE_SIZE as string))
      return Promise.resolve();

    /*TODO: use readStream for large files
      if you want to remove the MAX_FILE_SIZE env variable*/
    const filePromise = fs.promises.readFile(file, "utf-8");

    if (!this.tokens.has(file)) {
      this.tokens.set(file, new Map());
    }

    const tokens = this.tokens.get(file)!;

    return filePromise
      .then((content) => {
        const iter = this.Tokenizer.getIterator(content);

        for (const token of iter) {
          tokens.set(token, (tokens.get(token) || 0) + 1);
        }
      })
      .catch((err) => {
        logger(err);
      });
  }
}
