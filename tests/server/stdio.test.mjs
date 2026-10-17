import { jest, test, expect } from "@jest/globals";
import { createStdioResult } from "../../src/server/stdio.mjs";

test("connects an MCP server to a stdio transport", async () => {
  const server = { connect: jest.fn() };
  const transport = { close: jest.fn() };
  const createTransport = jest.fn(() => transport);
  const result = await createStdioResult(server, createTransport);
  expect(createTransport).toHaveBeenCalled();
  expect(server.connect).toHaveBeenCalledWith(transport);
  expect(result).toEqual({
    app: undefined,
    httpInstance: undefined,
    mcpServer: server,
    transport,
  });
});
