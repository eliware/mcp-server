import { discoverOAuthProvider } from "../oauth.mjs";
import { resolveOAuthClient } from "../client.mjs";
import { createOAuthAuthorizationFlow } from "./authorization/flow.mjs";

export async function createOAuthClient({ issuer, client, store, fetchFn = fetch } = {}) {
  const provider = await discoverOAuthProvider({ issuer, fetchFn });
  const credentials = await resolveOAuthClient({ client, provider, store });
  return {
    provider,
    credentials,
    ...createOAuthAuthorizationFlow({ provider, credentials, fetchFn }),
  };
}
