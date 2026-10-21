import { resolveAuthRequest } from "../../auth/request.mjs";
import { attachAuthInfo } from "../auth-context.mjs";
import { readBearerToken } from "./bearer-token.mjs";

export function authenticateBearerRequest(request, reply, config) {
  const result = resolveAuthRequest(config, readBearerToken(request));
  if (result.error) {
    reply.code(401).send({ error: result.error });
    return false;
  }
  attachAuthInfo(request, result.auth);
  return true;
}
