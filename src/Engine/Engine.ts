import fs from "node:fs";
import Lexer from "./Lexer/Lexer.js";
import Tokenizer from "./Lexer/Tokenizer.js";
import * as T from "../Utils/types.js";

type Provider = T.ContentProvider | T.CachableContentProvider;

export default class Engine {
  private lexer = new Lexer();
  private indexed: T.Tokens | null = null;

  constructor(private contentProviders: Provider[]) {}

  async init() {
    return this.lexer.index(...this.contentProviders);
  }

  async search(query: string, limit = 10) {
    const tokens = this.tokensFrom(query);
    if (!this.indexed) this.indexed = await this.init();

    const res: [fs.PathLike, number][] = [];

    for (const [file, fileTokens] of this.indexed) {
      const count = tokens
        .map((token) => fileTokens.get(token) || 0)
        .reduce((val, acc) => val + acc, 0);

      if (count > 0) res.push([file, count]);
    }

    res.sort((a, b) => b[1] - a[1]);

    return res.slice(0, limit);
  }

  async sync() {
    const cachable = this.contentProviders.filter((cp) =>
      T.isCachableContentProvider(cp)
    ) as T.CachableContentProvider[];
    const clearings = [
      ...cachable.map((cp) => cp.clearCache()),
      this.lexer.clearCache(),
    ];
    await Promise.all(clearings);

    this.indexed = null;
    return this.init();
  }

  private tokensFrom = (query: string) => {
    const tokenizer = new Tokenizer(query);
    return [...tokenizer];
  };
}
