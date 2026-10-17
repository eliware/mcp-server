import { jest, test, expect } from "@jest/globals";
import { exchangeOAuthCode } from "../../src/oauth/code-exchange.mjs";

const provider = { token_endpoint: "https://auth/token" };
const credentials = { client_id: "id" };

test("exchanges a code and sends the required request fields", async () => {
  const fetchFn = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ access_token: "token" }),
  });
  await expect(
    exchangeOAuthCode({
      provider,
      credentials,
      fetchFn,
      code: "code",
      redirectUri: "https://app/cb",
      codeVerifier: "verifier",
    }),
  ).resolves.toEqual({ access_token: "token" });
  const [url, options] = fetchFn.mock.calls[0];
  expect(url).toBe(provider.token_endpoint);
  expect(options.method).toBe("POST");
  expect(options.body.toString()).toContain("client_id=id");
});

test("authenticates a confidential client with HTTP Basic", async () => {
  const fetchFn = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ access_token: "token" }),
  });
  await exchangeOAuthCode({
    provider,
    credentials: { client_id: "id", client_secret: "secret" },
    fetchFn,
    code: "code",
    redirectUri: "https://app/cb",
    codeVerifier: "verifier",
  });
  const [, options] = fetchFn.mock.calls[0];
  expect(options.headers.authorization).toBe(
    `Basic ${Buffer.from("id:secret").toString("base64")}`,
  );
  expect(options.body.has("client_id")).toBe(false);
});

test("rejects code exchange without a client ID", async () => {
  await expect(exchangeOAuthCode({ provider, code: "code" })).rejects.toThrow(
    "OAuth client ID is required",
  );
});

test("rejects a failed code exchange", async () => {
  const fetchFn = jest.fn().mockResolvedValue({ ok: false, status: 400 });
  await expect(exchangeOAuthCode({ provider, credentials, fetchFn, code: "code" })).rejects.toThrow(
    "token request",
  );
});

test("uses global fetch when no fetch function is set", async () => {
  const original = global.fetch;
  global.fetch = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ access_token: "token" }) });
  try {
    await expect(exchangeOAuthCode({ provider, credentials, code: "code" })).resolves.toEqual({
      access_token: "token",
    });
  } finally {
    global.fetch = original;
  }
});
