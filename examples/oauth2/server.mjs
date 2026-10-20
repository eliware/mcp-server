import { mcpServer } from "@eliware/mcp-server";
import { createOAuthIntrospector } from "@eliware/mcp-server/oauth";

const issuer = process.env.OAUTH_ISSUER;
const resource = process.env.OAUTH_RESOURCE;
const introspectionEndpoint = process.env.OAUTH_INTROSPECTION_ENDPOINT;
if (!issuer || !resource || !introspectionEndpoint) {
  throw new Error("Set OAUTH_ISSUER, OAUTH_RESOURCE, and OAUTH_INTROSPECTION_ENDPOINT.");
}

await mcpServer({
  auth: {
    mode: "oauth2",
    issuer,
    resource,
    scopes: ["example:read"],
    introspect: createOAuthIntrospector({
      issuer: process.env.OAUTH_ISSUER,
      resource,
      introspectionEndpoint,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    }),
  },
  toolsDir: new URL("../tools/", import.meta.url).pathname,
  port: 1234,
});
