import { jest, test, expect } from "@jest/globals";

const exchangeOAuthCode = jest.fn();
await jest.unstable_mockModule("../../../src/oauth/code-exchange.mjs", () => ({
  exchangeOAuthCode,
}));

const { createCodeExchangeOperation } =
  await import("../../../src/oauth/authorization/exchange-code.mjs");

test("passes flow dependencies and exchange values to the code exchange helper", async () => {
  const provider = { token_endpoint: "https://auth.example/token" };
  const credentials = { client_id: "client" };
  const fetchFn = jest.fn();
  const options = { code: "code", redirectUri: "https://app.example/callback" };
  exchangeOAuthCode.mockResolvedValue({ access_token: "token" });
  const exchangeCode = createCodeExchangeOperation({ provider, credentials, fetchFn });

  await expect(exchangeCode(options)).resolves.toEqual({ access_token: "token" });
  expect(exchangeOAuthCode).toHaveBeenCalledWith({ provider, credentials, fetchFn, ...options });
});

test("uses the global fetch function by default", async () => {
  const provider = { token_endpoint: "https://auth.example/token" };
  const credentials = { client_id: "client" };
  const defaultFetch = global.fetch;
  const exchangeCode = createCodeExchangeOperation({ provider, credentials });

  await exchangeCode({ code: "code" });

  expect(exchangeOAuthCode).toHaveBeenCalledWith({
    provider,
    credentials,
    fetchFn: defaultFetch,
    code: "code",
  });
});
