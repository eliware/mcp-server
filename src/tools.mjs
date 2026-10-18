import { McpServer } from "@modelcontextprotocol/server";
import { discoverTools } from "./tool/discovery.mjs";
import { registerTools } from "./tool/registration.mjs";

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
  const server = new McpServer(
    { name, version },
    { capabilities: { tools: {}, resources: {}, prompts: {} } },
  );
  server.options = { name, version };
  server.context = context;
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
