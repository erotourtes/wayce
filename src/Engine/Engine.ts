import fs from "node:fs";

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

    return filePromise.then((content) => {
      const iter = new this.TokenIterator(content);

      for (const token of iter) {
        console.log(token);
      }
    });
  }

  private TokenIterator = class implements Iterator<string> {
    private fileText: string[];
    constructor(text: string) {
      this.fileText = text.split("");
    }

    [Symbol.iterator](): Iterator<string> {
      return this;
    }

    private isLetter(ch: string): boolean {
      ch = ch.toLowerCase();
      return (
        "a".charCodeAt(0) <= ch.charCodeAt(0) &&
        ch.charCodeAt(0) <= "z".charCodeAt(0)
      );
    }

    private isDigit(ch: string): boolean {
      return !Number.isNaN(Number(ch));
    }

    next(): IteratorResult<string> {
      const index = 0;
      while (this.fileText.length !== 0) {
        const ch = this.fileText[index].toLowerCase();
        if (this.isLetter(ch)) break;
      }

      this.fileText = this.fileText.slice(index);

      return {
        done: this.fileText.length !== 0 && value !== "",
        value: "hello",
      };
    }
  };
}
