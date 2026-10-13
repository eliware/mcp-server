import { test, expect } from "@jest/globals";
import { buildResponse } from "../src/response.mjs";
test("wraps MCP response data", () =>
  expect(buildResponse({ n: 1n }).content[0].text).toContain('"n": "1"'));
