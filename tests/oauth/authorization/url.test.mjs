import { test, expect } from "@jest/globals";
import { createOAuthAuthorizationUrl } from "../../../src/oauth/authorization/url.mjs";

const provider = { authorization_endpoint: "https://auth/authorize" };

test("maps authorization options to URL parameters", () => {
  const result = createOAuthAuthorizationUrl({
    provider,
    credentials: { clientId: "id" },
    redirectUri: "https://app/cb",
    scopes: ["read"],
    authorizationParams: {
      state: "state",
      codeChallenge: "challenge",
      codeChallengeMethod: "S256",
    },
  });
  const url = new URL(result);
  expect(url.searchParams.get("client_id")).toBe("id");
  expect(url.searchParams.get("state")).toBe("state");
  expect(url.searchParams.get("scope")).toBe("read");
  expect(url.searchParams.get("code_challenge")).toBe("challenge");
  expect(url.searchParams.get("code_challenge_method")).toBe("S256");
});

test("uses an empty scope by default", () => {
  const result = createOAuthAuthorizationUrl({
    provider,
    credentials: { client_id: "id" },
    authorizationParams: {
      state: "state",
      codeChallenge: "challenge",
      codeChallengeMethod: "S256",
    },
  });
  const url = new URL(result);
  expect(url.searchParams.get("state")).toBe("state");
  expect(url.searchParams.get("scope")).toBe("");
});

test("rejects authorization URL creation without a client ID", () => {
  expect(() => createOAuthAuthorizationUrl({ provider })).toThrow("OAuth client ID is required");
});
