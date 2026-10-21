import { createOAuthClientSetup } from "./client-setup.mjs";
import { createOAuthAuthorizationFlow } from "./authorization/flow.mjs";

export async function createOAuthClient({
  issuer,
  client,
  store,
  pkceStore,
  fetchFn = fetch,
} = {}) {
  const { provider, credentials } = await createOAuthClientSetup({
    issuer,
    client,
    store,
    fetchFn,
  });
  return {
    provider,
    credentials,
    ...createOAuthAuthorizationFlow({ provider, credentials, fetchFn, pkceStore }),
  };
}
