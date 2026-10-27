import { jest, test, expect } from "@jest/globals";
import { createCallbackExchangeOperation } from "../../../src/oauth/authorization/callback-exchange.mjs";

test("consumes PKCE state and passes its verifier to code exchange", async () => {
  const exchangeAuthorizationCode = jest.fn().mockResolvedValue({ access_token: "token" });
  const pkceStore = {
    consume: jest.fn().mockResolvedValue({ verifier: "verifier", sessionState: "session" }),
  };
  const operation = createCallbackExchangeOperation({ exchangeAuthorizationCode, pkceStore });

  await expect(
    operation({
      code: "code",
      redirectUri: "https://app/callback",
      state: "state",
      expectedState: "session",
    }),
  ).resolves.toEqual({ access_token: "token" });
  expect(pkceStore.consume).toHaveBeenCalledWith("state", "session");
  expect(exchangeAuthorizationCode).toHaveBeenCalledWith({
    code: "code",
    redirectUri: "https://app/callback",
    codeVerifier: "verifier",
  });
});

test("does not exchange a code when the PKCE state is invalid", async () => {
  const exchangeAuthorizationCode = jest.fn();
  const operation = createCallbackExchangeOperation({
    exchangeAuthorizationCode,
    pkceStore: { consume: jest.fn().mockResolvedValue(null) },
  });

  await expect(
    operation({
      code: "code",
      redirectUri: "https://app/callback",
      state: "state",
      expectedState: "wrong",
    }),
  ).rejects.toThrow("Invalid OAuth state");
  expect(exchangeAuthorizationCode).not.toHaveBeenCalled();
});
