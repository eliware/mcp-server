import { jest, test, expect } from "@jest/globals";
import { registerOAuthClient } from "../../src/oauth/registration.mjs";

const response = (body, ok = true, status = 200) => ({ ok, status, json: async () => body });

test("registers a client and sends its metadata", async () => {
  const fetchFn = jest.fn().mockResolvedValue(response({ client_id: "x" }));
  const result = await registerOAuthClient({
    registrationEndpoint: "https://auth/register",
    metadata: { client_name: "app" },
    fetchFn,
  });
  expect(result).toEqual({ client_id: "x" });
  expect(fetchFn.mock.calls[0][1]).toMatchObject({
    method: "POST",
    body: JSON.stringify({ client_name: "app" }),
  });
});

test("rejects registration failures and missing endpoints", async () => {
  const bad = jest.fn().mockResolvedValue(response({}, false, 500));
  await expect(
    registerOAuthClient({
      registrationEndpoint: "https://auth/register",
      metadata: {},
      fetchFn: bad,
    }),
  ).rejects.toThrow("registration");
  await expect(registerOAuthClient({ metadata: {}, fetchFn: bad })).rejects.toThrow("endpoint");
  await expect(registerOAuthClient()).rejects.toThrow("endpoint");
});

test("rejects HTTP registration endpoints before sending client data", async () => {
  const fetchFn = jest.fn();
  await expect(
    registerOAuthClient({
      registrationEndpoint: "http://auth/register",
      metadata: { client_name: "app" },
      fetchFn,
    }),
  ).rejects.toThrow("must use HTTPS");
  expect(fetchFn).not.toHaveBeenCalled();
});

test("uses fetch by default", async () => {
  const original = global.fetch;
  global.fetch = jest.fn().mockResolvedValue(response({ client_id: "x" }));
  try {
    await registerOAuthClient({ registrationEndpoint: "https://auth/register", metadata: {} });
  } finally {
    global.fetch = original;
  }
});
