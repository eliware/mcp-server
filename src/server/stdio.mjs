import { serveStdio } from "@modelcontextprotocol/server/stdio";

export function createStdioResult(serverFactory, startStdio = serveStdio) {
  const transport = startStdio(serverFactory);
  return { transport };
}
