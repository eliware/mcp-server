import fs from 'fs';
import { pathUrl } from '@eliware/path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

function normalizeToolsDir(toolsDir) {
  const drivePath = toolsDir.replaceAll('C:\\C:\\', 'C:\\');
  return drivePath.replace(/^[\\/](?=[A-Za-z]:)/, '');
}

export async function buildServer({ toolsDir, log, name, version, context, readDir = fs.readdirSync, loadModule = specifier => import(specifier) }) {
  const server = new McpServer({ name, version }, { capabilities: { tools: {}, resources: {} } });
  server.options = { name, version };
  server.context = context;
  const resolvedToolsDir = normalizeToolsDir(toolsDir);
  const files = readDir(resolvedToolsDir).filter(file => file.endsWith('.mjs'));
  for (const file of files) {
    try {
      const toolName = file.replace(/\.mjs$/, '');
      const mod = await loadModule(pathUrl(resolvedToolsDir, file));
      if (typeof mod.default === 'function') await mod.default({ mcpServer: server, toolName, log, ...context });
      else log.warn(`No default export function in ${file}`);
    } catch (err) {
      log.error(`Error registering MCP tool in ${file}:`, err?.stack || err);
    }
  }
  return server;
}
