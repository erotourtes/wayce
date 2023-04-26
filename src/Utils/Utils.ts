import config from "../config.js";
import * as T from "./types.js";

export function isLetter(ch: string): boolean {
  return !ch ? false : ch.toLowerCase() !== ch.toUpperCase();
}

export function isDigit(ch: string): boolean {
  return !Number.isNaN(parseFloat(ch));
}

export function logger(message: string | string[] | Error) {
  const env = config.env;
  if (env === "test" || env === "production") return;

  if (message instanceof Error) {
    console.error(message);
    return;
  }
  if (Array.isArray(message)) {
    message = message.slice(0, 5);
    message.push("...");
  }

  console.log(message);
}

type Node<T> = {
  value: T;
  next: Node<T> | null;
};

export class Queue<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  size = 0;

  enqueue(item: T) {
    const node: Node<T> = { value: item, next: null };

    this.size++;
    if (!this.head) {
      this.head = node;
      this.tail = node;
      return this;
    }

    const current = this.tail as Node<T>;

    current.next = node;
    this.tail = node;

    return this;
  }

  enqueueAll(items: T[]) {
    for (const item of items) this.enqueue(item);
    return this;
  }

  dequeue() {
    if (!this.head) return;

    this.size--;
    const head = this.head;
    this.head = head.next;

    head.next = null;

    return head.value;
  }

  peek() {
    return this.head?.value;
  }

  static fromIterable<T>(items: T[]) {
    const list = new Queue<T>();
    list.enqueueAll(items);

    return list;
  }
}

export const getConfigOf = (defaults: T.Config, args: string[]): T.Config => {
  const parser = {
    number: (value: string) => Number(value),
    string: (value: string) => value,
  };

  const options: Partial<T.Config> = {};
  for (const arg of args) {
    const [key, value] = arg.split("=");
    // makes from --option-name -> optionName
    const optionName = key
      .substring(2)
      .replace(/-([a-z])/g, (_, match) =>
        match.toUpperCase()
      ) as keyof T.Config;

    if (!defaults[optionName]) throw new Error(`Unknown option: ${key}`);

    const type = typeof defaults[optionName] as keyof typeof parser;
    options[optionName]! = parser[type](value) as never;
  }

  return { ...defaults, ...options } as T.Config;
};
