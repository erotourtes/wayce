export default function logger(message: string | string[]) {
  if (process.env.NODE_ENV === "development") console.log(message);
}
