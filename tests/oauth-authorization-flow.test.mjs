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
  await expect(
    flow.exchangeCode({
      code: "code",
      redirectUri: "https://app/cb",
      codeVerifier: auth.codeVerifier,
    }),
  ).resolves.toEqual({ access_token: "token" });
});

test("creates a default authorization URL", () => {
  const flow = createOAuthAuthorizationFlow({
    provider: { authorization_endpoint: "https://auth/authorize" },
    credentials: { client_id: "id" },
  });
  const auth = flow.authorizationUrl();
  expect(new URL(auth.url).searchParams.get("response_type")).toBe("code");
});
