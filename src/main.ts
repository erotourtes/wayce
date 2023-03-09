import "./config.js";

// import { getPathes, clearCache } from "./FileManager/getPathes.js";
// import logger from "./Utils/logger.js";
// import EngineFactory from "./Engine/EngineFactory.js";
//
// // clearCache();
// const files = await getPathes(["txt"]);
//
// console.log(files);
//
// const engine = EngineFactory.defaultEngine;
//
// await engine.index(files);
//
// engine.print();

import PathesManager from "./FileManager/PathesManager.js";
import PathesCacheManager from "./FileManager/PathesCacheManager.js";

const cacheManager = new PathesManager(new PathesCacheManager());

// await cacheManager.clearCache();
console.log(await cacheManager.getPathes(["txt"]));


// engine.print();

// import EngineFactory from "./Engine/EngineFactory.js";
//
// const engine = EngineFactory.defaultEngine;
//
// await engine.index([
//   `${process.cwd()}/src/Engine/test.txt`,
//   `${process.cwd()}/src/Engine/test1.txt`,
// ]);
//
// engine.print();
