import fs from 'fs';
import { pathUrl } from '@eliware/path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

function normalizeToolsDir(toolsDir) {
  const drivePath = toolsDir.replaceAll('C:\\C:\\', 'C:\\');
  return drivePath.replace(/^[\\/](?=[A-Za-z]:)/, '');
}

export async function buildServer({ toolsDir, log, name, version, context, readDir = fs.readdirSync, loadModule = specifier => import(specifier), toolCache = new Map() }) {
  const server = new McpServer({ name, version }, { capabilities: { tools: {}, resources: {} } });
  server.options = { name, version };
  server.context = context;
  const resolvedToolsDir = normalizeToolsDir(toolsDir);
  let tools = toolCache.get(resolvedToolsDir);
  if (!tools) {
    tools = readDir(resolvedToolsDir).filter(file => file.endsWith('.mjs')).map(file => ({ file, toolName: file.replace(/\.mjs$/, '') }));
    toolCache.set(resolvedToolsDir, tools);
  }
  for (const { file, toolName } of tools) {
    try {
      const mod = await (toolCache.get(pathUrl(resolvedToolsDir, file)) || loadModule(pathUrl(resolvedToolsDir, file)));
      toolCache.set(pathUrl(resolvedToolsDir, file), mod);
      if (typeof mod.default === 'function') await mod.default({ mcpServer: server, toolName, log, ...context });
      else log.warn(`No default export function in ${file}`);
    } catch (err) {
      log.error(`Error registering MCP tool in ${file}:`, err?.stack || err);
    }
  }
  return server;
}
