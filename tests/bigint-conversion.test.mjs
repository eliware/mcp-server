import { test, expect } from "@jest/globals";
import { convertBigIntToString } from "../src/bigint-conversion.mjs";

test("converts nested BigInts", () => {
  expect(convertBigIntToString({ a: 1n, b: [2n] })).toEqual({ a: "1", b: ["2"] });
});

test("returns primitive values unchanged", () => {
  expect(convertBigIntToString("text")).toBe("text");
  expect(convertBigIntToString(null)).toBeNull();
  expect(convertBigIntToString(42)).toBe(42);
});

test("converts repeated values and rejects circular data", () => {
  const shared = { value: 1n };
  expect(convertBigIntToString({ first: shared, second: shared })).toEqual({
    first: { value: "1" },
    second: { value: "1" },
  });
  const circular = {};
  circular.self = circular;
  expect(() => convertBigIntToString(circular)).toThrow(
    "Cannot convert circular data to a response",
  );
});
