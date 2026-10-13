import { test, expect } from "@jest/globals";
import { validStaticToken } from "../src/auth-static-token.mjs";

test("accepts equal tokens and rejects unequal or missing tokens", () => {
  expect(validStaticToken("secret", "secret")).toBe(true);
  for (const value of ["other", "secRet"]) expect(validStaticToken("secret", value)).toBe(false);
  expect(validStaticToken(null, "secret")).toBe(false);
});
