import { test, expect } from "@jest/globals";
import { withCycleCheck } from "../../src/bigint/cycle-check.mjs";

test("tracks an object while its conversion runs", () => {
  const value = {};
  const ancestors = new WeakSet();
  const result = withCycleCheck(value, ancestors, () => {
    expect(ancestors.has(value)).toBe(true);
    return "converted";
  });

  expect(result).toBe("converted");
  expect(ancestors.has(value)).toBe(false);
});

test("rejects an active ancestor", () => {
  const value = {};
  const ancestors = new WeakSet([value]);
  expect(() => withCycleCheck(value, ancestors, () => "unreachable")).toThrow(
    "Cannot convert circular data to a response",
  );
});

test("clears the ancestor after conversion throws", () => {
  const value = {};
  const ancestors = new WeakSet();
  expect(() =>
    withCycleCheck(value, ancestors, () => {
      throw new Error("failed");
    }),
  ).toThrow("failed");
  expect(ancestors.has(value)).toBe(false);
});
