import "./config.js";

import search from "./Engine/Engine.js";

console.log(await search("words is going to nvim"));
console.log(await search("read some words"));
