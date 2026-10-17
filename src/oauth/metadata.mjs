export function setOAuthChallenge(res, { resource, scope } = {}) {
  const metadata = `${String(resource || "").replace(/\/$/, "")}/.well-known/oauth-protected-resource/mcp`;
  const parts = ['Bearer realm="mcp"'];
  if (metadata !== "/.well-known/oauth-protected-resource/mcp")
    parts.push(`resource_metadata=${quoteValue(metadata)}`);
  if (scope) parts.push(`scope=${quoteValue(scope)}`);
  (res.header || res.set).call(res, "WWW-Authenticate", parts.join(", "));
}

function quoteValue(value) {
  const escaped = [...String(value)]
    .map((char) => {
      const code = char.charCodeAt(0);
      if (char === '"' || char === "\\") return `\\${char}`;
      if (code < 32 || code === 127) return `%${code.toString(16).padStart(2, "0").toUpperCase()}`;
      return char;
    })
    .join("");
  return `"${escaped}"`;
}
