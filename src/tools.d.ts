import type { McpServer } from "@modelcontextprotocol/server";
import type { McpServerOptions } from "./server.mjs";

export interface ToolRegistrationContext {
  mcpServer: McpServer;
  toolName: string;
  log: McpServerOptions["log"];
  context: Record<string, unknown>;
}
