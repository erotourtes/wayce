import fs from "node:fs";

export function isLetter(ch: string): boolean {
  if (ch === undefined) return false;

  ch = ch.toLowerCase();
  return (
    "a".charCodeAt(0) <= ch.charCodeAt(0) &&
    ch.charCodeAt(0) <= "z".charCodeAt(0)
  );
}

export function isDigit(ch: string): boolean {
  return !Number.isNaN(parseFloat(ch));
}

export function logger(message: string | string[] | Error) {
  if (message instanceof Error) {
    console.error(message);
    return;
  }
  if (Array.isArray(message)) {
    message = message.slice(0, 5);
    message.push("...");
  }

  if (process.env.NODE_ENV === "development") console.log(message);
}

export function fileExtensionOf(file: fs.PathLike) {
  const fileName = file.toString();
  for (let i = fileName.length - 1; i >= 0; i--)
    if (fileName[i] === ".") return fileName.slice(i + 1);

  throw new Error(`File ${file} has no extension`);
}
