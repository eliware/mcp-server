import { jest, test, expect } from "@jest/globals";
import fs from "fs";
import { path, pathUrl } from "@eliware/common";
import { buildServer } from "../src/tools.mjs";
import echo from "../examples/tools/echo.mjs";
const toolsDir = path(import.meta, "..", "examples", "tools");
for (const file of fs.readdirSync(toolsDir).filter((f) => f.endsWith(".mjs"))) {
  test(`${file} exports and registers`, async () => {
    const mod = await import(pathUrl(toolsDir, file));
    expect(typeof mod.default).toBe("function");
    const tool = jest.fn();
    await mod.default({
      mcpServer: { tool },
      toolName: "test-tool",
      log: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
    });
    expect(tool).toHaveBeenCalled();
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
test("warns for a module without default function", async () => {
  const warn = jest.fn();
  await buildServer({
    toolsDir: "/tmp",
    log: { warn, error: jest.fn() },
    name: "x",
    version: "1",
    context: {},
    readDir: () => ["plain.mjs"],
    loadModule: async () => ({}),
  });
  expect(warn).toHaveBeenCalledWith("No default export function in plain.mjs");
});
test("logs module loading errors", async () => {
  const error = jest.fn();
  await buildServer({
    toolsDir: "/tmp",
    log: { warn: jest.fn(), error },
    name: "x",
    version: "1",
    context: {},
    readDir: () => ["bad.mjs"],
    loadModule: async () => {
      throw new Error("bad");
    },
  });
  expect(error).toHaveBeenCalled();
});
test("passes context and tool name to tool", async () => {
  const handler = jest.fn();
  await buildServer({
    toolsDir: "/tmp",
    log,
    name: "x",
    version: "1",
    context: { db: "db" },
    readDir: () => ["hello.mjs"],
    loadModule: async () => ({ default: handler }),
  });
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ toolName: "hello", db: "db" }));
});
test("logs non-Error module failures", async () => {
  const error = jest.fn();
  await buildServer({
    toolsDir: "/tmp",
    log: { warn: jest.fn(), error },
    name: "x",
    version: "1",
    context: {},
    readDir: () => ["bad.mjs"],
    loadModule: async () => {
      throw { message: "bad" };
    },
  });
  expect(error).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({ message: "bad" }),
  );
});

test("echo tool returns its input", async () => {
  const tool = jest.fn();
  const log = { debug: jest.fn() };
  await echo({ mcpServer: { tool }, toolName: "echo", log });
  const handler = tool.mock.calls[0][3];
  const result = await handler({ echoText: "hello" }, {});
  expect(JSON.parse(result.content[0].text)).toEqual({
    message: "echo-reply",
    data: { text: "hello" },
  });
  expect(log.debug).toHaveBeenCalledTimes(2);
});
