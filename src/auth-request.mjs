import { validStaticToken } from "./auth-static-token.mjs";

export function resolveAuthRequest(config, accessToken) {
  if (config.mode === "static" && !validStaticToken(accessToken, config.token)) {
    return { error: "Invalid bearer token" };
  }
  if (config.mode === "bearer-passthrough" && !accessToken) {
    return { error: "Bearer token required" };
  }
  return { auth: { mode: config.mode, ...(accessToken ? { accessToken } : {}) } };
}
