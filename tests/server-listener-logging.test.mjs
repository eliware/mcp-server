import { jest, test, expect } from "@jest/globals";
import {
  createListenerErrorHandler,
  createListeningHandler,
  listeningCallback,
} from "../src/server-listener-logging.mjs";

test("logs listener startup callbacks", () => {
  const log = { debug: jest.fn() };
  createListeningHandler({ log, port: 1234 })();
  listeningCallback({ log }, 8443);
  expect(log.debug).toHaveBeenNthCalledWith(1, "MCP HTTP Server listening on 1234");
  expect(log.debug).toHaveBeenNthCalledWith(2, "MCP HTTP Server listening on 8443");
});

test("ignores startup logs when no debug logger exists", () => {
  expect(() => listeningCallback({ log: {} }, 8443)).not.toThrow();
});

test("logs listener errors when an error logger exists", () => {
  const error = new Error("closed");
  const log = { error: jest.fn() };
  createListenerErrorHandler({ log })(error);
  expect(log.error).toHaveBeenCalledWith("[MCP] Listener error:", error);
});

test("ignores listener errors when no error logger exists", () => {
  expect(() => createListenerErrorHandler({ log: {} })(new Error("closed"))).not.toThrow();
});
