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

test("warns when a loaded module has no default function", async () => {
  const log = { warn: jest.fn(), error: jest.fn() };
  await registerTools({ ...base, toolCache: new Map(), log, loadModule: async () => ({}) });
  expect(log.warn).toHaveBeenCalledWith("No default export function in hello.mjs");
});

test("logs module load errors and continues registration", async () => {
  const log = { warn: jest.fn(), error: jest.fn() };
  await registerTools({
    ...base,
    toolCache: new Map(),
    log,
    loadModule: async () => {
      throw new Error("bad");
    },
  });
  expect(log.error).toHaveBeenCalledWith(
    expect.stringContaining("Error registering MCP tool"),
    expect.any(String),
  );
});

test("logs non-Error module failures", async () => {
  const log = { warn: jest.fn(), error: jest.fn() };
  await registerTools({
    ...base,
    toolCache: new Map(),
    log,
    loadModule: async () => {
      throw { message: "bad" };
    },
  });
  expect(log.error).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({ message: "bad" }),
  );
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
