import fs from "node:fs";
import path from "node:path";
import * as U from "../../Utils/Utils.js";

export default class FindFiles {
  private stack: string[] = [];
  private forbidenFolders: string[] = ["node_modules"];
  private foundFiles: string[] = [];
  private visited: Set<string> = new Set();
  private extensions: string[] = [];

  constructor(ext: string[], folders?: string[]) {
    this.extensions = ext;
    this.forbidenFolders.push(...(folders || []));
  }

  async find(rootPath: string) {
    this.stack.push(rootPath);

    while (this.stack.length) {
      const rootPath = this.stack.pop() as string;
      await this.checkDir(rootPath);
    }

    return this.foundFiles;
  }

  private async checkDir(rootPath: string) {
    const files = await fs.promises.readdir(rootPath, {
      withFileTypes: true,
    });

    for (const file of files) {
      const fullPath = path.join(rootPath, file.name);

      if (this.visited.has(fullPath)) continue;
      this.visited.add(fullPath);

      if (this.isRightFolder(file)) this.stack.push(fullPath);

      if (this.isRightFile(file)) this.foundFiles.push(fullPath);
    }
  }

  private isRightFolder(file: fs.Dirent): boolean {
    const isDotFolder = file.name.startsWith(".");
    const isForbidenFolder = this.forbidenFolders.includes(file.name);
    return file.isDirectory() && !isDotFolder && !isForbidenFolder;
  }

  private isRightFile(file: fs.Dirent) {
    return (
      file.isFile() &&
      this.extensions.includes(U.fileExtensionOf(file.name) || "")
    );
  }

  get found() {
    return this.foundFiles;
  }
}
