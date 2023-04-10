import fs from "node:fs";
import * as T from "../../Utils/types.js";
import { logger } from "../../Utils/Utils.js";
import os from "node:os";

export default class PathsCache implements T.CacheManager<T.Paths> {
  private TMP_PATH = process.env["--paths-cache"] as string;

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

  async save(paths: T.Paths) {
    logger("Saving paths cache");
    const content = `${paths.ext.join(" ")}${os.EOL}${paths.content.join(
      os.EOL
    )}`;
    return fs.promises.writeFile(this.TMP_PATH, content).catch((err) => {
      logger(`Can't save paths cache ${err}`);
    });
  }

  async clear() {
    logger("Removing cache");
    return fs.promises.rm(this.TMP_PATH).catch((err) => {
      logger(`Cant remove Paths cache ${err}`);
    });
  }
}
