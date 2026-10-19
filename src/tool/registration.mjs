import { pathUrl } from "@eliware/path";

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
      else throw new Error(`No default export function in ${file}`);
    } catch (err) {
      throw new Error(`Error registering MCP tool in ${file}: ${err?.message || err}`, {
        cause: err,
      });
    }
  }
}
