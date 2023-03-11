import * as fs from "fs";

export interface IFileIO {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
}

export type Tokens = Map<fs.PathLike, Map<string, number>>;

export type Pathes = { ext: string[]; content: string[] };

export interface CacheManager<T> {
  getCache(): Promise<T | null>;
  save(cache: T): Promise<void>;
  clear(): Promise<void>;
}

export type Parsers = {
  [key: string]: (path: fs.PathLike) => Promise<string>;
};
