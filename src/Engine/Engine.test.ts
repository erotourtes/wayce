import { expect, it, describe } from "@jest/globals";
import Engine from "./Engine.js";
import LocalContent from "./ContentProviders/LocalContent/LocalContent.js";
import fs from "node:fs";
import config from "../config.js";

jest.mock("./Cache/PathsCache.ts");
jest.mock("./Cache/LexerCache.ts");
jest.mock("./ContentProviders/LocalContent/FileManager/PathsManager.ts", () =>
  jest.fn().mockImplementation(() => ({
    getPaths: jest
      .fn()
      .mockResolvedValue([
        `${process.cwd()}/Test/File1.txt`,
        `${process.cwd()}/Test/File2.txt`,
        `${process.cwd()}/Test/File3.txt`,
      ]),
  }))
);

config.env = "test";
config.startPath = `${process.cwd()}/./Test/`;
config.maxFileSize = 0;

const localProvider = new LocalContent({
  ".txt": (path) => fs.promises.readFile(path, "utf-8"),
});
const engine = new Engine([localProvider]);

describe("Engine", () => {
  it("should find File3", async () => {
    expect((await engine.search("symbol is here", 1))[0][0]).toEqual(
      `${process.cwd()}/Test/File3.txt`
    );
  });
});
