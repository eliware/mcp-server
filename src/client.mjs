import { resolveDynamicOAuthClient } from "./dynamic-client.mjs";

export async function resolveOAuthClient({ client = {}, provider, store } = {}) {
  if (client.mode === "static") {
    if (!client.clientId) throw new Error("static OAuth client requires clientId");
    return client;
  }
  if (client.mode !== "dynamic") throw new Error("OAuth client mode must be static or dynamic");
  if (!store) throw new Error("dynamic OAuth client requires a client store");
  return resolveDynamicOAuthClient({ client, provider, store });
}
