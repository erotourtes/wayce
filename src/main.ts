import "./config.js";
import Engine from "./Engine/Engine.js";


const engine = new Engine();

const res = await engine.search("read some words");

console.log(res.map((r) => r.join(" ")));
// console.log(res1);
