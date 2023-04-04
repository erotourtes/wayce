import { expect, it, describe } from "@jest/globals";
import stem from "./Stemming.js";

const testCases = [
  "cared -> care",
  "caring -> care",
  "cares -> care",
  "careful -> care",
  "careless -> care",
  "carefully -> care",
  "driver -> drive",
  "drive -> drive",
  "largest -> largest",
  "happiness -> happi",
  "imperialism -> imperi",
  "imperialist -> imperi",
  "successability -> success",
  "incompatibility -> incompat",
  "active -> act",
  "realize -> real",
  "realise -> real",
];

describe("stemming", () => {
  for (const testCase of testCases) {
    it(testCase, () => {
      const [word, expected] = testCase.split(" -> ");
      expect(stem(word)).toBe(expected);
    });
  }
});
