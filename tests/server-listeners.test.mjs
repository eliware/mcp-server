import { jest, test, expect } from "@jest/globals";
import { startListeners } from "../src/server-listeners.mjs";

test("listener module starts the HTTP listener", () => {
  const instance = { listen: jest.fn() };
  const createHttpServer = jest.fn(() => instance);
  const result = startListeners({
    config: {
      httpPort: 1234,
      httpsPort: undefined,
      httpRedirect: false,
      createHttpServer,
      createHttpsServer: jest.fn(),
      createApp: jest.fn(),
    },
    app: {},
    activeLog: { debug: jest.fn() },
  });
  expect(result.httpInstance).toBe(instance);
  expect(instance.listen).toHaveBeenCalledWith(1234, expect.any(Function));
});

test("starts HTTPS only when TLS values exist", () => {
  const instance = { listen: jest.fn() };
  const createHttpsServer = jest.fn(() => instance);
  const result = startListeners({
    config: {
      httpPort: null,
      httpsPort: 8443,
      tls: { key: "key", cert: "cert" },
      createHttpServer: jest.fn(),
      createHttpsServer,
    },
    app: {},
    activeLog: { debug: jest.fn() },
  });
  expect(result.httpInstance).toBeUndefined();
  expect(result.httpsInstance).toBe(instance);
  expect(createHttpsServer).toHaveBeenCalledWith({ key: "key", cert: "cert" }, {});
  expect(instance.listen).toHaveBeenCalledWith(8443, expect.any(Function));
});

test("requires TLS values for an HTTPS listener", () => {
  expect(() =>
    startListeners({
      config: { httpPort: null, httpsPort: 443 },
      app: {},
      activeLog: { debug: jest.fn() },
    }),
  ).toThrow("httpsPort requires tls.key and tls.cert");
});

test("starts HTTP and HTTPS listeners with an HTTP redirect app", () => {
  const httpServer = { listen: jest.fn() };
  const httpsServer = { listen: jest.fn() };
  const redirectApp = { use: jest.fn() };
  const createApp = jest.fn(() => redirectApp);
  const result = startListeners({
    config: {
      httpPort: 80,
      httpsPort: 443,
      httpRedirect: true,
      tls: { key: "key", cert: "cert" },
      createApp,
      createHttpServer: jest.fn(() => httpServer),
      createHttpsServer: jest.fn(() => httpsServer),
    },
    app: {},
    activeLog: { debug: jest.fn() },
  });
  expect(createApp).toHaveBeenCalled();
  expect(redirectApp.use).toHaveBeenCalledWith(expect.any(Function));
  expect(result).toEqual({ httpInstance: httpServer, httpsInstance: httpsServer });
});
