import { bearer } from "./auth-bearer.mjs";
import { resolveAuthRequest } from "./auth-request.mjs";
import { normalizeAuth } from "./auth-config.mjs";
import { authenticateOAuthRequest } from "./auth-oauth.mjs";
import { isAuthRequest } from "./auth-route.mjs";

export function createAuthMiddleware({ auth = { mode: "none" }, endpointPaths }) {
  const config = normalizeAuth(auth);
  return async (req, res, next) => {
    if (!isAuthRequest(req, endpointPaths)) return next();
    try {
      const accessToken = bearer(req);
      if (config.mode === "oauth2") {
        if (!(await authenticateOAuthRequest({ config, accessToken, req, res }))) return;
      } else {
        const result = resolveAuthRequest(config, accessToken);
        if (result.error) return res.status(401).json({ error: result.error });
        req.mcpAuth = result.auth;
      }
      req.mcpBearerToken = accessToken;
      next();
    } catch {
      return res.status(500).json({ error: "Authentication failed" });
    }
  };
}
