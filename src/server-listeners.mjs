import { loadTlsOptions } from "./tls.mjs";
import { createListeningHandler, createRedirectApp } from "./server-http.mjs";

export function startListeners({ config, app, activeLog }) {
  const { httpPort, httpsPort, tls, httpRedirect, createApp, createHttpServer, createHttpsServer } =
    config;
  const loadedTls = loadTlsOptions({ tls });
  if (httpsPort !== undefined && (!loadedTls.key || !loadedTls.cert)) {
    throw new Error("httpsPort requires tls.key and tls.cert");
  }
  let httpInstance;
  let httpsInstance;
  if (httpPort !== null && httpPort !== false) {
    const httpApp = httpRedirect ? createRedirectApp({ createApp, httpsPort }) : app;
    httpInstance = createHttpServer(httpApp);
    httpInstance.listen(httpPort, createListeningHandler({ log: activeLog, port: httpPort }));
  }
  if (httpsPort !== undefined) {
    httpsInstance = createHttpsServer(loadedTls, app);
    httpsInstance.listen(httpsPort, createListeningHandler({ log: activeLog, port: httpsPort }));
  }
  return { httpInstance, httpsInstance };
}
