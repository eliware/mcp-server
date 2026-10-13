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

test("preserves explicitly supplied empty state and verifier values", () => {
  const params = createOAuthAuthorizationParams({ state: "", codeVerifier: "" });
  expect(params.state).toBe("");
  expect(params.codeVerifier).toBe("");
  expect(params.codeChallenge).toBe("47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU");
});
