import { discoverTools } from "./tool/discovery.mjs";
import { registerTools } from "./tool/registration.mjs";
import { createToolServer } from "./tool/server.mjs";

export async function buildServer({
  toolsDir,
  log,
  name,
  version,
  context,
  readDir,
  loadModule,
  toolCache = new Map(),
}) {
  const server = createToolServer({ name, version, context });
  const { resolvedToolsDir, tools } = discoverTools({ toolsDir, readDir, toolCache });
  await registerTools({
    server,
    toolsDir: resolvedToolsDir,
    tools,
    toolCache,
    log,
    context,
    loadModule,
  });
  return server;
}
