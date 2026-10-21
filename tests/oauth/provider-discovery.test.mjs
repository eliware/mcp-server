import { jest, test, expect } from "@jest/globals";
import { discoverOAuthProvider } from "../../src/oauth/provider-discovery.mjs";

const response = (body, ok = true, status = 200) => ({ ok, status, json: async () => body });

test("discovers provider metadata", async () => {
  const fetchFn = jest.fn().mockResolvedValue(response({ authorization_endpoint: "a" }));
  expect(await discoverOAuthProvider({ issuer: "https://auth/", fetchFn })).toEqual({
    authorization_endpoint: "a",
  });
  expect(fetchFn).toHaveBeenCalledWith("https://auth/.well-known/openid-configuration", {
    redirect: "error",
  });
});

test("rejects discovery failures and missing issuer", async () => {
  const bad = jest.fn().mockResolvedValue(response({}, false, 500));
  await expect(discoverOAuthProvider({ issuer: "https://auth", fetchFn: bad })).rejects.toThrow(
    "discovery",
  );
  await expect(discoverOAuthProvider({ fetchFn: bad })).rejects.toThrow("issuer");
  await expect(discoverOAuthProvider()).rejects.toThrow("issuer");
});

test("uses fetch by default", async () => {
  const original = global.fetch;
  global.fetch = jest.fn().mockResolvedValue(response({ ok: true }));
  try {
    await discoverOAuthProvider({ issuer: "https://auth" });
  } finally {
    global.fetch = original;
  }
});
