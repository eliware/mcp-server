import { test, expect } from "@jest/globals";
import { normalizeServerConfig } from "../../src/server/config.mjs";

test("normalizes server defaults and caller options", () => {
  const config = normalizeServerConfig({ httpPort: 3000 });
  expect(config.stateless).toBe(true);
  expect(config.endpointPath).toBe("/mcp");
  expect(config.httpPort).toBe(3000);
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
