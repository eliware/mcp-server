import { jest, test, expect } from "@jest/globals";
import { loadPackageMeta } from "../src/meta.mjs";

test("loads consumer package metadata", () =>
  expect(
    loadPackageMeta({
      log: { warn: jest.fn() },
      readFile: () => JSON.stringify({ name: "consumer", version: "2.0.0" }),
    }),
  ).toEqual({ name: "consumer", version: "2.0.0" }));
test("uses explicit metadata", () =>
  expect(loadPackageMeta({ name: "x", version: "2", log: { warn: jest.fn() } })).toEqual({
    name: "x",
    version: "2",
  }));
test("uses explicit values when the manifest omits values", () => {
  expect(
    loadPackageMeta({
      name: "explicit",
      version: "3.0.0",
      log: { warn: jest.fn() },
      readFile: () => JSON.stringify({}),
    }),
  ).toEqual({ name: "explicit", version: "3.0.0" });
});

test("requires explicit metadata when the manifest cannot be read", () => {
  const warn = jest.fn();
  expect(() =>
    loadPackageMeta({
      log: { warn },
      readFile: () => {
        throw new Error("bad");
      },
    }),
  ).toThrow("Set name and version or provide a readable consumer package.json");
  expect(warn).toHaveBeenCalledTimes(1);
});

test("reports metadata errors when no logger is set", () => {
  expect(() =>
    loadPackageMeta({
      readFile: () => {
        throw new Error("bad");
      },
    }),
  ).toThrow("Set name and version or provide a readable consumer package.json");
});

test("uses explicit metadata when the manifest cannot be read", () => {
  expect(
    loadPackageMeta({
      name: "explicit",
      version: "3.0.0",
      log: { warn: jest.fn() },
      readFile: () => {
        throw new Error("bad");
      },
    }),
  ).toEqual({
    name: "explicit",
    version: "3.0.0",
  });
});
test("logs error value when stack is absent", () => {
  const warn = jest.fn();
  expect(() =>
    loadPackageMeta({
      log: { warn },
      readFile: () => {
        throw { message: "bad" };
      },
    }),
  ).toThrow("Set name and version or provide a readable consumer package.json");
  expect(warn).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({ message: "bad" }),
  );
});

test("rejects a manifest without the required consumer metadata", () => {
  expect(() =>
    loadPackageMeta({
      log: { warn: jest.fn() },
      readFile: () => JSON.stringify({}),
    }),
  ).toThrow("Set name and version or provide a readable consumer package.json");
});
