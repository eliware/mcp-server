import { jest, test, expect } from "@jest/globals";
import { PassThrough } from "node:stream";
import {
  CLIENT_CAPABILITIES_META_KEY,
  McpServer,
  PROTOCOL_VERSION_META_KEY,
} from "@modelcontextprotocol/server";
import { StdioServerTransport, serveStdio } from "@modelcontextprotocol/server/stdio";
import { createStdioResult } from "../../src/server/stdio.mjs";

test("starts a server factory with the stdio SDK", () => {
  const serverFactory = jest.fn();
  const transport = { close: jest.fn() };
  const startStdio = jest.fn(() => transport);
  const result = createStdioResult(serverFactory, startStdio);
  expect(startStdio).toHaveBeenCalledWith(serverFactory, { legacy: "reject" });
  expect(result).toEqual({
    transport,
  });
});

test("serves a modern stdio discovery request and pins the connection", async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const factory = jest.fn(
    () => new McpServer({ name: "test-server", version: "1.0.0" }, { capabilities: { tools: {} } }),
  );
  const transport = new StdioServerTransport(input, output);
  const handle = serveStdio(factory, { legacy: "reject", transport });
  const reply = readFrame(output);
  input.write(
    `${JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "server/discover",
      params: {
        _meta: {
          [PROTOCOL_VERSION_META_KEY]: "2026-07-28",
          [CLIENT_CAPABILITIES_META_KEY]: {},
        },
      },
    })}\n`,
  );

  await expect(reply).resolves.toMatchObject({ result: { supportedVersions: ["2026-07-28"] } });
  expect(factory).toHaveBeenCalledTimes(1);
  await handle.close();
});

test("rejects a legacy stdio initialize request", async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const factory = jest.fn(
    () => new McpServer({ name: "test-server", version: "1.0.0" }, { capabilities: { tools: {} } }),
  );
  const transport = new StdioServerTransport(input, output);
  const handle = serveStdio(factory, { legacy: "reject", transport });
  const reply = readFrame(output);
  input.write(
    `${JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "old", version: "1" },
      },
    })}\n`,
  );

  await expect(reply).resolves.toMatchObject({ error: { code: -32022 } });
  expect(factory).not.toHaveBeenCalled();
  await handle.close();
});

function readFrame(stream) {
  return new Promise((resolve) => {
    let buffer = "";
    const onData = (chunk) => {
      buffer += chunk.toString();
      const newline = buffer.indexOf("\n");
      if (newline < 0) return;
      stream.off("data", onData);
      resolve(JSON.parse(buffer.slice(0, newline)));
    };
    stream.on("data", onData);
  });
}
