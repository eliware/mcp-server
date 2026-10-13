import { jest, test, expect } from "@jest/globals";
import { setOAuthChallenge } from "../src/oauth-metadata.mjs";

test("sets resource and scope in the OAuth challenge", () => {
  const res = { set: jest.fn() };
  setOAuthChallenge(res, { resource: "https://app/mcp", scope: "read" });
  expect(res.set).toHaveBeenCalledWith(
    "WWW-Authenticate",
    expect.stringContaining(
      'resource_metadata="https://app/mcp/.well-known/oauth-protected-resource/mcp"',
    ),
  );
  expect(res.set.mock.calls[0][1]).toContain('scope="read"');
});

test("sets the default OAuth challenge", () => {
  const res = { set: jest.fn() };
  setOAuthChallenge(res);
  expect(res.set).toHaveBeenCalledWith("WWW-Authenticate", 'Bearer realm="mcp"');
});

test("escapes quotes and backslashes in challenge values", () => {
  const res = { set: jest.fn() };
  setOAuthChallenge(res, { resource: 'https://app/"quoted"\\path\r\nbad', scope: 'read"write' });
  const header = res.set.mock.calls[0][1];
  expect(header).toContain(
    'resource_metadata="https://app/\\"quoted\\"\\\\path%0D%0Abad/.well-known/oauth-protected-resource/mcp"',
  );
  expect(header).toContain('scope="read\\"write"');
  expect(header).not.toMatch(/[\r\n]/);
});
