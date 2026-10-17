import { test, expect } from "@jest/globals";
import { createOAuthAuthorizationParams } from "../../../src/oauth/authorization/params.mjs";

test("generates default state, verifier, and challenge values", () => {
  const params = createOAuthAuthorizationParams();
  expect(params.state).toBeTruthy();
  expect(params.codeVerifier).toBeTruthy();
  expect(params.codeChallenge).toBeTruthy();
  expect(params.codeChallengeMethod).toBe("S256");
});

test("uses supplied state and derives a challenge from the supplied verifier", () => {
  const params = createOAuthAuthorizationParams({ state: "state", codeVerifier: "v".repeat(43) });
  expect(params.state).toBe("state");
  expect(params.codeVerifier).toBe("v".repeat(43));
  expect(params.codeChallenge).toBe("7w_YNF9DSfIdPf_pRjSq646_kPr-2-o9NAl16JGghdM");
});

test("rejects an empty state and an empty verifier", () => {
  expect(() => createOAuthAuthorizationParams({ state: "" })).toThrow(
    "OAuth state must be a non-empty string",
  );
  expect(() => createOAuthAuthorizationParams({ codeVerifier: "" })).toThrow(
    "43 to 128 unreserved characters",
  );
});
