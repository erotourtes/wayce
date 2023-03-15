import { expect, it, describe } from "@jest/globals";
import Tokenizer from "./Tokenizer.js";

const testCases: [string, string[]][] = [
  ["some input ", ["some", "input"]],
  ["driver is going to drive", ["drive", "is", "go", "to", "drive"]],
];

describe("Tokenizer", () => {
  for (const testCase of testCases) {
    it(testCase[0], () => {
      const tokenizer = new Tokenizer(testCase[0]);
      const tokens = [...tokenizer];
      expect(tokens).toEqual(testCase[1]);
    });
  }
});
