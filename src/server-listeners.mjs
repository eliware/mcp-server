import { loadTlsOptions } from "./tls.mjs";
import { createRedirectApp } from "./redirect-app.mjs";
import { createListenerErrorHandler, createListeningHandler } from "./server-listener-logging.mjs";
import { normalizeHttpsPort } from "./redirect-target.mjs";
import { waitForListener } from "./server-listener-startup.mjs";

export async function startListeners({ config, app, activeLog }) {
  const {
    httpPort,
    httpsPort,
    httpsHost,
    tls,
    httpRedirect,
    createApp,
    createHttpServer,
    createHttpsServer,
  } = config;
  if (httpRedirect && (!httpsHost || httpsPort === undefined)) {
    throw new Error("httpRedirect requires httpsHost and httpsPort");
  }
  if (httpRedirect) normalizeHttpsPort(httpsPort);
  const loadedTls = loadTlsOptions({ tls });
  if (httpsPort !== undefined && (!loadedTls.key || !loadedTls.cert)) {
    throw new Error("httpsPort requires tls.key and tls.cert");
  }
  let httpInstance;
  let httpsInstance;
  const starts = [];
  const onRuntimeError = createListenerErrorHandler({ log: activeLog });
  if (httpPort !== null && httpPort !== false) {
    const httpApp = httpRedirect ? createRedirectApp({ createApp, httpsHost, httpsPort }) : app;
    httpInstance = createHttpServer(httpApp);
    starts.push(
      waitForListener(
        httpInstance,
        httpPort,
        createListeningHandler({ log: activeLog, port: httpPort }),
        onRuntimeError,
      ),
    );
  }
  if (httpsPort !== undefined) {
    httpsInstance = createHttpsServer(loadedTls, app);
    starts.push(
      waitForListener(
        httpsInstance,
        httpsPort,
        createListeningHandler({ log: activeLog, port: httpsPort }),
        onRuntimeError,
      ),
    );
  }
  try {
    await Promise.all(starts.map((start) => start.promise));
  } catch (error) {
    for (const start of starts) start.cancel(error);
    for (const instance of [httpInstance, httpsInstance]) {
      if (instance?.listening) instance.close();
    }
    throw error;
  }
  return { httpInstance, httpsInstance };
}
