import { buildServer } from "./tools.mjs";
import { loadPackageMeta } from "./meta.mjs";
import { createMcpApp } from "./server-app.mjs";
import { resolveServerOptions } from "./server-options.mjs";
import { startListeners } from "./server-listeners.mjs";
import { createStdioResult } from "./server-stdio.mjs";

export async function mcpServer(options = {}) {
  const { config, toolsDir, activeLog } = resolveServerOptions(options);
  const meta = loadPackageMeta({ name: config.name, version: config.version, log: activeLog });
  const serverOptions = {
    ...meta,
    toolsDir,
    log: activeLog,
    context: config.context,
    enableJsonResponse: config.enableJsonResponse,
    stateless: config.stateless,
    toolCache: new Map(),
  };
  const initialServer = await buildServer(serverOptions);
  if (config.stdio) return createStdioResult(initialServer);
  const { app, initialTransport } = await createMcpApp({
    config,
    serverOptions,
    initialServer,
    activeLog,
    buildServer,
  });
  const listeners = startListeners({ config, app, activeLog });
  return { app, ...listeners, mcpServer: initialServer, transport: initialTransport };
}
