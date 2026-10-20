export function createListenerErrorHandler({ log }) {
  return (error) => log.error?.("[MCP] Listener error:", error);
}
