import { loadTlsOptions } from "./tls.mjs";
import { createRedirectApp } from "./redirect-app.mjs";
import { createListeningHandler } from "./server-listener-logging.mjs";

function waitForListener(instance, port, onListening) {
  let cancel;
  const promise = new Promise((resolve, reject) => {
    let settled = false;
    const onError = (error) => {
      settled = true;
      instance.removeListener("error", onError);
      reject(error);
    };
    instance.once("error", onError);
    try {
      instance.listen(port, () => {
        if (settled) {
          instance.close(() => {});
          return;
        }
        settled = true;
        instance.removeListener("error", onError);
        try {
          onListening();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      onError(error);
    }
    cancel = (error) => {
      if (settled) return;
      settled = true;
      instance.removeListener("error", onError);
      try {
        instance.close(() => {});
      } catch {}
      reject(error);
    };
  });
  return { promise, cancel: (error) => cancel?.(error) };
}

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
  const loadedTls = loadTlsOptions({ tls });
  if (httpsPort !== undefined && (!loadedTls.key || !loadedTls.cert)) {
    throw new Error("httpsPort requires tls.key and tls.cert");
  }
  let httpInstance;
  let httpsInstance;
  const starts = [];
  if (httpPort !== null && httpPort !== false) {
    const httpApp = httpRedirect ? createRedirectApp({ createApp, httpsHost, httpsPort }) : app;
    httpInstance = createHttpServer(httpApp);
    starts.push(
      waitForListener(
        httpInstance,
        httpPort,
        createListeningHandler({ log: activeLog, port: httpPort }),
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
