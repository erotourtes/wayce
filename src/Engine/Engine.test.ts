import { expect, it, describe } from "@jest/globals";
import { NODE_ENV } from "../config.js";
import Engine from "./Engine.js";
import LocalContent from "./ContentProviders/LocalContent/LocalContent.js";
import fs from "node:fs";

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

process.env["--env"] = NODE_ENV.test;
process.env["--start-path"] = `${process.cwd()}/./Test/`;
process.env["--max-file-size"] = "0";

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
