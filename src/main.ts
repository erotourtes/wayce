import "./config.js";

import { getPathes, clearCache } from "./FileManager/getFiles.js";
import logger from "./Utils/logger.js";

clearCache();
const files = await getPathes();

logger(files);
