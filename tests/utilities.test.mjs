import { test, expect } from "@jest/globals";
import * as utilities from "../src/utilities.mjs";
import * as packageUtilities from "@eliware/mcp-server/utilities";

test("utilities entry point exports HTTP, OAuth, and PKCE helpers", () => {
  expect(utilities.createRedirectApp).toBeInstanceOf(Function);
  expect(utilities.createPostHandler).toBeInstanceOf(Function);
  expect(utilities.discoverOAuthProvider).toBeInstanceOf(Function);
  expect(utilities.createPkceStore).toBeInstanceOf(Function);
  expect(packageUtilities.createRedirectApp).toBe(utilities.createRedirectApp);
});
