import { test, expect } from "@jest/globals";
import { convert } from "../../src/bigint/converter.mjs";

test("rejects a value already in the active ancestor set", () => {
  const ancestor = {};
  expect(() => convert(ancestor, new WeakSet([ancestor]))).toThrow(
    "Cannot convert circular data to a response",
  );
});
