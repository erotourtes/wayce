export default function logger(message: string | string[]) {
  if (Array.isArray(message)) {
    message = message.slice(0, 5);
    message.push("...");
  }

  if (process.env.NODE_ENV === "development") console.log(message);
}
