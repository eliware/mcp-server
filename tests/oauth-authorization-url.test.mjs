import { test, expect } from "@jest/globals";
import { createOAuthAuthorizationUrl } from "../src/oauth-authorization-url.mjs";

const provider = { authorization_endpoint: "https://auth/authorize" };

test("creates a URL with explicit PKCE, state, scope, and client values", () => {
  const result = createOAuthAuthorizationUrl({
    provider,
    credentials: { clientId: "id" },
    redirectUri: "https://app/cb",
    scopes: ["read"],
    state: "state",
    codeVerifier: "verifier",
  });
  const url = new URL(result.url);
  expect(url.searchParams.get("client_id")).toBe("id");
  expect(url.searchParams.get("state")).toBe("state");
  expect(url.searchParams.get("scope")).toBe("read");
  expect(url.searchParams.get("code_challenge")).toBeTruthy();
  expect(url.searchParams.get("code_challenge_method")).toBe("S256");
  expect(result.codeVerifier).toBe("verifier");
});

test("creates verifier and state values when options are omitted", () => {
  const result = createOAuthAuthorizationUrl({ provider, credentials: { client_id: "id" } });
  const url = new URL(result.url);
  expect(result.codeVerifier).toBeTruthy();
  expect(url.searchParams.get("state")).toBeTruthy();
  expect(url.searchParams.get("scope")).toBe("");
});
