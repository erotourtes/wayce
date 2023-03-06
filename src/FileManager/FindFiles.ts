import fs from "node:fs";
import path from "node:path";

export default class FindFiles {
  private stack: string[] = [];
  private foundFiles: string[] = [];

  constructor(private extensions: string[]) {}

  async find(rootPath: string) {
    this.stack.push(rootPath);

    while (this.stack.length) {
      const rootPath = this.stack.pop()!;
      await this.checkDir(rootPath);
    }

    return this.foundFiles;
  }

  private async checkDir(rootPath: string) {
    const files = await fs.promises.readdir(rootPath, {
      withFileTypes: true,
    });

    for (const file of files) {
      if (this.isRigthFolder(file))
        this.stack.push(path.join(rootPath, file.name));

      if (this.isRightFile(file))
        this.foundFiles.push(path.join(rootPath, file.name));
    }
  }

  private isRigthFolder(file: fs.Dirent): boolean {
    const isDotFolder = file.name.startsWith(".");
    return file.isDirectory() && !isDotFolder;
  }

  private isRightFile(file: fs.Dirent) {
    return (
      file.isFile() && this.extensions.some((ext) => file.name.endsWith(ext))
    );
  }
}
