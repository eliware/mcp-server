import { McpServer } from "@modelcontextprotocol/server";

export function createToolServer({ name, version, context, McpServerClass = McpServer }) {
  const server = new McpServerClass(
    { name, version },
    { capabilities: { tools: {}, resources: {}, prompts: {} } },
  );
  server.options = { name, version };
  server.context = context;
  return server;
}
