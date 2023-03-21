import fs from "node:fs";

export function isLetter(ch: string): boolean {
  return !ch ? false :  ch.toLowerCase() !== ch.toUpperCase();
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

  return undefined;
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

    // TOASK - is this needed?
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
