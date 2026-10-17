import { jest, test, expect } from "@jest/globals";
import { path, pathUrl } from "@eliware/common";
import { buildServer } from "../src/tools.mjs";
import echo from "../examples/tools/echo.mjs";
const toolsDir = path(import.meta, "..", "examples", "tools");
for (const file of ["echo.mjs"]) {
  test(`${file} exports and registers`, async () => {
    const mod = await import(pathUrl(toolsDir, file));
    expect(typeof mod.default).toBe("function");
    const registerTool = jest.fn();
    await mod.default({
      mcpServer: { registerTool },
      toolName: "test-tool",
      log: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
    });
    expect(registerTool).toHaveBeenCalled();
  });
}

const log = { debug: jest.fn(), warn: jest.fn(), error: jest.fn() };
test("builds server and loads mjs tools", async () => {
  const server = await buildServer({
    toolsDir: new URL("../examples/tools/", import.meta.url).pathname,
    log,
    name: "test",
    version: "1",
    context: {},
  });
  expect(server.options.name).toBe("test");
});
test("echo tool returns its input", async () => {
  const registerTool = jest.fn();
  const log = { debug: jest.fn() };
  await echo({ mcpServer: { registerTool }, toolName: "echo", log });
  const handler = registerTool.mock.calls[0][2];
  const result = await handler({ echoText: "hello" }, {});
  expect(JSON.parse(result.content[0].text)).toEqual({
    message: "echo-reply",
    data: { text: "hello" },
  });
  expect(log.debug).toHaveBeenCalledTimes(2);
});
