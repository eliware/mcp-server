import { test, expect } from "@jest/globals";
import { bearer } from "../../src/auth/bearer.mjs";

test("parses bearer headers and rejects other or empty values", () => {
  expect(bearer({ get: () => "Bearer token" })).toBe("token");
  expect(bearer({ get: () => "Basic token" })).toBeNull();
  expect(bearer({ get: () => "" })).toBeNull();
});
