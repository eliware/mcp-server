import { jest, test, expect } from "@jest/globals";
import { sendOAuthAuthError } from "../src/auth-oauth-response.mjs";

test("sends a bearer challenge for a missing token", () => {
  const res = { set: jest.fn(), status: jest.fn(() => res), json: jest.fn() };
  sendOAuthAuthError(res, { error: "Bearer token required", resource: "https://api.test/mcp" });
  expect(res.set).toHaveBeenCalledWith(
    "WWW-Authenticate",
    expect.stringContaining("https://api.test/mcp/.well-known"),
  );
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ error: "Bearer token required" });
});

test("sends an invalid-token response without a challenge", () => {
  const res = { set: jest.fn(), status: jest.fn(() => res), json: jest.fn() };
  sendOAuthAuthError(res, { error: "Invalid OAuth2 token" });
  expect(res.set).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ error: "Invalid OAuth2 token" });
});
