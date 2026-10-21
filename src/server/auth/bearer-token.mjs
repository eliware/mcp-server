import { parseBearerToken } from "../../auth/bearer.mjs";

export function readBearerToken(request) {
  return parseBearerToken(request.headers.authorization);
}
