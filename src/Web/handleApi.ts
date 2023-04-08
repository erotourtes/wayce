import url from "node:url";
import http from "node:http";
import engineFactory from "../Engine/EngineFactory.js";
import { exec } from "node:child_process";

const engine = engineFactory();

const api: { [key: string]: any } = {
  search: async (query: { input: string; limit: string }) =>
    JSON.stringify(await engine.search(query.input, +query.limit)),
  sync: async () => await engine.syncWithFileSystem(),
  open: (query: { path: string }) => {
    const forFiles = process.platform.includes("win") ?
      "start" :
      "xdg-open";
    const forLinks = "firefox";
    const command = query.path.startsWith("http") ? forLinks : forFiles;

    exec(`${command} ${query.path}`);
    return "Done";
  },
};

export async function init() {
  await engine.init();
}

export async function handleApi(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const myUrl = req.url!;

  const query = url.parse(myUrl, true).query;
  const action = myUrl.split("?")[0].replace("/api/", "");

  const router = api[action];

  if (router) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(await router(query)));

    return;
  }

  res.statusCode = 501;
  res.end("Not implemented API");
}
