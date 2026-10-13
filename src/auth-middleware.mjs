import { bearer, validStaticToken } from "./auth-token.mjs";
import { normalizeAuth } from "./auth-config.mjs";
import { authenticateOAuthRequest } from "./auth-oauth.mjs";

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
        if (!(await authenticateOAuthRequest({ config, accessToken, req, res }))) return;
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
