export function setOAuthChallenge(res, { resource, scope } = {}) {
  const metadata = `${String(resource || "").replace(/\/$/, "")}/.well-known/oauth-protected-resource/mcp`;
  const parts = ['Bearer realm="mcp"'];
  if (metadata !== "/.well-known/oauth-protected-resource/mcp")
    parts.push(`resource_metadata="${metadata}"`);
  if (scope) parts.push(`scope="${scope}"`);
  res.set("WWW-Authenticate", parts.join(", "));
}
