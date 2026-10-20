import { mcpServer } from "@eliware/mcp-server";

const token = process.env.MCP_TOKEN;
if (!token) throw new Error("Set MCP_TOKEN before you start the server.");

await mcpServer({
  auth: { mode: "static", token },
  toolsDir: new URL("../tools/", import.meta.url).pathname,
  port: 1234,
});
