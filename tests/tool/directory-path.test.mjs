import { test, expect } from "@jest/globals";
import { normalizeToolsDir } from "../../src/tool/directory-path.mjs";

test("normalizes Windows tool folders", () => {
  expect(normalizeToolsDir("C:\\C:\\tools")).toBe("C:\\tools");
  expect(normalizeToolsDir("/C:/tools")).toBe("C:/tools");
});
