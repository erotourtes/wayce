import * as fs from "fs";

export interface Tokenizable {
  getIterator(content: string): IterableIterator<string>;
}

export interface IFileIO {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
}

export type Tokens = Map<fs.PathLike, Map<string, number>>;

export interface CacheManager {
  getCache(): Promise<Tokens>;
  save(tokens: Tokens): void;
}
