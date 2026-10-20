import { test, expect } from "@jest/globals";
import * as oauthApi from "../../src/oauth/public-api.mjs";
import * as packageOAuthApi from "@eliware/mcp-server/oauth";

test("OAuth subpath exports OAuth and PKCE helpers", () => {
  expect(oauthApi.createOAuthClient).toBeInstanceOf(Function);
  expect(oauthApi.createOAuthIntrospector).toBeInstanceOf(Function);
  expect(oauthApi.createPkceState).toBeInstanceOf(Function);
  expect(packageOAuthApi.createOAuthClient).toBe(oauthApi.createOAuthClient);
  expect(packageOAuthApi.createPkceStore).toBe(oauthApi.createPkceStore);
});
