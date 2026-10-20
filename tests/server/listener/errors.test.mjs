import { jest, test, expect } from "@jest/globals";
import { createListenerErrorHandler } from "../../../src/server/listener/errors.mjs";

test("logs listener errors when an error logger exists", () => {
  const error = new Error("closed");
  const log = { error: jest.fn() };
  createListenerErrorHandler({ log })(error);
  expect(log.error).toHaveBeenCalledWith("[MCP] Listener error:", error);
});

test("ignores listener errors when no error logger exists", () => {
  expect(() => createListenerErrorHandler({ log: {} })(new Error("closed"))).not.toThrow();
});
