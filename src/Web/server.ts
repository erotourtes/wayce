import http from "node:http";
import handleApi from "./handleApi.js";
import serveStatic from "./serveStatic.js";

const PORT = 3000;

const isStatic = (url: string) =>
  url === "/" || (url?.includes("."));
const isApi = (url: string) => url?.startsWith("/api");

const server = http.createServer(async (req, res) => {
  const url = req.url || "";
  console.log(`URL: ${url}`);

  try {
    if (isApi(url)) return handleApi(req, res);
    if (isStatic(url)) return serveStatic(req, res);

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
