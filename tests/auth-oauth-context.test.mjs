import { test, expect } from "@jest/globals";
import { createOAuthAuthContext } from "../src/auth-oauth-context.mjs";

test("builds OAuth context and selects configured and fallback subjects", () => {
  const config = { mode: "oauth2", subjectClaim: "username", resource: "api" };
  const options = { config, accessToken: "token", scopes: ["read"] };
  expect(
    createOAuthAuthContext({
      ...options,
      info: { username: "custom", iss: "issuer", secret: "x" },
    }),
  ).toMatchObject({
    subject: "custom",
    issuer: "issuer",
    resource: "api",
    scopes: ["read"],
    accessToken: "token",
    claims: { iss: "issuer" },
  });
  expect(
    createOAuthAuthContext({
      ...options,
      info: { sub: "subject", user_id: "fallback" },
      config: { ...config, subjectClaim: "missing" },
    }).subject,
  ).toBe("subject");
  expect(
    createOAuthAuthContext({
      ...options,
      info: { user_id: "fallback" },
      config: { ...config, subjectClaim: "missing" },
    }).subject,
  ).toBe("fallback");
});
