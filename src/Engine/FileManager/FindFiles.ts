import fs from "node:fs";
import path from "node:path";
import * as U from "../../Utils/Utils.js";

export default class FindFiles {
  private stack: string[] = [];
  private forbidenFolders: string[] = ["node_modules"];
  private foundFiles: string[] = [];
  private visited: Set<string> = new Set();
  private extensions: string[] = [];

  private constructor() {}

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

      if (this.isRigthFolder(file)) this.stack.push(fullPath);

      if (this.isRightFile(file)) this.foundFiles.push(fullPath);
    }
  }

  private isRigthFolder(file: fs.Dirent): boolean {
    const isDotFolder = file.name.startsWith(".");
    const isForbidenFolder = this.forbidenFolders.includes(file.name);
    return file.isDirectory() && !isDotFolder && !isForbidenFolder;
  }

  private isRightFile(file: fs.Dirent) {
    return (
      file.isFile() &&
      this.extensions.some((ext) => U.fileExtensionOf(file.name) === ext)
    );
  }

  static get builder() {
    return new FindFiles.Builder();
  }

  get found() {
    return this.foundFiles;
  }

  private static Builder = class {
    findFiles: FindFiles;
    constructor() {
      this.findFiles = new FindFiles();
    }

    addExtensions(...ext: string[]) {
      this.findFiles.extensions.push(...ext);
      return this;
    }

    addForbidenFolders(...folder: string[]) {
      this.findFiles.forbidenFolders.push(...folder);
      return this;
    }

    build() {
      return this.findFiles;
    }
  };
}
