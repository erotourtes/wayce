import { expect, it, describe } from "@jest/globals";
import { NODE_ENV } from "../config.js";
import Engine from "./Engine.js";
import fs from "node:fs";

// 2 ways to mock a class
jest.mock("./Cache/PathsCache.ts");

jest.mock("./Cache/LexerCache.ts", () =>
  jest.fn().mockImplementation(() => ({
    getCache: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
  }))
);

process.env["--env"] = NODE_ENV.test;
process.env["--start-path"] = `${process.cwd()}/./Test/`;
process.env["--max-file-size"] = "0";

const engine = new Engine({
  ".txt": (path) => fs.promises.readFile(path, "utf-8"),
});

describe("Engine", () => {
  it("should find File3", async () => {
    expect((await engine.search("symbol is here", 1))[0][0]).toEqual(
      `${process.cwd()}/Test/File3.txt`
    );
  });
});
