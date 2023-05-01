import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const mimeTypes: { [key: string] : string } = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

export default async function serveStatic(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const url = req.url === "/" ? "/index.html" : req.url;
  const file = path.join(process.cwd(), "./src/Web/Public", url || "");

  return fs.promises
    .readFile(file, "utf8")
    .then((content) => {
      const mimeType = mimeTypes[path.extname(file)] || "text/plain";
      res.setHeader("Content-Type", mimeType);

      res.statusCode = 200;
      res.end(content.toString());
    })
    .catch(() => {
      res.statusCode = 500;
      res.end("Can't read the file");
    });
}
