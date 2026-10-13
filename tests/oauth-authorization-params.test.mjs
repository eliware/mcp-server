import { test, expect } from "@jest/globals";
import { createOAuthAuthorizationParams } from "../src/oauth-authorization-params.mjs";

test("generates default state, verifier, and challenge values", () => {
  const params = createOAuthAuthorizationParams();
  expect(params.state).toBeTruthy();
  expect(params.codeVerifier).toBeTruthy();
  expect(params.codeChallenge).toBeTruthy();
  expect(params.codeChallengeMethod).toBe("S256");
});

test("uses supplied state and derives a challenge from the supplied verifier", () => {
  const params = createOAuthAuthorizationParams({ state: "state", codeVerifier: "verifier" });
  expect(params.state).toBe("state");
  expect(params.codeVerifier).toBe("verifier");
  expect(params.codeChallenge).toBe("iMnq5o6zALKXGivsnlom_0F5_WYda32GHkxlV7mq7hQ");
});
