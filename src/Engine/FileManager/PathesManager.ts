import fs from "node:fs";
import FindFiles from "../FileManager/FindFiles.js";
import { logger } from "../../Utils/Utils.js";
import * as T from "../../Utils/types.js";
import PathesCacheManager from "../Cache/PathesCache.js";

export default class PathesManager {
  private cache: T.Pathes | null = null;
  private startPath = process.env.START_PATH as string;

  constructor(
    private cacheManager: T.CacheManager<T.Pathes> = new PathesCacheManager()
  ) {}

  async getPathes(extensions: string[]) {
    if (this.cache) return this.cache.content;

    this.cache = await this.cacheManager.getCache();
    logger(`pathes cache: ${this.cache?.content.length || 0}`);

    const newPathes = await this.findNew(extensions);

    if (newPathes.length > 0) {
      logger("New pathes found");
      this.cache = {
        ext: extensions,
        content: [...(this.cache?.content || []), ...newPathes],
      };

      logger("Writing to cache");
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
    return this.findPathes(newExtensions);
  }

  private filterFounded(extension: string) {
    if (!this.cache) return true;
    return !this.cache.ext.includes(extension);
  }

  private async findPathes(extensions: string[]) {
    logger("Searching files");
    const finder = FindFiles.builder.addExtensions(...extensions).build();
    return (await finder.find(this.startPath)).filter(this.filterLargeFiles);
  }

  private filterLargeFiles(path: string) {
    const size = fs.statSync(path).size;
    const maxSize = parseInt(process.env.MAX_FILE_SIZE as string);

    if (isNaN(maxSize)) throw new Error("MAX_FILE_SIZE is not a number");
    if (maxSize === 0) return true;

    return size < maxSize;
  }
}
