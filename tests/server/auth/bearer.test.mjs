import { jest, test, expect } from "@jest/globals";
import { authenticateBearerRequest } from "../../../src/server/auth/bearer.mjs";

function fixture(authorization) {
  return {
    request: { headers: { authorization }, raw: {} },
    reply: { code: jest.fn().mockReturnThis(), send: jest.fn() },
  };
}

test("attaches a valid static bearer token to the request", () => {
  const { request, reply } = fixture("Bearer expected");
  expect(authenticateBearerRequest(request, reply, { mode: "static", token: "expected" })).toBe(
    true,
  );
  expect(request.raw.auth.extra.mcpAuth.accessToken).toBe("expected");
  expect(reply.send).not.toHaveBeenCalled();
});

test("sends an authentication error for an invalid bearer token", () => {
  const { request, reply } = fixture("Bearer wrong");
  expect(authenticateBearerRequest(request, reply, { mode: "static", token: "expected" })).toBe(
    false,
  );
  expect(reply.code).toHaveBeenCalledWith(401);
  expect(reply.send).toHaveBeenCalledWith({ error: "Invalid bearer token" });
});
test("requires a token in passthrough mode", () => {
  const { request, reply } = fixture(undefined);
  expect(authenticateBearerRequest(request, reply, { mode: "bearer-passthrough" })).toBe(false);
  expect(reply.send).toHaveBeenCalledWith({ error: "Bearer token required" });
});
