import { jest, test, expect } from "@jest/globals";
import { path, pathUrl } from "@eliware/path";
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
      context: {},
    });
    expect(registerTool).toHaveBeenCalled();
  });
}

test("echo tool returns caller input without logging it or its response", async () => {
  const registerTool = jest.fn();
  const log = { debug: jest.fn() };
  await echo({ mcpServer: { registerTool }, toolName: "echo", log, context: {} });
  const handler = registerTool.mock.calls[0][2];
  const privateValue = "credential-like-value";
  const result = await handler({ echoText: privateValue }, {});
  expect(JSON.parse(result.content[0].text)).toEqual({
    message: "echo-reply",
    data: { text: privateValue },
  });
  expect(log.debug.mock.calls).toEqual([["echo request"], ["echo response"]]);
  expect(JSON.stringify(log.debug.mock.calls)).not.toContain(privateValue);
  expect(JSON.stringify(log.debug.mock.calls)).not.toContain(result.content[0].text);
});
