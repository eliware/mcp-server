import { jest, test, expect } from "@jest/globals";
import { path } from "@eliware/path";
import { discoverTools, normalizeToolsDir } from "../../src/tool/discovery.mjs";

test("normalizes Windows tool folders", () => {
  expect(normalizeToolsDir("C:\\C:\\tools")).toBe("C:\\tools");
  expect(normalizeToolsDir("/C:/tools")).toBe("C:/tools");
});

test("discovers only mjs tools and refreshes the directory list", () => {
  const readDir = jest.fn(() => ["hello.mjs", "notes.txt"]);
  const toolCache = new Map();
  const options = { toolsDir: "/tmp", readDir, toolCache };
  const first = discoverTools(options);
  const second = discoverTools(options);
  expect(first.tools).toEqual([{ file: "hello.mjs", toolName: "hello" }]);
  expect(second.tools).toEqual(first.tools);
  expect(second.tools).not.toBe(first.tools);
  expect(readDir).toHaveBeenCalledTimes(2);
});

test("discovers tools added between server builds", () => {
  const readDir = jest.fn().mockReturnValueOnce(["hello.mjs"]).mockReturnValueOnce(["new.mjs"]);
  const options = { toolsDir: "/tmp", readDir, toolCache: new Map() };
  expect(discoverTools(options).tools).toEqual([{ file: "hello.mjs", toolName: "hello" }]);
  expect(discoverTools(options).tools).toEqual([{ file: "new.mjs", toolName: "new" }]);
});

test("uses the file system reader by default", () => {
  const result = discoverTools({ toolsDir: path(import.meta, "..", "..", "examples", "tools") });
  expect(result.tools.length).toBeGreaterThan(0);
});
