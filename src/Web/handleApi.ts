import url from "node:url";
import http from "node:http";
import engineFactory from "../Engine/EngineFactory.js";
import { exec } from "node:child_process";

const engine = engineFactory();
await engine.init();

const api: { [key: string]: any } = {
  search: async (query: { input: string; limit: string }) =>
    JSON.stringify(await engine.search(query.input, +query.limit)),
  sync: async () => await engine.syncWithFileSystem(),
  open: (query: { path: string }) => {
    const command = process.platform.includes("win") ? "start" : "xdg-open";
    exec(`${command} ${query.path}`);
    return "Done";
  },
};

export default async function handleApi(
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
