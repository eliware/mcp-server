import { setOAuthChallenge } from "../../oauth/metadata.mjs";

export function sendOAuthError(reply, config, error) {
  setOAuthChallenge({ set: (...args) => reply.header(...args) }, { resource: config.resource });
  reply.code(401).send({ error });
  return false;
}
