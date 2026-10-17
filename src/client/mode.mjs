export function validateOAuthClientMode(client) {
  if (client.mode === "static") {
    if (!client.clientId) throw new Error("static OAuth client requires clientId");
    return;
  }
  if (client.mode !== "dynamic") throw new Error("OAuth client mode must be static or dynamic");
}
