import { jest, test, expect } from "@jest/globals";
import { resolveServerOptions } from "../src/server-options.mjs";

test("server options resolve an entrypoint and listener values", () => {
  const result = resolveServerOptions({
    entrypoint: new URL("../examples/basic.mjs", import.meta.url),
    stdio: true,
  });
  expect(result.toolsDir).toContain("examples");
  expect(result.config.httpPort).toBeUndefined();
  expect(result.activeLog).toBeTruthy();
});

test("server options accept a custom tool folder and logger", () => {
  const log = { debug: jest.fn() };
  const result = resolveServerOptions({ toolsDir: "custom", log });
  expect(result.toolsDir).toBe("custom");
  expect(result.activeLog).toBe(log);
});

test("server options apply defaults", () => {
  const result = resolveServerOptions();
  expect(result.config.stateless).toBe(true);
  expect(result.config.endpointPath).toBe("/mcp");
});

test("uses a running mjs file as the default entrypoint", () => {
  const original = process.argv[1];
  process.argv[1] = "server.mjs";
  try {
    expect(resolveServerOptions().config.entrypoint).toBe("server.mjs");
  } finally {
    process.argv[1] = original;
  }
});
