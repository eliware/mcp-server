import { jest, test, expect } from "@jest/globals";
import { createOAuthAuthorizationFlow } from "../src/oauth-authorization-flow.mjs";

const provider = {
  authorization_endpoint: "https://auth/authorize",
  token_endpoint: "https://auth/token",
};

test("creates authorization URLs with explicit and default options", () => {
  const flow = createOAuthAuthorizationFlow({ provider, credentials: { clientId: "id" } });
  const request = flow.authorizationUrl({
    redirectUri: "https://app/cb",
    scopes: ["read"],
    state: "s",
    codeVerifier: "verifier",
  });
  const explicit = new URL(request.url);
  expect(explicit.searchParams.get("client_id")).toBe("id");
  expect(explicit.searchParams.get("state")).toBe("s");
  expect(explicit.searchParams.get("scope")).toBe("read");
  expect(explicit.searchParams.get("code_challenge")).toBeTruthy();
  expect(request.codeVerifier).toBe("verifier");

  const defaults = flow.authorizationUrl();
  expect(defaults.codeVerifier).toBeTruthy();
  expect(new URL(defaults.url).searchParams.get("state")).toBeTruthy();
  expect(new URL(defaults.url).searchParams.get("scope")).toBe("");
});

test("exchanges an authorization code and sends request fields", async () => {
  const fetchFn = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ access_token: "x" }) });
  const flow = createOAuthAuthorizationFlow({
    provider,
    credentials: { client_id: "id" },
    fetchFn,
  });
  await expect(
    flow.exchangeCode({ code: "c", redirectUri: "https://app/cb", codeVerifier: "v" }),
  ).resolves.toEqual({ access_token: "x" });
  expect(fetchFn.mock.calls[0][1].body.toString()).toContain("client_id=id");
});

test("rejects a failed token exchange", async () => {
  const fetchFn = jest.fn().mockResolvedValue({ ok: false, status: 400 });
  const flow = createOAuthAuthorizationFlow({ provider, credentials: { clientId: "id" }, fetchFn });
  await expect(
    flow.exchangeCode({ code: "c", redirectUri: "x", codeVerifier: "v" }),
  ).rejects.toThrow("token exchange");
});
