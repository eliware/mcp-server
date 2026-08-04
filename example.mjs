// server.mjs
// 1. Install @eliware/mcp-server.
// 2. Put tool files in ./tools/.
// 3. Start this file.
// That is the whole server.

import { mcpServer } from '@eliware/mcp-server';

await mcpServer({
  stdio: process.argv.includes('--stdio'),
  httpPort: process.env.MCP_HTTP_PORT ? Number(process.env.MCP_HTTP_PORT) : 1234,
  authToken: process.env.MCP_TOKEN,

  // Every value here is available to each tool as an injected property.
  context: {
    appName: 'my-mcp-server',
    db: createDatabaseClient(),
  },
});

function createDatabaseClient() {
  return {
    async query(sql, values = []) {
      // Replace with your real database client.
      return { sql, values };
    },
  };
}
