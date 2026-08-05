import { mcpServer } from '@eliware/mcp-server';

await mcpServer({
  auth: { mode: 'bearer-passthrough' },
  toolsDir: new URL('../tools/', import.meta.url).pathname,
  httpPort: 1234,
});
