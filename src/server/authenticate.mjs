import { normalizeAuth } from "../auth/config.mjs";
import { authenticateBearerRequest } from "./auth/bearer.mjs";
import { authenticateOAuthRequest } from "./auth/oauth.mjs";

export async function authenticateRequest(request, reply, auth) {
  const config = normalizeAuth(auth);
  if (config.mode === "none") {
    return true;
  }
  if (config.mode === "oauth2") {
    return authenticateOAuthRequest(request, reply, config);
  }
  return authenticateBearerRequest(request, reply, config);
}
