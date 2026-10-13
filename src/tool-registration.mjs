import { pathUrl } from "@eliware/common";

export async function registerTools({
  server,
  toolsDir,
  tools,
  toolCache,
  log,
  context,
  loadModule = (specifier) => import(specifier),
}) {
  for (const { file, toolName } of tools) {
    try {
      const specifier = pathUrl(toolsDir, file);
      const mod = await (toolCache.get(specifier) || loadModule(specifier));
      toolCache.set(specifier, mod);
      if (typeof mod.default === "function")
        await mod.default({ mcpServer: server, toolName, log, ...context });
      else log.warn(`No default export function in ${file}`);
    } catch (err) {
      log.error(`Error registering MCP tool in ${file}:`, err?.stack || err);
    }
  }
}
