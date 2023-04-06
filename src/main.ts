import "./config.js";
import startServer from "./Web/server.js";

const env = process.env;

if (env["--cli"] === "true") console.log("CLI is not implemented yet");
else startServer(3000);
