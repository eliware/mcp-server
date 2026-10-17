import { jest, test, expect } from "@jest/globals";
import { createStdioResult } from "../../src/server/stdio.mjs";

test("starts a server factory with the stdio SDK", () => {
  const serverFactory = jest.fn();
  const transport = { close: jest.fn() };
  const startStdio = jest.fn(() => transport);
  const result = createStdioResult(serverFactory, startStdio);
  expect(startStdio).toHaveBeenCalledWith(serverFactory);
  expect(result).toEqual({
    transport,
  });
});
