import { expect, it, describe } from "@jest/globals";

import LocalContent from "./LocalContent.js";
import fs from "node:fs";

jest.mock("./FileManager/PathsManager.ts", () =>
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

describe("LocalContent", () => {
  it("should return content of files", async () => {
    const parsers = {
      ".txt": (path: fs.PathLike) => fs.promises.readFile(path, "utf-8"),
    };

    const contentProvider = new LocalContent(parsers);
    expect((await contentProvider.getContent())[0][1]).resolves.toBe(
      "Some symbols\n"
    );
  });
});
