import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpServerOptions } from "./server.mjs";

export interface ToolRegistrationContext {
  mcpServer: McpServer;
  toolName: string;
  log: McpServerOptions["log"];
  [key: string]: unknown;
}
