import { test, expect } from "@jest/globals";
import "../test-fixtures/auth-suite.mjs";
import { normalizeAuth } from "../src/auth.mjs";

test("auth module exports configuration", () => {
  expect(normalizeAuth().mode).toBe("none");
});
