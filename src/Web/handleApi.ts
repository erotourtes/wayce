import url from "node:url";
import http from "node:http";
import Engine from "../Engine/Engine.js";
import { exec } from "node:child_process";

const engine = new Engine();
await engine.init();

const api: { [key: string]: any } = {
  search: async (query: { input: string; limit: string }) =>
    JSON.stringify(await engine.search(query.input, +query.limit)),
  sync: () => "syncing",
  open: (query: { path: string }) => {
    console.log(query.path);
    exec("google-chrome " + query.path);
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
  console.log("action is", action);

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
