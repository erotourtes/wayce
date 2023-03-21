import "./config.js";
import engineFactory from "./Engine/EngineFactory.js";

const engine = engineFactory();

// await engine.syncWithFileSystem();

const res = await engine.search("IO File");

console.log(res);
