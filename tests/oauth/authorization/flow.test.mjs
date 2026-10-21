import { jest, test, expect } from "@jest/globals";
import { createOAuthAuthorizationFlow } from "../../../src/oauth/authorization/flow.mjs";

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
  await flow.exchangeCode({
    code: "code",
    redirectUri: "https://app/cb",
    codeVerifier: auth.codeVerifier,
  });
  const requestBody = new URLSearchParams(fetchFn.mock.calls[0][1].body);
  expect(requestBody.get("code_verifier")).toBe(auth.codeVerifier);
});

test("uses global fetch when no fetch function is set", async () => {
  const originalFetch = global.fetch;
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ access_token: "token" }),
  });
  global.fetch = fetchMock;
  try {
    const flow = createOAuthAuthorizationFlow({
      provider: { token_endpoint: "https://auth/token" },
      credentials: { client_id: "id" },
    });
    await expect(
      flow.exchangeCode({
        code: "code",
        redirectUri: "https://app/cb",
        codeVerifier: "verifier",
      }),
    ).resolves.toEqual({ access_token: "token" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://auth/token",
      expect.objectContaining({ method: "POST" }),
    );
  } finally {
    global.fetch = originalFetch;
  }
});
