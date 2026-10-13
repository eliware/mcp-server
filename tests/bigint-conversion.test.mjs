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
