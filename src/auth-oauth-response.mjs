import { setOAuthChallenge } from "./oauth-metadata.mjs";

export function sendOAuthAuthError(res, { error, resource }) {
  if (resource) setOAuthChallenge(res, { resource });
  return res.status(401).json({ error });
}
