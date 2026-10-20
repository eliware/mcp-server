import { test, expect } from "@jest/globals";
import { attachAuthInfo } from "../../src/server/auth-context.mjs";

test("attaches validated auth data to the SDK and request context", () => {
  const auth = { mode: "oauth2", accessToken: "token", clientId: "client", scopes: ["read"] };
  const request = { raw: {} };
  attachAuthInfo(request, auth);
  expect(request.raw.auth).toEqual({
    token: "token",
    clientId: "client",
    scopes: ["read"],
    extra: { mcpAuth: auth },
  });
  expect(request.mcpAuth).toBe(auth);
  expect(request.mcpBearerToken).toBe("token");
});

test("uses empty client and scope values when auth data omits them", () => {
  const request = { raw: {} };
  attachAuthInfo(request, { accessToken: "token" });
  expect(request.raw.auth).toMatchObject({ clientId: "", scopes: [] });
});
