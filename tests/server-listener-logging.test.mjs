import { jest, test, expect } from "@jest/globals";
import { createListeningHandler, listeningCallback } from "../src/server-listener-logging.mjs";

test("logs listener startup callbacks", () => {
  const log = { debug: jest.fn() };
  createListeningHandler({ log, port: 1234 })();
  listeningCallback({ log }, 8443);
  expect(log.debug).toHaveBeenNthCalledWith(1, "MCP HTTP Server listening on 1234");
  expect(log.debug).toHaveBeenNthCalledWith(2, "MCP HTTP Server listening on 8443");
});
