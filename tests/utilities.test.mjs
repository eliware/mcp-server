import { test, expect } from "@jest/globals";
import * as utilities from "../src/utilities.mjs";
import * as packageUtilities from "@eliware/mcp-server/utilities";

test("utility entry point exports general helpers without OAuth functions", () => {
  expect(utilities.stderrLogger).toBeTruthy();
  expect(utilities.mountOAuthResourceMetadata).toBeUndefined();
  expect(utilities.discoverOAuthProvider).toBeUndefined();
  expect(utilities.createPkceStore).toBeUndefined();
  expect(packageUtilities.buildResponse).toBe(utilities.buildResponse);
});
