import "./config.js";

import search from "./Engine/Engine.js";

const res = await search("nvim");
// const res1 = await search("read some words");

console.log(res.map((r) => r.join(" ")));
// console.log(res1);
