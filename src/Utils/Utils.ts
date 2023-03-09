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
