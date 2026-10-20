// server.mjs
// 1. Install @eliware/mcp-server.
// 2. Put tool files in ./tools/.
// 3. Start this file.
// That is the whole server.

import { mcpServer } from "@eliware/mcp-server";

const server = await mcpServer({
  stdio: process.argv.includes("--stdio"),
  port: process.env.PORT ? Number(process.env.PORT) : 1234,
  context: {
    appName: "my-mcp-server",
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

process.once("SIGINT", () => void server.close());
process.once("SIGTERM", () => void server.close());
