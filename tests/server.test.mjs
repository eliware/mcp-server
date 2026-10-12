import { jest, test, expect } from "@jest/globals";
import { mcpServer } from "../src/server.mjs";

test("server module starts an app with a selected tool folder", async () => {
  const result = await mcpServer({
    httpPort: null,
    toolsDir: new URL("../examples/tools/", import.meta.url).pathname,
    log: { debug: jest.fn(), warn: jest.fn(), error: jest.fn() },
  });
  expect(result.app).toBeTruthy();
  expect(result.mcpServer).toBeTruthy();
});
