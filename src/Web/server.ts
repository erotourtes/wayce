import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

type route = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => Promise<void>;

const PORT = 3000;

const serveStatic: route = async (req, res) => {
  const url = req.url === "/" ? "/index.html" : req.url;
  const file = path.join(process.cwd(), "./src/Web/Public", url || "");

  return fs.promises
    .readFile(file, "utf8")
    .then((file) => {
      res.statusCode = 200;
      res.end(file.toString());
    })
    .catch(() => {
      res.statusCode = 500;
      res.end("Can't read the file");
    });
};

const handleApi: route = async (req, res) => {
  const myUrl = req.url!;

  const api: { [key: string]: any } = {
    search: (input: string) => ({
      res: `searching for ${input}`,
    }),
    sync: () => "syncing",
  };

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
};

const isStatic = (url: string | undefined) => url === "/" || url?.includes(".");
const isApi = (url: string | undefined) => url?.startsWith("/api");

const server = http.createServer(async (req, res) => {
  const url = req.url || "";
  console.log(`URL: ${url}`);
  try {
    if (isStatic(url)) return serveStatic(req, res);
    if (isApi(url)) return handleApi(req, res);

    throw new Error("Not found");
  } catch (e) {
    res.statusCode = 404;
    res.end(`error ${e}`);
    console.log(e);
  }
});

server.listen(PORT);

server.on("error", (err) => {
  console.log(err.message);
});
