import * as U from "../../Utils/Utils.js";
import stemming from "./Stemming.js";

export default class Tokenizer implements IterableIterator<string> {
  private fileChars: string[];

  constructor(text: string) {
    this.fileChars = text.split("");
  }

  [Symbol.iterator]() {
    return this;
  }

  next(): IteratorResult<string> {
    const index = this.indexOfNextToken();

    const token = this.fileChars.slice(0, index).join("");
    this.fileChars = this.fileChars.slice(index);

    return {
      done: this.fileChars.length <= 0 && token.length === 0,
      value: token ? stemming(token) : "",
    };
  }

  private indexOfNextToken(): number {
    this.trim();

    if (U.isDigit(this.fileChars[0])) {
      return this.indexOfTokenWhile(U.isDigit);
    }

    return this.indexOfTokenWhile(U.isLetter);
  }

  private indexOfTokenWhile(predicate: (ch: string) => boolean) {
    let index = 0;

    while (this.fileChars.length > 0) {
      // TODO - linked list instead of array;
      const ch = this.fileChars[index]?.toLowerCase() as string;
      if (predicate(ch)) index++;
      else break;
    }

    return index;
  }

  private trim(): void {
    while (this.fileChars.length > 0 && !this.isNeeded(this.fileChars[0])) {
      this.fileChars.shift();
    }
  }

  private isNeeded(ch: string): boolean {
    return U.isLetter(ch) || U.isDigit(ch);
  }
}
