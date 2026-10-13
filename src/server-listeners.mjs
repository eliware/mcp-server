import { loadTlsOptions } from "./tls.mjs";
import { createRedirectApp } from "./redirect-app.mjs";
import { createListeningHandler } from "./server-listener-logging.mjs";

function waitForListener(instance, port, onListening) {
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      instance.removeListener("error", onError);
      reject(error);
    };
    instance.once("error", onError);
    try {
      instance.listen(port, () => {
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
  });
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
  const results = await Promise.allSettled(starts);
  const failure = results.find((result) => result.status === "rejected");
  if (failure) {
    for (const instance of [httpInstance, httpsInstance]) {
      if (instance?.listening) {
        try {
          instance.close();
        } catch {}
      }
    }
    throw failure.reason;
  }
  return { httpInstance, httpsInstance };
}
