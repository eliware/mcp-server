import { discoverOAuthProvider } from "./provider-discovery.mjs";
import { resolveOAuthClient } from "../client.mjs";

export async function createOAuthClientSetup({ issuer, client, store, fetchFn }) {
  const provider = await discoverOAuthProvider({ issuer, fetchFn });
  const credentials = await resolveOAuthClient({ client, provider, store });
  return { provider, credentials };
}
