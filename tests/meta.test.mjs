import { jest, test, expect } from "@jest/globals";
import { loadPackageMeta } from "../src/meta.mjs";
import packageMeta from "../package.json" with { type: "json" };

test("loads package metadata", () =>
  expect(loadPackageMeta({ log: { warn: jest.fn() } })).toMatchObject({
    name: "@eliware/mcp-server",
  }));
test("uses explicit metadata", () =>
  expect(loadPackageMeta({ name: "x", version: "2", log: { warn: jest.fn() } })).toEqual({
    name: "x",
    version: "2",
  }));
test.each([
  ["missing metadata values", () => JSON.stringify({}), "test", 0],
  [
    "unreadable metadata",
    () => {
      throw new Error("bad");
    },
    undefined,
    1,
  ],
])("uses package fallback values for %s", (_case, readFile, packagePath, warningCount) => {
  const warn = jest.fn();
  expect(loadPackageMeta({ log: { warn }, readFile, packagePath })).toEqual({
    name: packageMeta.name,
    version: packageMeta.version,
  });
  expect(warn).toHaveBeenCalledTimes(warningCount);
});
test("logs error value when stack is absent", () => {
  const warn = jest.fn();
  loadPackageMeta({
    log: { warn },
    readFile: () => {
      throw { message: "bad" };
    },
  });
  expect(warn).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({ message: "bad" }),
  );
});
