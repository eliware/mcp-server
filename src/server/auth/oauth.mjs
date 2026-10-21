import { validateOAuthToken } from "../../auth/token-validation.mjs";
import { createOAuthAuthContext } from "../../auth/oauth/context.mjs";
import { setOAuthChallenge } from "../../oauth/metadata.mjs";
import { attachAuthInfo } from "../auth-context.mjs";
import { readBearerToken } from "./bearer-token.mjs";

export async function authenticateOAuthRequest(request, reply, config) {
  const accessToken = readBearerToken(request);
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
