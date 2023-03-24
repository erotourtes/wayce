import { expect, it, describe } from "@jest/globals";
import Engine from "./Engine.js";
import fs from "node:fs";

// 2 ways to mock a class
jest.mock("./Cache/PathesCache.ts");

jest.mock("./Cache/LexerCache.ts", () =>
  jest.fn().mockImplementation(() => ({
    getCache: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
  }))
);

process.env.START_PATH = `${process.cwd()}/./Test/`;
process.env.MAX_FILE_SIZE = "0";

const engine = new Engine({
  ".txt": (path) => fs.promises.readFile(path, "utf-8"),
});

describe("Engine", () => {
  it("should find File3", async () => {
    expect((await engine.search("symbol is here", 1))[0][0]).toEqual(
      "/home/sirmax/Files/Documents/projects/js/wayce/Test/File3.txt"
    );
  });
});
