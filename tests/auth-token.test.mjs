import { test, expect } from "@jest/globals";
import { bearer, validStaticToken } from "../src/auth-token.mjs";

test("token helpers match resources and bearer values", () => {
  expect(validStaticToken("secret", "secret")).toBe(true);
  expect(validStaticToken("secret", "other")).toBe(false);
  expect(validStaticToken("secret", "secRet")).toBe(false);
  expect(validStaticToken(null, "secret")).toBe(false);
  expect(bearer({ get: () => "Bearer token" })).toBe("token");
  expect(bearer({ get: () => "Basic token" })).toBeNull();
  expect(bearer({ get: () => "" })).toBeNull();
});
