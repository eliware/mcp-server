export function createListeningHandler({ log, port }) {
  return () => listeningCallback({ log }, port);
}

export function listeningCallback({ log }, port) {
  log.debug?.(`MCP HTTP Server listening on ${port}`);
}
