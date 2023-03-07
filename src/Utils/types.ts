export interface Tokenizable {
  getIterator(content: string): IterableIterator<string>
}
