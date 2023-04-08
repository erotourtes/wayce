import http from "node:http";
import { init, handleApi } from "./handleApi.js";
import serveStatic from "./serveStatic.js";
import { logger } from "../Utils/Utils.js";

export default function startServer(port: number) {
  init();

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

  logger(`Server started on port ${port}`);
  server.listen(port);

  server.on("error", (err) => {
    console.log(err.message);
  });
}
