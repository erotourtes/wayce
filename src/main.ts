import "./config.js";
import Engine from "./Engine/Engine.js";

const engine = new Engine();

await engine.syncWithFileSystem();

const res = await engine.search(`Start Https Server`);

console.log(res);
