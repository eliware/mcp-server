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
  const auth = await flow.authorizationUrl({
    redirectUri: "https://app/cb",
    state: "state",
    sessionState: "session-state",
  });
  await flow.exchangeCode({
    code: "code",
    redirectUri: "https://app/cb",
    state: auth.state,
    expectedState: "session-state",
  });
  const requestBody = new URLSearchParams(fetchFn.mock.calls[0][1].body);
  expect(requestBody.get("code_verifier")).toBeTruthy();
});

test("requires a session value before it creates an authorization request", async () => {
  const flow = createOAuthAuthorizationFlow({
    provider: { authorization_endpoint: "https://auth/authorize" },
    credentials: { clientId: "id" },
  });

  await expect(flow.authorizationUrl()).rejects.toThrow("OAuth session state is required");
});

test("rejects a callback with state that does not match the user session", async () => {
  const fetchFn = jest.fn();
  const flow = createOAuthAuthorizationFlow({
    provider: {
      authorization_endpoint: "https://auth/authorize",
      token_endpoint: "https://auth/token",
    },
    credentials: { client_id: "id" },
    fetchFn,
  });
  const auth = await flow.authorizationUrl({
    redirectUri: "https://app/cb",
    sessionState: "session-state",
  });

  await expect(
    flow.exchangeCode({
      code: "code",
      redirectUri: "https://app/cb",
      state: auth.state,
      expectedState: "attacker-state",
    }),
  ).rejects.toThrow("Invalid OAuth state");
  expect(fetchFn).not.toHaveBeenCalled();
});

test("sends only one token request for concurrent exchanges with the same state", async () => {
  const fetchFn = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ access_token: "token" }),
  });
  const flow = createOAuthAuthorizationFlow({
    provider: {
      authorization_endpoint: "https://auth/authorize",
      token_endpoint: "https://auth/token",
    },
    credentials: { client_id: "id" },
    fetchFn,
  });
  const auth = await flow.authorizationUrl({
    redirectUri: "https://app/cb",
    state: "state",
    sessionState: "session-state",
  });
  const exchange = () =>
    flow.exchangeCode({
      code: "code",
      redirectUri: "https://app/cb",
      state: auth.state,
      expectedState: "session-state",
    });

  const results = await Promise.allSettled([exchange(), exchange()]);

  expect(results.filter(({ status }) => status === "fulfilled")).toHaveLength(1);
  expect(results.filter(({ status }) => status === "rejected")).toHaveLength(1);
  expect(fetchFn).toHaveBeenCalledTimes(1);
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
      provider: {
        authorization_endpoint: "https://auth/authorize",
        token_endpoint: "https://auth/token",
      },
      credentials: { client_id: "id" },
    });
    const auth = await flow.authorizationUrl({ sessionState: "session-state" });
    await expect(
      flow.exchangeCode({
        code: "code",
        redirectUri: "https://app/cb",
        state: auth.state,
        expectedState: "session-state",
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
