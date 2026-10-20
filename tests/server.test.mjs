import { jest, test, expect } from "@jest/globals";

const logger = { debug() {}, info() {}, warn() {}, error() {} };
const app = {
  addHook: jest.fn(),
  listen: jest.fn(async () => {}),
  close: jest.fn(async () => {}),
};
const handler = { close: jest.fn(async () => {}) };
const mocks = {
  app,
  handler,
  buildServer: jest.fn(),
  createMcpFastifyApp: jest.fn(() => app),
  createMcpHandler: jest.fn(() => handler),
  mountMcpHandler: jest.fn(),
  authenticateRequest: jest.fn(async () => true),
  createStdioResult: jest.fn(() => ({ close: jest.fn() })),
  resolveRuntimeAuth: jest.fn((auth) => auth),
  mountOAuthResourceMetadata: jest.fn(),
  hostHeaderValidation: jest.fn((hosts) => ({ hosts })),
  originValidation: jest.fn((origins) => ({ origins })),
  loadPackageMeta: jest.fn(() => ({ name: "test-package", version: "1.0.0" })),
  resolveServerOptions: jest.fn((options = {}) => {
    const config = {
      auth: { mode: "none" },
      context: {},
      endpointPath: "/mcp",
      host: "127.0.0.1",
      port: 3000,
      stdio: false,
      ...options,
    };
    return {
      config,
      toolsDir: "/tools",
      packagePath: "/package.json",
      activeLog: config.log || logger,
    };
  }),
};

await jest.unstable_mockModule("@modelcontextprotocol/fastify", () => ({
  createMcpFastifyApp: mocks.createMcpFastifyApp,
  hostHeaderValidation: mocks.hostHeaderValidation,
  originValidation: mocks.originValidation,
}));
await jest.unstable_mockModule("../src/tools.mjs", () => ({ buildServer: mocks.buildServer }));
await jest.unstable_mockModule("../src/meta.mjs", () => ({
  loadPackageMeta: mocks.loadPackageMeta,
}));
await jest.unstable_mockModule("../src/server/options.mjs", () => ({
  resolveServerOptions: mocks.resolveServerOptions,
}));
await jest.unstable_mockModule("../src/server/mcp-handler.mjs", () => ({
  createMcpHandler: mocks.createMcpHandler,
}));
await jest.unstable_mockModule("../src/server/fastify-route.mjs", () => ({
  mountMcpHandler: mocks.mountMcpHandler,
}));
await jest.unstable_mockModule("../src/server/authenticate.mjs", () => ({
  authenticateRequest: mocks.authenticateRequest,
}));
await jest.unstable_mockModule("../src/server/stdio.mjs", () => ({
  createStdioResult: mocks.createStdioResult,
}));
await jest.unstable_mockModule("../src/oauth/runtime-auth.mjs", () => ({
  resolveRuntimeAuth: mocks.resolveRuntimeAuth,
}));
await jest.unstable_mockModule("../src/oauth/resource-metadata.mjs", () => ({
  mountOAuthResourceMetadata: mocks.mountOAuthResourceMetadata,
}));

const { mcpServer } = await import("../src/server.mjs");

function clearMocks() {
  for (const value of Object.values(mocks)) {
    if (typeof value?.mockClear === "function") value.mockClear();
  }
  app.addHook.mockClear();
  app.listen.mockClear();
  app.close.mockClear();
  handler.close.mockClear();
}

test("builds a default HTTP server without listening when port is null", async () => {
  clearMocks();
  const result = await mcpServer({ port: null, context: { value: 1 } });
  const handlerOptions = mocks.createMcpHandler.mock.calls[0][0];

  expect(result.app).toBe(app);
  expect(result.close).toBeInstanceOf(Function);
  expect(mocks.createMcpFastifyApp).toHaveBeenCalledWith({
    host: "127.0.0.1",
    allowedHosts: undefined,
    allowedOrigins: undefined,
  });
  expect(mocks.createMcpHandler).toHaveBeenCalledTimes(1);
  expect(mocks.mountMcpHandler).toHaveBeenCalledWith({ app, handler, endpointPath: "/mcp" });
  expect(app.listen).not.toHaveBeenCalled();
  await handlerOptions.buildServer();
  expect(mocks.buildServer).toHaveBeenCalledWith(handlerOptions.serverOptions);

  const preHandler = app.addHook.mock.calls.find(([name]) => name === "preHandler")[1];
  const request = { routeOptions: { url: "/health" } };
  await preHandler(request, {});
  expect(mocks.authenticateRequest).not.toHaveBeenCalled();
  const mcpRequest = { routeOptions: { url: "/mcp" } };
  await preHandler(mcpRequest, {});
  expect(mocks.authenticateRequest).toHaveBeenCalledWith(mcpRequest, {}, { mode: "none" });
  const deniedReply = {};
  mocks.authenticateRequest.mockResolvedValueOnce(false);
  expect(await preHandler(mcpRequest, deniedReply)).toBe(deniedReply);

  const onClose = app.addHook.mock.calls.find(([name]) => name === "onClose")[1];
  await onClose();
  expect(handler.close).toHaveBeenCalledTimes(1);
  await result.close();
  expect(app.close).toHaveBeenCalledTimes(1);
});

test("starts the default server with the configured default listener", async () => {
  clearMocks();
  await mcpServer();
  expect(mocks.createMcpFastifyApp).toHaveBeenCalledWith({
    host: "127.0.0.1",
    allowedHosts: undefined,
    allowedOrigins: undefined,
  });
  expect(app.listen).toHaveBeenCalledWith({ host: "127.0.0.1", port: 3000 });
});

test("configures a supplied Fastify app and OAuth metadata", async () => {
  clearMocks();
  const configureFastify = jest.fn();
  const auth = { mode: "oauth2", issuer: "https://issuer.example" };
  const options = {
    fastify: app,
    allowedHosts: ["mcp.example"],
    allowedOrigins: ["client.example"],
    configureFastify,
    auth,
    port: 4000,
  };

  expect((await mcpServer(options)).app).toBe(app);
  expect(mocks.createMcpFastifyApp).not.toHaveBeenCalled();
  expect(configureFastify).toHaveBeenCalledWith(app);
  expect(mocks.hostHeaderValidation).toHaveBeenCalledWith(options.allowedHosts);
  expect(mocks.originValidation).toHaveBeenCalledWith(options.allowedOrigins);
  expect(app.addHook).toHaveBeenCalledWith("onRequest", { hosts: options.allowedHosts });
  expect(app.addHook).toHaveBeenCalledWith("onRequest", { origins: options.allowedOrigins });
  expect(mocks.mountOAuthResourceMetadata).toHaveBeenCalledWith(app, auth);
  expect(app.listen).toHaveBeenCalledWith({ host: "127.0.0.1", port: 4000 });
});

test("selects stdio without creating an HTTP server", async () => {
  clearMocks();
  const result = await mcpServer({ stdio: true });
  expect(result).toEqual({ close: expect.any(Function) });
  expect(result.close).toBe(mocks.createStdioResult.mock.results[0].value.close);
  expect(mocks.createStdioResult).toHaveBeenCalledTimes(1);
  expect(mocks.createMcpFastifyApp).not.toHaveBeenCalled();
  expect(mocks.createMcpHandler).not.toHaveBeenCalled();
});
