export function mountOAuthResourceMetadata(app, { resource, issuer, scopes = [] } = {}) {
  if (!resource || !issuer) return;
  const metadata = { resource, authorization_servers: [issuer], scopes_supported: scopes };
  app.get("/.well-known/oauth-protected-resource", (_req, res) => res.json(metadata));
  app.get("/.well-known/oauth-protected-resource/mcp", (_req, res) => res.json(metadata));
}
