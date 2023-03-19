import "./config.js";
// import "./Web/server.js";

import Engine from "./Engine/Engine.js";

const engine = new Engine();

await engine.syncWithFileSystem();

engine.search("test", 10).then(console.log);
