import { createMcpFastifyApp } from "@modelcontextprotocol/fastify";
import { buildServer } from "./tools.mjs";
import { loadPackageMeta } from "./meta.mjs";
import { resolveServerOptions } from "./server/options.mjs";
import { createMcpHandler } from "./server/mcp-handler.mjs";
import { mountMcpHandler } from "./server/fastify-route.mjs";
import { authenticateRequest } from "./server/authenticate.mjs";
import { createStdioResult } from "./server/stdio.mjs";
import { resolveRuntimeAuth } from "./oauth/runtime-auth.mjs";
import { mountOAuthResourceMetadata } from "./oauth/resource-metadata.mjs";

export async function mcpServer(options = {}) {
  const { config, toolsDir, activeLog } = resolveServerOptions(options);
  const meta = loadPackageMeta({ name: config.name, version: config.version, log: activeLog });
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
  if (auth?.mode === "oauth2") mountOAuthResourceMetadata(app, auth);
  app.addHook("onClose", () => handler.close());
  app.addHook("preHandler", async (request, reply) => {
    if (request.routeOptions.url !== config.endpointPath) return;
    if (!(await authenticateRequest(request, reply, auth))) return reply;
  });
  mountMcpHandler({ app, handler, endpointPath: config.endpointPath });
  if (config.port !== null) await app.listen({ host: config.host, port: Number(config.port) });
  return { app };
}
