import * as U from "../../Utils/Utils.js";
import stemming from "./Stemming.js";

export default class Tokenizer implements IterableIterator<string> {
  private fileChars: U.Queue<string>;

  constructor(text: string) {
    this.fileChars = U.Queue.fromIterable<string>(text.split(""));
  }

  [Symbol.iterator]() {
    return this;
  }

  next(): IteratorResult<string> {
    const token = this.nextToken().toLowerCase();

    return {
      done: this.fileChars.size <= 0 && token.length === 0,
      value: token ? stemming(token) : "",
    };
  }

  private nextToken() {
    this.trim();

    if (U.isDigit(this.fileChars.peek() || "")) {
      return this.charsWhile(U.isDigit).join("");
    }

    return this.charsWhile(U.isLetter).join("");
  }

  private charsWhile(predicate: (ch: string) => boolean) {
    const chars: string[] = [];

    while (this.fileChars.size > 0) {
      const ch = this.fileChars.peek() as string;
      if (predicate(ch)) chars.push(this.fileChars.dequeue() as string);
      else break;
    }

    return chars;
  }

  private trim(): void {
    while (
      this.fileChars.size > 0 &&
      !this.isNeeded(this.fileChars.peek() || "")
    )
      this.fileChars.dequeue();
  }

  private isNeeded(ch: string): boolean {
    return U.isLetter(ch) || U.isDigit(ch);
  }
}
