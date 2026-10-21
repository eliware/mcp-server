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
  expect(options.redirect).toBe("error");
  expect(options.body.toString()).toContain("client_id=id");
});

test.each([
  [307, "http://auth-redirect.test/token"],
  [307, "https://other-origin.test/token"],
  [308, "http://auth-redirect.test/token"],
  [308, "https://other-origin.test/token"],
])("rejects a %i redirect to %s without forwarding code credentials", async (status, target) => {
  const redirectTarget = jest.fn();
  const fetchFn = jest.fn(async (_url, options) => {
    if (options.redirect === "error") throw new TypeError(`Redirect ${status} rejected`);
    return redirectTarget(target, options);
  });

  await expect(
    exchangeOAuthCode({
      provider,
      credentials: { client_id: "id", client_secret: "client-secret" },
      fetchFn,
      code: "authorization-code",
      redirectUri: "https://app/cb",
      codeVerifier: "pkce-verifier",
    }),
  ).rejects.toThrow(`Redirect ${status} rejected`);
  expect(fetchFn).toHaveBeenCalledTimes(1);
  expect(fetchFn.mock.calls[0][1].redirect).toBe("error");
  expect(redirectTarget).not.toHaveBeenCalled();
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

test("rejects HTTP token endpoints before sending a code or client secret", async () => {
  const fetchFn = jest.fn();
  await expect(
    exchangeOAuthCode({
      provider: { token_endpoint: "http://auth/token" },
      credentials: { client_id: "id", client_secret: "secret" },
      fetchFn,
      code: "authorization-code",
      redirectUri: "https://app/cb",
      codeVerifier: "verifier",
    }),
  ).rejects.toThrow("must use HTTPS");
  expect(fetchFn).not.toHaveBeenCalled();
});

test("rejects a failed code exchange", async () => {
  const fetchFn = jest.fn().mockResolvedValue({ ok: false, status: 400 });
  await expect(exchangeOAuthCode({ provider, credentials, fetchFn, code: "code" })).rejects.toThrow(
    "token request",
  );
});
