import { test, expect } from "@jest/globals";
import { normalizeServerConfig } from "../../src/server/config.mjs";

test("normalizes server defaults and caller options", () => {
  const config = normalizeServerConfig({ port: 3000 });
  expect(config.host).toBe("127.0.0.1");
  expect(config.endpointPath).toBe("/mcp");
  expect(config.port).toBe(3000);
});

test("uses a JavaScript process entrypoint as the default", () => {
  const original = process.argv[1];
  process.argv[1] = "server.js";
  try {
    expect(normalizeServerConfig().entrypoint).toBe("server.js");
  } finally {
    process.argv[1] = original;
  }
});

test("keeps the default entrypoint undefined when the process has no script", () => {
  const original = process.argv[1];
  process.argv[1] = undefined;
  try {
    expect(normalizeServerConfig().entrypoint).toBeUndefined();
  } finally {
    process.argv[1] = original;
  }
});
