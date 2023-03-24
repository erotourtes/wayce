import http from "node:http";
import handleApi from "./handleApi.js";
import serveStatic from "./serveStatic.js";
import { logger } from "../Utils/Utils.js";

export default function startServer(port: number) {

  const isStatic = (url: string) => url === "/" || url?.includes(".");
  const isApi = (url: string) => url?.startsWith("/api");

  const server = http.createServer(async (req, res) => {
    const url = req.url || "";
    logger(`URL: ${url}`);

    try {
      if (isApi(url)) return handleApi(req, res);
      if (isStatic(url)) return serveStatic(req, res);

      throw new Error("Not found");
    } catch (e) {
      res.statusCode = 404;
      res.end(`error ${e}`);
      logger(e);
    }
  });

  server.listen(port);

  server.on("error", (err) => {
    console.log(err.message);
  });
}
