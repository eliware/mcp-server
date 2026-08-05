import { mcpServer } from '@eliware/mcp-server';

await mcpServer({
  auth: { mode: 'static', token: process.env.MCP_TOKEN },
  toolsDir: new URL('../tools/', import.meta.url).pathname,
  httpPort: 1234,
});
