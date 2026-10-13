import { test, expect } from "@jest/globals";
import { createCodeChallenge } from "../src/pkce-challenge.mjs";

test("creates an S256 challenge from a verifier", () => {
  expect(createCodeChallenge("v".repeat(43))).toBe("7w_YNF9DSfIdPf_pRjSq646_kPr-2-o9NAl16JGghdM");
});

test("rejects invalid PKCE verifier values", () => {
  for (const value of ["short", "v".repeat(129), "v".repeat(42) + "!"]) {
    expect(() => createCodeChallenge(value)).toThrow("43 to 128 unreserved characters");
  }
  expect(() => createCodeChallenge(undefined)).toThrow("43 to 128 unreserved characters");
});
