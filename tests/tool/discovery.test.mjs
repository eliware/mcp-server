import { jest, test, expect } from "@jest/globals";
import { path } from "@eliware/path";
import { discoverTools } from "../../src/tool/discovery.mjs";

test("refreshes the discovered tools between builds", () => {
  const readDir = jest
    .fn()
    .mockReturnValueOnce(["hello.mjs", "notes.txt"])
    .mockReturnValueOnce(["hello.mjs", "new.mjs", "notes.txt"]);
  const toolCache = new Map();
  const options = { toolsDir: "/tmp", readDir, toolCache };
  const first = discoverTools(options);
  const second = discoverTools(options);
  expect(first.tools).toEqual([{ file: "hello.mjs", toolName: "hello" }]);
  expect(second.tools).toEqual([
    { file: "hello.mjs", toolName: "hello" },
    { file: "new.mjs", toolName: "new" },
  ]);
  expect(second.tools).not.toBe(first.tools);
  expect(readDir).toHaveBeenCalledTimes(2);
});

test("uses the file system reader by default", () => {
  const result = discoverTools({ toolsDir: path(import.meta, "..", "..", "examples", "tools") });
  expect(result.tools.length).toBeGreaterThan(0);
});
