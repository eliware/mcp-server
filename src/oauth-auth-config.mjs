export function normalizeOAuthAuth(config) {
  if (!config.issuer || !config.resource || typeof config.introspect !== "function") {
    throw new Error("oauth2 auth requires issuer, resource, and introspect(token)");
  }
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
  return { ...config, mode: "oauth2", requiredScopes: [...requiredScopes], subjectClaim };
}
