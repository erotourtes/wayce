import fs from "node:fs";
import logger from "../Utils/logger.js";

export default class Engine {
  tokens: Map<string, number> = new Map();

  constructor() {}

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
        const iter = new this.TokenIterator(content);

        for (const token of iter) {
          console.log("token is", token);
        }
      })
      .catch((err) => {
        logger(err);
      });
  }

  private TokenIterator = class implements Iterator<string> {
    private fileChars: string[];
    constructor(text: string) {
      this.fileChars = text.split("");
    }

    [Symbol.iterator](): Iterator<string> {
      return this;
    }

    next(): IteratorResult<string> {
      const index = this.indexOfNextToken();

      const token = this.fileChars.slice(0, index).join("");
      this.fileChars = this.fileChars.slice(index);

      return {
        done: this.fileChars.length === 0,
        value: token,
      };
    }

    private indexOfNextToken(): number {
      this.trim();

      let index = 0;
      while (this.fileChars.length > 0) {
        // TODO - linked list instead of array;
        const ch = this.fileChars[index]?.toLowerCase() as string;
        if (this.isLetter(ch)) index++;
        else break;
      }

      return index;
    }

    private trim(): void {
      while (this.fileChars.length > 0 && !this.isNeeded(this.fileChars[0])) {
        this.fileChars.shift();
      }
    }

    private isLetter(ch: string): boolean {
      ch = ch.toLowerCase();
      return (
        "a".charCodeAt(0) <= ch.charCodeAt(0) &&
        ch.charCodeAt(0) <= "z".charCodeAt(0)
      );
    }

    private isDigit(ch: string): boolean {
      return !Number.isNaN(parseFloat(ch));
    }

    private isNeeded(ch: string): boolean {
      return this.isLetter(ch) || this.isDigit(ch);
    }
  };
}
