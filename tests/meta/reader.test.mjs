import { jest, test, expect } from "@jest/globals";
import { readPackageMeta } from "../../src/meta/reader.mjs";

test("reads and parses the consumer package manifest", () => {
  const readFile = jest.fn().mockReturnValue('{"name":"consumer","version":"2.0.0"}');
  expect(readPackageMeta({ readFile, packagePath: "package.json" })).toEqual({
    name: "consumer",
    version: "2.0.0",
  });
  expect(readFile).toHaveBeenCalledWith("package.json", "utf8");
});

test("reports invalid JSON from the manifest", () => {
  expect(() => readPackageMeta({ readFile: () => "{", packagePath: "package.json" })).toThrow();
});
