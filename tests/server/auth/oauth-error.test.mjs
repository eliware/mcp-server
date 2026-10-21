import { jest, test, expect } from "@jest/globals";

const setOAuthChallenge = jest.fn();
await jest.unstable_mockModule("../../../src/oauth/metadata.mjs", () => ({ setOAuthChallenge }));

const { sendOAuthError } = await import("../../../src/server/auth/oauth-error.mjs");

test("sets a resource challenge and sends an authentication error", () => {
  const reply = {
    header: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const config = { resource: "https://resource.example" };

  expect(sendOAuthError(reply, config, "Invalid OAuth2 token")).toBe(false);
  expect(setOAuthChallenge).toHaveBeenCalledWith(
    { set: expect.any(Function) },
    { resource: config.resource },
  );
  expect(reply.code).toHaveBeenCalledWith(401);
  expect(reply.send).toHaveBeenCalledWith({ error: "Invalid OAuth2 token" });
});

test("forwards challenge headers to the reply", () => {
  const reply = {
    header: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  setOAuthChallenge.mockImplementation(({ set }) => set("www-authenticate", "Bearer"));

  sendOAuthError(reply, {}, "Bearer token required");

  expect(reply.header).toHaveBeenCalledWith("www-authenticate", "Bearer");
});
