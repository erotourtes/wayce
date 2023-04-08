import "./config.js";
// import startServer from "./Web/server.js";
//
// const env = process.env;
//
// if (env["--cli"] === "true") console.log("CLI is not implemented yet");
// else startServer(3000);

import WikiContent from "./Engine/ContentProviders/WikiContent/WikiContent.js";

const wiki = new WikiContent(["https://en.wikipedia.org/wiki/JavaScript"], 7);
const content = await wiki.getContent();

console.log(content);
