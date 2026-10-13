import { test, expect } from "@jest/globals";
import { normalizeServerConfig } from "../src/server-config.mjs";

test("normalizes config defaults and entrypoints", () => {
  const config = normalizeServerConfig({
    entrypoint: new URL("../examples/basic.mjs", import.meta.url),
  });
  expect(config.entrypoint).toContain("examples");
  expect(config.stateless).toBe(true);
  expect(config.endpointPath).toBe("/mcp");
  expect(normalizeServerConfig({ entrypoint: "/C:/app/server.mjs" }).entrypoint).toBe(
    "C:/app/server.mjs",
  );
});

test("uses an mjs process entrypoint as the default", () => {
  const original = process.argv[1];
  process.argv[1] = "server.mjs";
  try {
    expect(normalizeServerConfig().entrypoint).toBe("server.mjs");
  } finally {
    process.argv[1] = original;
  }
});
