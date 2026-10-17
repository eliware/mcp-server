import { resolveDynamicOAuthClient } from "./dynamic-client.mjs";
import { validateOAuthClientMode } from "./client/mode.mjs";

export async function resolveOAuthClient({ client = {}, provider, store } = {}) {
  validateOAuthClientMode(client);
  if (client.mode === "static") return client;
  if (!store) throw new Error("dynamic OAuth client requires a client store");
  return resolveDynamicOAuthClient({ client, provider, store });
}
