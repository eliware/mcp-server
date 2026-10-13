import { test, expect } from "@jest/globals";
import { createOAuthIntrospectionRequest } from "../src/auth-introspection-request.mjs";

test("creates a form request with client authentication", () => {
  const request = createOAuthIntrospectionRequest({
    resource: "https://api",
    clientId: "client",
    clientSecret: "secret",
    token: "access-token",
  });
  expect(request.method).toBe("POST");
  expect(request.headers.authorization).toBe(
    `Basic ${Buffer.from("client:secret").toString("base64")}`,
  );
  expect(request.body.get("token")).toBe("access-token");
  expect(request.body.get("resource")).toBe("https://api");
});

test("omits client authentication when credentials are incomplete", () => {
  const request = createOAuthIntrospectionRequest({ token: "access-token" });
  expect(request.headers.authorization).toBeUndefined();
  expect(request.body.get("resource")).toBeNull();
});
