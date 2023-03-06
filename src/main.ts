import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const START_PATH = `${os.homedir()}`;

const stack: string[] = [START_PATH];
const foundFiles: string[] = [];

const extensions = ["pdf", "jpg"];

const isRigthFolder = (file: fs.Dirent): boolean => {
  const isDotFolder = file.name.startsWith(".");
  return file.isDirectory() && !isDotFolder;
};

// const getFullLinkPath = async (
//   file: fs.Dirent,
//   rootPath: string
// ): Promise<string> => {
//   if (!file.isSymbolicLink()) return file.name;
//
//   const rightPath = await fs.promises.readlink(path.join(rootPath, file.name));
//
//   return rightPath;
// };

const isRightFile = (file: fs.Dirent) =>
  file.isFile() && extensions.some((ext) => file.name.endsWith(ext));

async function findFiles(rootPath: string) {
  const files = await fs.promises.readdir(rootPath, {
    withFileTypes: true,
  });

  for (const file of files) {
    if (isRigthFolder(file)) stack.push(path.join(rootPath, file.name));

    // if (file.isSymbolicLink()) {
    //   const link = await getFullLinkPath(file, rootPath);
    //   stack.push(path.join(rootPath, link));
    // }

    if (isRightFile(file)) {
      foundFiles.push(path.join(rootPath, file.name));
    }
  }
}

async function find() {
  while (stack.length) {
    const rootPath = stack.pop()!;
    await findFiles(rootPath);
  }
}

await find();

console.log(stack);
console.log(foundFiles);
