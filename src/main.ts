import "./config.js";

import { getPathes, clearCache } from "./FileManager/getPathes.js";
import logger from "./Utils/logger.js";

clearCache();
const files = await getPathes(["txt"]);

logger(files);
