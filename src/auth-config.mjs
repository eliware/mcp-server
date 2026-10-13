const MODES = new Set(["none", "static", "bearer-passthrough", "oauth2"]);

export function normalizeAuth(auth = { mode: "none" }) {
  const config = typeof auth === "string" ? { mode: auth } : auth || {};
  const mode = config.mode || "none";
  if (!MODES.has(mode)) throw new Error(`Unsupported auth mode: ${mode}`);
  if (mode === "static" && !config.token) throw new Error("static auth requires auth.token");
  if (
    mode === "oauth2" &&
    (!config.issuer || !config.resource || typeof config.introspect !== "function")
  ) {
    throw new Error("oauth2 auth requires issuer, resource, and introspect(token)");
  }
  if (mode !== "oauth2") return { ...config, mode };
  const requiredScopes = config.requiredScopes ?? config.scopes ?? [];
  if (
    !Array.isArray(requiredScopes) ||
    requiredScopes.some((scope) => typeof scope !== "string" || !scope.trim())
  ) {
    throw new Error("oauth2 auth requiredScopes must be an array of non-empty strings");
  }
  const subjectClaim = config.subjectClaim || "sub";
  if (typeof subjectClaim !== "string" || !subjectClaim.trim()) {
    throw new Error("oauth2 auth subjectClaim must be a non-empty string");
  }
  return { ...config, mode, requiredScopes: [...requiredScopes], subjectClaim };
}
