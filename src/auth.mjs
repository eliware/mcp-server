import { setOAuthChallenge } from "./oauth.mjs";
import { bearer, matchesResource, sanitizeClaims, validStaticToken } from "./auth-token.mjs";
export {
  getAccessToken,
  getUser,
  hasScope,
  requireAuth,
  requireBearer,
  requireScope,
} from "./auth-context.mjs";
export { createOAuthIntrospector } from "./auth-introspection.mjs";

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

export function createAuthMiddleware({ auth = { mode: "none" }, endpointPaths }) {
  const config = normalizeAuth(auth);
  return async (req, res, next) => {
    if (req.method !== "POST" || !endpointPaths.includes(req.path)) return next();
    try {
      const accessToken = bearer(req);
      if (config.mode === "static" && !validStaticToken(accessToken, config.token)) {
        return res.status(401).json({ error: "Invalid bearer token" });
      }
      if (config.mode === "bearer-passthrough" && !accessToken) {
        return res.status(401).json({ error: "Bearer token required" });
      }
      if (config.mode === "oauth2") {
        if (!accessToken) {
          setOAuthChallenge(res, { resource: config.resource });
          return res.status(401).json({ error: "Bearer token required" });
        }
        const info = await config.introspect(accessToken);
        const scopes = String(info?.scope || "")
          .split(/\s+/)
          .filter(Boolean);
        const valid =
          info?.active &&
          info.iss === config.issuer &&
          matchesResource(info, config.resource) &&
          (!info.exp || Number(info.exp) > Math.floor(Date.now() / 1000)) &&
          (!info.token_type || String(info.token_type).toLowerCase() === "bearer") &&
          config.requiredScopes.every((scope) => scopes.includes(scope));
        if (!valid) return res.status(401).json({ error: "Invalid OAuth2 token" });
        req.mcpAuth = {
          mode: config.mode,
          subject: info[config.subjectClaim] || info.sub || info.user_id,
          clientId: info.client_id,
          issuer: info.iss,
          resource: config.resource,
          scopes,
          claims: sanitizeClaims(info),
          accessToken,
        };
      } else {
        req.mcpAuth = { mode: config.mode, ...(accessToken ? { accessToken } : {}) };
      }
      req.mcpBearerToken = accessToken;
      next();
    } catch (err) {
      return res.status(500).json({ error: "Authentication failed", details: String(err) });
    }
  };
}
