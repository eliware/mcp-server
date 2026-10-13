import { test, expect } from "@jest/globals";
import { createOAuthAuthorizationUrl } from "../src/oauth-authorization-url.mjs";

const provider = { authorization_endpoint: "https://auth/authorize" };

test("maps authorization options to URL parameters", () => {
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
});

test("uses empty scope and generated authorization values when options are omitted", () => {
  const result = createOAuthAuthorizationUrl({ provider, credentials: { client_id: "id" } });
  const url = new URL(result.url);
  expect(url.searchParams.get("state")).toBeTruthy();
  expect(url.searchParams.get("scope")).toBe("");
});
