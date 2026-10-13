export function setOAuthChallenge(res, { resource, scope } = {}) {
  const metadata = `${String(resource || "").replace(/\/$/, "")}/.well-known/oauth-protected-resource/mcp`;
  const parts = ['Bearer realm="mcp"'];
  if (metadata !== "/.well-known/oauth-protected-resource/mcp")
    parts.push(`resource_metadata="${metadata}"`);
  if (scope) parts.push(`scope="${scope}"`);
  res.set("WWW-Authenticate", parts.join(", "));
}

export function mountOAuthResourceMetadata(app, { resource, issuer, scopes = [] } = {}) {
  if (!resource || !issuer) return;
  const metadata = { resource, authorization_servers: [issuer], scopes_supported: scopes };
  app.get("/.well-known/oauth-protected-resource", (_req, res) => res.json(metadata));
  app.get("/.well-known/oauth-protected-resource/mcp", (_req, res) => res.json(metadata));
}
