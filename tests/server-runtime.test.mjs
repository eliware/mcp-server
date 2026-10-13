import { test, expect } from "@jest/globals";
import { stderrLogger } from "../src/server-http.mjs";
import { resolveServerRuntime } from "../src/server-runtime.mjs";

test("resolves the tool folder from an entrypoint or caller option", () => {
  const config = { entrypoint: "/app/server.mjs", log: { debug() {} }, stdio: false };
  expect(resolveServerRuntime({ config }).toolsDir).toContain("app");
  expect(resolveServerRuntime({ config }).toolsDir).toContain("tools");
  expect(resolveServerRuntime({ config, options: { toolsDir: "custom" } }).toolsDir).toBe("custom");
});

test("uses the stderr logger for stdio unless the caller sets a logger", () => {
  const config = { entrypoint: undefined, log: { debug() {} }, stdio: true };
  expect(resolveServerRuntime({ config }).activeLog).toBe(stderrLogger);
  expect(resolveServerRuntime({ config, options: { log: config.log } }).activeLog).toBe(config.log);
});
