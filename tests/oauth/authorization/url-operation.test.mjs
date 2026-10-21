import { test, expect } from "@jest/globals";
import { createAuthorizationUrlOperation } from "../../../src/oauth/authorization/url-operation.mjs";

test("creates an authorization URL and returns its PKCE verifier", () => {
  const codeVerifier = "v".repeat(43);
  const authorizationUrl = createAuthorizationUrlOperation({
    provider: { authorization_endpoint: "https://auth.example/authorize" },
    credentials: { client_id: "client" },
  });

  const result = authorizationUrl({
    redirectUri: "https://app.example/callback",
    scopes: ["read", "write"],
    state: "state-value",
    codeVerifier,
  });
  const url = new URL(result.url);

  expect(url.searchParams.get("client_id")).toBe("client");
  expect(url.searchParams.get("redirect_uri")).toBe("https://app.example/callback");
  expect(url.searchParams.get("scope")).toBe("read write");
  expect(url.searchParams.get("state")).toBe("state-value");
  expect(result.state).toBe("state-value");
  expect(result.codeVerifier).toBe(codeVerifier);
});

test("creates a default authorization URL when no options are supplied", () => {
  const authorizationUrl = createAuthorizationUrlOperation({
    provider: { authorization_endpoint: "https://auth.example/authorize" },
    credentials: { client_id: "client" },
  });

  const result = authorizationUrl();

  expect(new URL(result.url).searchParams.get("response_type")).toBe("code");
  expect(result.codeVerifier).toBeTruthy();
});
