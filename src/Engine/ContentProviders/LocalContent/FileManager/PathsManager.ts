import fs from "node:fs";
import FindFiles from "../FileManager/FindFiles.js";
import { logger } from "../../../../Utils/Utils.js";
import * as T from "../../../../Utils/types.js";
import PathsCacheManager from "../../../Cache/PathsCache.js";
import config from "../../../../config.js";

export default class PathsManager {
  private cache: T.Paths | null = null;
  private startPath = config.startPath;

  constructor(
    private cacheManager: T.CacheManager<T.Paths> = new PathsCacheManager()
  ) {}

  async getPaths(extensions: string[]) {
    if (this.cache) return this.cache.content;

    this.cache = await this.cacheManager.getCache();
    logger(`paths cache: ${this.cache?.content.length || 0}`);

    const newPaths = await this.findNew(extensions);

    if (newPaths.length > 0) {
      logger("New paths found");
      this.cache = {
        ext: extensions,
        content: [...(this.cache?.content || []), ...newPaths],
      };

      logger("Saving paths to cache");
      this.cacheManager.save(this.cache);
    }

    if (this.cache === null) {
      throw new Error(
        "This shouldn't happend: Cache is null; Maybe you forgot to add parser"
      );
    }

    return this.cache.content;
  }

  async clearCache() {
    return this.cacheManager.clear();
  }

  private async findNew(extensions: string[]) {
    const newExtensions = extensions.filter((ext) => this.filterFounded(ext));
    logger(`newExtensions: ${newExtensions}`);
    return this.findPaths(newExtensions);
  }

  private filterFounded(extension: string) {
    if (!this.cache) return true;
    return !this.cache.ext.includes(extension);
  }

  private async findPaths(extensions: string[]) {
    logger("Searching files");
    const finder = new FindFiles(extensions);
    return (await finder.find(this.startPath)).filter(this.filterLargeFiles);
  }

  private filterLargeFiles(path: string) {
    const size = fs.statSync(path).size;
    const maxSize = config.maxFileSize;

    if (isNaN(maxSize)) throw new Error("Max file size is not a number");
    if (maxSize === 0) return true;

    return size < maxSize;
  }
}
