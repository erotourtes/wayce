import { expect, it, describe } from "@jest/globals";

import LocalContent from "./LocalContent.js";
import fs from "node:fs";

describe("LocalContent", () => {
  it("should return content of files", async () => {
    const parsers = {
      ".txt": (path: fs.PathLike) => fs.promises.readFile(path, "utf-8"),
    };

    const contentProvider = new LocalContent(
      [`${process.cwd()}/Test/File1.txt`],
      parsers
    );

    expect(contentProvider.getContent()[0][1]).resolves.toBe("Some symbols\n");
  });
});
