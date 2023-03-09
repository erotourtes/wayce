import "./config.js";

import PathesManager from "./FileManager/PathesManager.js";
import EngineFactory from "./Engine/EngineFactory.js";

const cacheManager = new PathesManager();

// await cacheManager.clearCache();
const files = await cacheManager.getPathes(["txt"]);

const engine = EngineFactory.defaultEngine;

await engine.index(files);

// engine.print();
