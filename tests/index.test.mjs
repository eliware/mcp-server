import { test, expect } from "@jest/globals";
import "../test-fixtures/index-suite.mjs";
import { mcpServer } from "../src/index.mjs";

test("public entry point exports the server", () => {
  expect(typeof mcpServer).toBe("function");
});
