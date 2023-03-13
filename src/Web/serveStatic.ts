import fs from "node:fs";
import path from "node:path";
import http from "node:http";

export default async function serveStatic(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
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
}
