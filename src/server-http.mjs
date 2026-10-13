export function handleRequestFailure({ log, res }, err) {
  log.error("[MCP] Request failed:", err?.stack || err);
  if (!res.headersSent) res.status(500).json({ error: "Internal MCP server error" });
}

export function requestEndpoint({ handle, log }, req, res) {
  return handle(req, res).catch((err) => handleRequestFailure({ log, res }, err));
}

export function createPostHandler({ handle, log }) {
  return (req, res) => requestEndpoint({ handle, log }, req, res);
}
