import FindFiles from "./FindFiles.js";
import { expect, it, describe } from "@jest/globals";

describe("FindFiles", () => {
  it("should find files", async () => {
    const findFiles = new FindFiles([".txt"]);
    const rootPath = `${process.cwd()}/Test`;
    await expect(findFiles.find(rootPath)).resolves.toStrictEqual([
      `${rootPath}/File1.txt`,
      `${rootPath}/File2.txt`,
      `${rootPath}/File3.txt`,
    ]);
  });
});
