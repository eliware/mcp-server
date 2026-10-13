import { jest, test, expect } from "@jest/globals";
import { startListeners } from "../src/server-listeners.mjs";

function createServer() {
  const instance = {
    listening: false,
    on: jest.fn(),
    removeListener: jest.fn(),
    close: jest.fn(function () {
      this.listening = false;
    }),
  };
  instance.listen = jest.fn(function (_port, callback) {
    this.listening = true;
    callback();
  });
  return instance;
}

test("listener module starts the HTTP listener", async () => {
  const instance = createServer();
  const createHttpServer = jest.fn(() => instance);
  const result = await startListeners({
    config: {
      httpPort: 1234,
      httpsPort: undefined,
      httpRedirect: false,
      createHttpServer,
      createHttpsServer: jest.fn(),
      createApp: jest.fn(),
    },
    app: {},
    activeLog: { debug: jest.fn(), error: jest.fn() },
  });
  expect(result.httpInstance).toBe(instance);
  expect(instance.listen).toHaveBeenCalledWith(1234, expect.any(Function));
  instance.on.mock.calls[0][1](new Error("runtime"));
});

test("starts HTTPS only when TLS values exist", async () => {
  const instance = createServer();
  const createHttpsServer = jest.fn(() => instance);
  const result = await startListeners({
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

test("requires TLS values for an HTTPS listener", async () => {
  await expect(
    startListeners({
      config: { httpPort: null, httpsPort: 443 },
      app: {},
      activeLog: { debug: jest.fn() },
    }),
  ).rejects.toThrow("httpsPort requires tls.key and tls.cert");
});

test("requires a configured host and port for HTTP redirects", async () => {
  await expect(
    startListeners({
      config: { httpPort: 80, httpRedirect: true, createHttpServer: jest.fn() },
      app: {},
      activeLog: { debug: jest.fn() },
    }),
  ).rejects.toThrow("httpRedirect requires httpsHost and httpsPort");
});

test("starts HTTP and HTTPS listeners with an HTTP redirect app", async () => {
  const httpServer = createServer();
  const httpsServer = createServer();
  const redirectApp = { use: jest.fn() };
  const createApp = jest.fn(() => redirectApp);
  const result = await startListeners({
    config: {
      httpPort: 80,
      httpsPort: 443,
      httpRedirect: true,
      httpsHost: "trusted.example",
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

test("rejects when a listener fails to bind", async () => {
  const error = new Error("EADDRINUSE");
  let onError;
  const instance = {
    on: jest.fn((_event, callback) => {
      onError = callback;
    }),
    removeListener: jest.fn(),
    listen: jest.fn(),
  };
  const startup = startListeners({
    config: {
      httpPort: 1234,
      createHttpServer: () => instance,
    },
    app: {},
    activeLog: { debug: jest.fn() },
  });
  onError(error);
  await expect(startup).rejects.toBe(error);
});

test("rejects synchronous bind errors", async () => {
  const error = new Error("invalid port");
  const instance = {
    on: jest.fn(),
    removeListener: jest.fn(),
    listen: jest.fn(() => {
      throw error;
    }),
  };
  const startup = startListeners({
    config: { httpPort: "invalid", createHttpServer: () => instance },
    app: {},
    activeLog: { debug: jest.fn() },
  });
  await expect(startup).rejects.toBe(error);
});

test("closes a listener if another startup callback fails", async () => {
  const httpServer = createServer();
  const httpsServer = createServer();
  const activeLog = {
    debug: jest.fn(() => {
      if (httpsServer.listening) throw new Error("log error");
    }),
  };
  const startup = startListeners({
    config: {
      httpPort: 80,
      httpsPort: 443,
      tls: { key: "key", cert: "cert" },
      createHttpServer: () => httpServer,
      createHttpsServer: () => httpsServer,
    },
    app: {},
    activeLog,
  });
  await expect(startup).rejects.toThrow("log error");
  expect(httpServer.close).toHaveBeenCalled();
  expect(httpsServer.close).toHaveBeenCalled();
});

test("stops pending listeners when another listener fails to bind", async () => {
  const httpServer = createServer();
  let onHttpListening;
  httpServer.listen = jest.fn((_port, callback) => {
    onHttpListening = callback;
  });
  httpServer.close.mockImplementation(function (callback) {
    this.listening = false;
    callback?.();
  });
  const httpsServer = createServer();
  httpsServer.listen = jest.fn();
  httpsServer.on.mockImplementation((_event, callback) => {
    httpsServer.onError = callback;
  });
  const startup = startListeners({
    config: {
      httpPort: 80,
      httpsPort: 443,
      tls: { key: "key", cert: "cert" },
      createHttpServer: () => httpServer,
      createHttpsServer: () => httpsServer,
    },
    app: {},
    activeLog: { debug: jest.fn() },
  });
  const error = new Error("EADDRINUSE");
  httpsServer.onError(error);
  await expect(startup).rejects.toBe(error);
  expect(httpServer.close).toHaveBeenCalled();
  httpServer.listening = true;
  onHttpListening();
  expect(httpServer.close).toHaveBeenCalledTimes(2);
});
