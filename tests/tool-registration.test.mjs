import { jest, test, expect } from "@jest/globals";
import { pathUrl } from "@eliware/common";
import { registerTools } from "../src/tool-registration.mjs";

const base = {
  server: {},
  toolsDir: "/tmp",
  tools: [{ file: "hello.mjs", toolName: "hello" }],
  toolCache: new Map(),
  log: { warn: jest.fn(), error: jest.fn() },
  context: { db: "db" },
};

test("loads and calls a tool with its name and context", async () => {
  const handler = jest.fn();
  await registerTools({ ...base, loadModule: async () => ({ default: handler }) });
  expect(handler).toHaveBeenCalledWith(
    expect.objectContaining({ mcpServer: base.server, toolName: "hello", db: "db" }),
  );
});

test("rejects a loaded module with no default function", async () => {
  await expect(
    registerTools({ ...base, toolCache: new Map(), loadModule: async () => ({}) }),
  ).rejects.toThrow("No default export function in hello.mjs");
});

test("rejects module load errors", async () => {
  await expect(
    registerTools({
      ...base,
      toolCache: new Map(),
      loadModule: async () => {
        throw new Error("bad");
      },
    }),
  ).rejects.toThrow("Error registering MCP tool in hello.mjs: bad");
});

test("rejects non-Error module failures", async () => {
  await expect(
    registerTools({
      ...base,
      toolCache: new Map(),
      loadModule: async () => {
        throw { message: "bad" };
      },
    }),
  ).rejects.toThrow("Error registering MCP tool in hello.mjs: bad");
});

test("rejects errors without a message", async () => {
  await expect(
    registerTools({
      ...base,
      toolCache: new Map(),
      loadModule: async () => {
        throw new Error();
      },
    }),
  ).rejects.toThrow("Error registering MCP tool in hello.mjs: Error");
});

test("reuses a loaded tool module from the cache", async () => {
  const handler = jest.fn();
  const toolCache = new Map([[pathUrl(base.toolsDir, "hello.mjs"), { default: handler }]]);
  await registerTools({
    ...base,
    toolCache,
    loadModule: async () => {
      throw new Error("cache miss");
    },
  });
  expect(handler).toHaveBeenCalled();
});
