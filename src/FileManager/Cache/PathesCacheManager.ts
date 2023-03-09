import fs from "node:fs";
import * as T from "../../Utils/types.js";
import { logger } from "../../Utils/Utils.js";
import os from "node:os";

export default class PathesCacheManager implements T.CacheManager<T.Pathes> {
  private TMP_PATH = process.env.PATHES_CACHE as string;

  async getCache() {
    try {
      const [line, ...content] = fs
        .readFileSync(this.TMP_PATH, "utf-8")
        .split(os.EOL);

      if (!line || content.length === 0) return null;

      return { ext: line.split(" "), content };
    } catch (err) {
      logger(`Can't open cache file\n ${err}`);
      return null;
    }
  }

  async save(pathes: T.Pathes) {
    logger("Saving pathes cache");
    const content = `${pathes.ext}${os.EOL}${pathes.content.join(os.EOL)}`;
    return fs.promises.writeFile(this.TMP_PATH, content);
  }

  async clear() {
    try {
      logger("Removing cache");
      return fs.promises.rm(this.TMP_PATH).catch((err) => {
        logger(`Cant remove Pathes cache ${err}`);
      });
    } catch (err) {
      logger(`Error removing pathe's cache ${err}`);
      return;
    }
  }
}
