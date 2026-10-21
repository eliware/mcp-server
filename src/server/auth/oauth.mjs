import { validateOAuthToken } from "../../auth/token-validation.mjs";
import { createOAuthAuthContext } from "../../auth/oauth/context.mjs";
import { attachAuthInfo } from "../auth-context.mjs";
import { readBearerToken } from "./bearer-token.mjs";
import { sendOAuthError } from "./oauth-error.mjs";

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
