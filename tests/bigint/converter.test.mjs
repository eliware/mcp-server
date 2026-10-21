import { test, expect } from "@jest/globals";
import { convert } from "../../src/bigint/converter.mjs";

test("converts BigInts in nested arrays and objects", () => {
  expect(convert({ count: 1n, nested: [2n] }, new WeakSet())).toEqual({
    count: "1",
    nested: ["2"],
  });
});

test("returns primitive values unchanged", () => {
  for (const value of ["text", null, undefined, 42, false]) {
    expect(convert(value, new WeakSet())).toBe(value);
  }
});

test("reconverts shared references after each traversal", () => {
  const shared = { value: 1n };
  expect(convert({ first: shared, second: shared }, new WeakSet())).toEqual({
    first: { value: "1" },
    second: { value: "1" },
  });
});

test("rejects circular values", () => {
  const circular = {};
  circular.self = circular;
  expect(() => convert(circular, new WeakSet())).toThrow(
    "Cannot convert circular data to a response",
  );
});
