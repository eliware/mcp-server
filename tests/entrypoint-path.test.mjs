import { test, expect } from "@jest/globals";
import { normalizeEntrypoint } from "../src/entrypoint-path.mjs";

test("normalizes URL and Windows entrypoint paths", () => {
  expect(normalizeEntrypoint(new URL("../examples/basic.mjs", import.meta.url))).toContain(
    "examples",
  );
  expect(normalizeEntrypoint("C:\\C:\\app\\server.mjs")).toBe("C:\\app\\server.mjs");
  expect(normalizeEntrypoint("/C:/app/server.mjs")).toBe("C:/app/server.mjs");
});

test("keeps an undefined entrypoint undefined", () => {
  expect(normalizeEntrypoint()).toBeUndefined();
});
