import { jest, test, expect } from "@jest/globals";
import { createAuthorizationStartOperation } from "../../../src/oauth/authorization/start-authorization.mjs";

test("requires session state before creating an authorization request", async () => {
  const createAuthorizationUrl = jest.fn();
  const operation = createAuthorizationStartOperation({
    createAuthorizationUrl,
    pkceStore: { save: jest.fn() },
  });
  await expect(operation()).rejects.toThrow("OAuth session state is required");
  expect(createAuthorizationUrl).not.toHaveBeenCalled();
});

test("saves PKCE state and returns the authorization URL and state", async () => {
  const authorization = {
    url: "https://auth/authorize?state=state",
    state: "state",
    codeVerifier: "verifier",
  };
  const createAuthorizationUrl = jest.fn().mockReturnValue(authorization);
  const save = jest.fn();
  const operation = createAuthorizationStartOperation({
    createAuthorizationUrl,
    pkceStore: { save },
  });

  await expect(operation({ sessionState: "session" })).resolves.toEqual({
    url: authorization.url,
    state: authorization.state,
  });
  expect(save).toHaveBeenCalledWith("state", { verifier: "verifier", sessionState: "session" });
});
