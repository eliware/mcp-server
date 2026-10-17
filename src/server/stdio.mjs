import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export async function createStdioResult(
  initialServer,
  createTransport = () => new StdioServerTransport(),
) {
  const transport = createTransport();
  await initialServer.connect(transport);
  return { app: undefined, httpInstance: undefined, mcpServer: initialServer, transport };
}
