import { mcpServer } from './index.mjs';
import { fileURLToPath } from 'node:url';

await mcpServer({
  stdio: process.argv.includes('--stdio'),
  httpPort: process.env.MCP_HTTP_PORT ? Number(process.env.MCP_HTTP_PORT) : 1234,
  auth: { mode: 'static', token: process.env.MCP_TOKEN },
  toolsDir: fileURLToPath(new URL('./examples/tools/', import.meta.url)),
});
