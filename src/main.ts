import "./config.js";

import getPathes from "./FileManager/getFiles.js";
import logger from "./Utils/logger.js";


const files = await getPathes();

logger(files);
