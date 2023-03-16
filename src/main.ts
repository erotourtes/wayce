import "./config.js";
import Engine from "./Engine/Engine.js";
import performance from "node:perf_hooks";

const engine = new Engine();

const start = performance.performance.now();
await engine.syncWithFileSystem();
const end = performance.performance.now();

const res = await engine.search(`Start Https Server`);

console.log(res);
console.log(`Time with queue: ${end - start} ms`);
