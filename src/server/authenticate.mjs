import { normalizeAuth } from "../auth/config.mjs";
import { resolveAuthRequest } from "../auth/request.mjs";
import { validateOAuthToken } from "../auth/token-validation.mjs";
import { createOAuthAuthContext } from "../auth/oauth/context.mjs";
import { setOAuthChallenge } from "../oauth/metadata.mjs";
import { attachAuthInfo } from "./auth-context.mjs";

export async function authenticateRequest(request, reply, auth) {
  const config = normalizeAuth(auth);
  if (config.mode === "none") {
    return true;
  }
  if (config.mode === "oauth2") {
    return authenticateOAuth(request, reply, config);
  }
  const header = request.headers.authorization || "";
  const accessToken = /^Bearer\s+(.+)$/i.exec(header)?.[1];
  const result = resolveAuthRequest(config, accessToken);
  if (result.error) {
    reply.code(401).send({ error: result.error });
    return false;
  }
  attachAuthInfo(request, result.auth);
  return true;
}

async function authenticateOAuth(request, reply, config) {
  const accessToken = /^Bearer\s+(.+)$/i.exec(request.headers.authorization || "")?.[1];
  if (!accessToken) return sendOAuthError(reply, config, "Bearer token required");
  let info;
  try {
    info = await config.introspect(accessToken);
  } catch {
    reply.code(503).send({ error: "Authentication endpoint is unavailable" });
    return false;
  }
  const token = validateOAuthToken(info, config);
  if (!token) return sendOAuthError(reply, config, "Invalid OAuth2 token");
  const auth = createOAuthAuthContext({ config, info, accessToken, scopes: token.scopes });
  attachAuthInfo(request, auth);
  return true;
}

function sendOAuthError(reply, config, error) {
  setOAuthChallenge({ set: (...args) => reply.header(...args) }, { resource: config.resource });
  reply.code(401).send({ error });
  return false;
}
