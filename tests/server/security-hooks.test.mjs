import { jest, test, expect } from "@jest/globals";

const mocks = {
  hostHeaderValidation: jest.fn((hosts) => ({ hosts })),
  originValidation: jest.fn((origins) => ({ origins })),
  authenticate: jest.fn(async () => true),
};

await jest.unstable_mockModule("@modelcontextprotocol/fastify", () => ({
  hostHeaderValidation: mocks.hostHeaderValidation,
  originValidation: mocks.originValidation,
}));
await jest.unstable_mockModule("../../src/server/authenticate.mjs", () => ({
  authenticateRequest: mocks.authenticate,
}));

const { registerSecurityHooks } = await import("../../src/server/security-hooks.mjs");

function createApp() {
  return { addHook: jest.fn() };
}

test("registers host, source, and MCP authentication hooks", async () => {
  mocks.authenticate.mockClear();
  const app = createApp();
  const auth = { mode: "static", token: "secret" };
  registerSecurityHooks({
    app,
    suppliedApp: true,
    allowedHosts: ["mcp.example"],
    allowedOrigins: ["client.example"],
    endpointPath: "/mcp",
    auth,
  });

  expect(app.addHook.mock.calls.slice(0, 2)).toEqual([
    ["onRequest", { hosts: ["mcp.example"] }],
    ["onRequest", { origins: ["client.example"] }],
  ]);
  const preHandler = app.addHook.mock.calls[2][1];
  const request = { routeOptions: { url: "/mcp" } };
  await preHandler(request, {});
  expect(mocks.authenticate).toHaveBeenCalledWith(request, {}, auth);
});

test("skips host and source hooks for package-created apps", async () => {
  mocks.hostHeaderValidation.mockClear();
  mocks.originValidation.mockClear();
  const app = createApp();
  registerSecurityHooks({
    app,
    suppliedApp: false,
    allowedHosts: ["mcp.example"],
    allowedOrigins: ["client.example"],
    endpointPath: "/mcp",
    auth: { mode: "none" },
  });

  expect(app.addHook).toHaveBeenCalledTimes(1);
  expect(mocks.hostHeaderValidation).not.toHaveBeenCalled();
  expect(mocks.originValidation).not.toHaveBeenCalled();
});

test("skips authentication for other routes and returns a denied reply", async () => {
  mocks.authenticate.mockClear();
  const app = createApp();
  registerSecurityHooks({
    app,
    suppliedApp: true,
    endpointPath: "/mcp",
    auth: { mode: "none" },
    authenticate: mocks.authenticate,
  });
  const preHandler = app.addHook.mock.calls[0][1];
  const otherRequest = { routeOptions: { url: "/health" } };
  await preHandler(otherRequest, {});
  expect(mocks.authenticate).not.toHaveBeenCalled();

  const reply = {};
  mocks.authenticate.mockResolvedValueOnce(false);
  expect(await preHandler({ routeOptions: { url: "/mcp" } }, reply)).toBe(reply);
});
