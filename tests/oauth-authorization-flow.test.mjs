import { jest, test, expect } from "@jest/globals";
import { createOAuthAuthorizationFlow } from "../src/oauth-authorization-flow.mjs";

test("connects authorization URL creation to code exchange", async () => {
  const provider = {
    authorization_endpoint: "https://auth/authorize",
    token_endpoint: "https://auth/token",
  };
  const fetchFn = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ access_token: "token" }),
  });
  const flow = createOAuthAuthorizationFlow({
    provider,
    credentials: { clientId: "id" },
    fetchFn,
  });
  const auth = flow.authorizationUrl({ redirectUri: "https://app/cb", state: "state" });
  expect(flow.authorizationUrl().codeVerifier).toBeTruthy();
  await expect(
    flow.exchangeCode({
      code: "code",
      redirectUri: "https://app/cb",
      codeVerifier: auth.codeVerifier,
    }),
  ).resolves.toEqual({ access_token: "token" });
});

test("uses default flow options", () => {
  const flow = createOAuthAuthorizationFlow({
    provider: { authorization_endpoint: "https://auth/authorize" },
    credentials: { client_id: "id" },
  });
  expect(flow.authorizationUrl().codeVerifier).toBeTruthy();
});
