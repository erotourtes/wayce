import url from "node:url";
import http from "node:http";
import Engine from "../Engine/Engine.js";

const engine = new Engine();

const api: { [key: string]: any } = {
  search: async (input: string) => ({
    res: `${await engine.search(input)}`,
  }),
  sync: () => "syncing",
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
    res.end(JSON.stringify(await router(query.input)));

    return;
  }

  res.statusCode = 501;
  res.end("Not implemented API");
}
