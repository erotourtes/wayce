import "./config.js";

// import { getPathes } from "./FileManager/getPathes.js";
// import logger from "./Utils/logger.js";
// import Engine from "./Engine/Engine.js";
//
// const files = await getPathes(["txt"]);
//
// logger(files);
//
// const engine = new Engine();
//
// await engine.index(files);
//
// console.log(engine.tokens);

import EngineFactory from "./Engine/EngineFactory.js";

const engine = EngineFactory.defaultEngine;

await engine.index([`${process.cwd()}/src/Engine/test.txt`]);
