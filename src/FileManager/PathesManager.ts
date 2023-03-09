import fs from "node:fs";
import FindFiles from "../FileManager/FindFiles.js";
import logger from "../Utils/logger.js";
import * as T from "../Utils/types.js";

export default class PathesManager {
  private filterLargeFiles(path: string) {
    const size = fs.statSync(path).size;
    const maxSize = parseInt(process.env.MAX_FILE_SIZE as string);
    return size < maxSize;
  }

  private cache: T.Pathes | null = null;
  private startPath = process.env.START_PATH as string;

  constructor(private cacheManager: T.CacheManager<T.Pathes>) {}

  async getPathes(extensions: string[]) {
    if (this.cache) return this.cache;

    this.cache = await this.cacheManager.getCache();

    if (this.cache && this.isSame(extensions)) {
      logger("Reading from cache");
      return this.cache.content;
    }

    this.cache = {
      ext: extensions,
      content: await this.findPathes(extensions),
    };

    logger("Writing to cache");
    this.cacheManager.save(this.cache);

    return this.cache.content;
  }

  isSame(extensions: string[]) {
    const curExt = this.cache?.ext;
    if (!curExt) return false;

    return (
      extensions.length === curExt.length &&
      extensions.every((extension) => curExt.includes(extension))
    );
  }

  async clearCache() {
    return this.cacheManager.clear();
  }

  private async findPathes(extensions: string[]) {
    logger("Searching files");
    const finder = FindFiles.builder.addExtensions(...extensions).build();
    return (await finder.find(this.startPath)).filter(this.filterLargeFiles);
  }
}
