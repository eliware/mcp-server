import { test, expect } from "@jest/globals";
import { resolve } from "node:path";
import { findPackagePath } from "../../src/server/package-path.mjs";

test("finds the nearest consumer manifest above its entry file", () => {
  const appDir = resolve(process.cwd(), "app");
  const checked = [];
  const result = findPackagePath({
    entrypoint: resolve(appDir, "bin", "server.js"),
    exists: (file) => {
      checked.push(file);
      return file === resolve(appDir, "package.json");
    },
  });
  expect(result).toBe(resolve(appDir, "package.json"));
  expect(checked).toEqual([
    resolve(appDir, "bin", "package.json"),
    resolve(appDir, "package.json"),
  ]);
});

test("uses the current directory manifest when no entry file exists", () => {
  const appDir = resolve(process.cwd(), "app");
  expect(
    findPackagePath({
      entrypoint: undefined,
      cwd: appDir,
      exists: (file) => file === resolve(appDir, "package.json"),
    }),
  ).toBe(resolve(appDir, "package.json"));
});

test("returns the current directory manifest path when no manifest exists", () => {
  const appDir = resolve(process.cwd(), "app");
  expect(findPackagePath({ entrypoint: undefined, cwd: appDir, exists: () => false })).toBe(
    resolve(appDir, "package.json"),
  );
});
