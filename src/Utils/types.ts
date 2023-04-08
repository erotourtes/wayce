import * as fs from "fs";

export type Tokens = Map<fs.PathLike, Map<string, number>>;

// TODO LocalContent
export type Paths = { ext: string[]; content: string[] };

export interface CacheManager<T> {
  getCache(): Promise<T | null>;
  save(cache: T): Promise<void>;
  clear(): Promise<void>;
}

export type Parsers = {
  [key: string]: (path: fs.PathLike) => Promise<string>;
};

export type Path = string;
export interface ContentProvider {
  getContent(): Promise<[Path, Promise<string>][]>;
}
