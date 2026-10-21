import { createMcpFastifyApp } from "@modelcontextprotocol/fastify";
import { buildServer } from "./tools.mjs";
import { loadPackageMeta } from "./meta.mjs";
import { resolveServerOptions } from "./server/options.mjs";
import { createMcpHandler } from "./server/mcp-handler.mjs";
import { mountMcpHandler } from "./server/fastify-route.mjs";
import { createStdioResult } from "./server/stdio.mjs";
import { resolveRuntimeAuth } from "./oauth/runtime-auth.mjs";
import { registerSecurityHooks } from "./server/security-hooks.mjs";
import { mountOAuthRoutes } from "./server/oauth-routes.mjs";

export async function mcpServer(options = {}) {
  const { config, toolsDir, packagePath, activeLog } = resolveServerOptions(options);
  const meta = loadPackageMeta({
    name: config.name,
    version: config.version,
    log: activeLog,
    packagePath,
  });
  const serverOptions = { ...meta, toolsDir, log: activeLog, context: config.context };
  const build = () => buildServer(serverOptions);
  if (config.stdio) return createStdioResult(build);
  const handler = createMcpHandler({ buildServer: build, serverOptions });
  const app =
    config.fastify ||
    createMcpFastifyApp({
      host: config.host,
      allowedHosts: config.allowedHosts,
      allowedOrigins: config.allowedOrigins,
    });
  if (config.configureFastify) await config.configureFastify(app);
  const auth = resolveRuntimeAuth(config.auth);
  mountOAuthRoutes({ app, auth });
  app.addHook("onClose", () => handler.close());
  registerSecurityHooks({
    app,
    suppliedApp: Boolean(config.fastify),
    allowedHosts: config.allowedHosts,
    allowedOrigins: config.allowedOrigins,
    endpointPath: config.endpointPath,
    auth,
  });
  mountMcpHandler({ app, handler, endpointPath: config.endpointPath });
  if (config.port !== null) await app.listen({ host: config.host, port: Number(config.port) });
  return { app, close: () => app.close() };
}
