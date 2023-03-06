import fs from "node:fs";

export default async function findFiles(...extensions: string[]) {
  const files = await fs.promises.readdir(process.cwd(), {
    withFileTypes: true,
  });
  console.log(files);

  for (const file of files) {
    console.log(file.name, file.isFile());
  }
}
