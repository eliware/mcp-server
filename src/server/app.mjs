import { createAuthMiddleware } from "../auth/middleware.mjs";
import { resolveRuntimeAuth } from "../oauth/runtime-auth.mjs";
import { configureHttp } from "../http.mjs";
import { createTransport } from "../transport.mjs";
import { createRequestHandler } from "../handler.mjs";
import { mountOAuthResourceMetadata } from "../oauth/resource-metadata.mjs";
import { createPostHandler } from "./http.mjs";

export async function createMcpApp({
  config,
  serverOptions,
  initialServer,
  activeLog,
  buildServer,
}) {
  const {
    endpointPath,
    allowedOrigins,
    configureApp,
    app: suppliedApp,
    createApp,
    auth,
    stateless,
  } = config;
  const app = suppliedApp || createApp();
  configureHttp({ app, allowedOrigins });
  if (configureApp) await configureApp(app);
  if (auth?.mode === "oauth2") mountOAuthResourceMetadata(app, auth);
  const runtimeAuth = resolveRuntimeAuth(auth);
  app.use(createAuthMiddleware({ auth: runtimeAuth, endpointPaths: [endpointPath] }));
  let initialTransport;
  if (!stateless) {
    initialTransport = createTransport(serverOptions);
    await initialServer.connect(initialTransport);
  }
  const handle = createRequestHandler({
    stateless,
    initialServer,
    initialTransport,
    buildServer,
    createTransport,
    options: serverOptions,
  });
  app.post([endpointPath], createPostHandler({ handle, log: activeLog }));
  return { app, initialTransport };
}
