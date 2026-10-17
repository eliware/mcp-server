import { test, expect } from "@jest/globals";
import * as utilities from "../src/utilities.mjs";
import * as packageUtilities from "@eliware/mcp-server/utilities";

test("utilities entry point exports logging, OAuth, and PKCE helpers", () => {
  expect(utilities.stderrLogger).toBeTruthy();
  expect(utilities.mountOAuthResourceMetadata).toBeInstanceOf(Function);
  expect(utilities.discoverOAuthProvider).toBeInstanceOf(Function);
  expect(utilities.createPkceStore).toBeInstanceOf(Function);
  expect(packageUtilities.mountOAuthResourceMetadata).toBe(utilities.mountOAuthResourceMetadata);
});
