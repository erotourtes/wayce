import url from "node:url";
import http from "node:http";

const api: { [key: string]: any } = {
  search: (input: string) => ({
    res: `searching for ${input}`,
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
    res.end(JSON.stringify(router(query.input)));

    return;
  }

  res.statusCode = 501;
  res.end("Not implemented API");
}
