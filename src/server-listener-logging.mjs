export function createListeningHandler({ log, port }) {
  return () => listeningCallback({ log }, port);
}

export function createListenerErrorHandler({ log }) {
  return (error) => log.error?.("[MCP] Listener error:", error);
}

export function listeningCallback({ log }, port) {
  log.debug(`MCP HTTP Server listening on ${port}`);
}
