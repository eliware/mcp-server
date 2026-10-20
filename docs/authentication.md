# Authentication

The server checks authentication on requests to the MCP route.
The default mode is `none`. Select a mode before you expose a network endpoint.

## No authentication

Set `auth: { mode: "none" }` to select no authentication explicitly.
Use this mode for remote access only when a trusted firewall or proxy protects the route.
This mode does not check bearer tokens.

## Static bearer token

Set `auth: { mode: "static", token: value }` to accept one configured token.
The request must send `Authorization: Bearer <token>`.
The server rejects a missing or invalid token with status 401.
Read the token from a secret store or environment variable. Do not put it in source code.

## Bearer passthrough

Set `auth: { mode: "bearer-passthrough" }` to require a bearer token without validating it.
The server passes the token and auth mode to the tool.
Validate the token in trusted application code before you use it.
The server rejects a missing token with status 401.

## OAuth2 introspection

Set `auth.mode` to `oauth2`.
Use HTTPS for the issuer, introspection, authorization, registration, and token endpoints.
The OAuth helpers reject other schemes before they send tokens, codes, or client data.

Set `issuer` and `resource`.
Pass an `introspect` function or set `introspection.endpoint`.
The `introspection` option also accepts `clientId`, `clientSecret`, and `fetchFn` values.
Use `createOAuthIntrospector()` to build the function.
The server checks the token's active status, issuer, resource, expiry, type, and required scopes.
Set `scopes` or `requiredScopes` to require token scopes.

Set `subjectClaim` to select the user claim. The default claim is `sub`.
The server returns status 401 when a token is missing or invalid.
The server returns status 503 when the introspection request fails with a network error.

```js
import { mcpServer } from "@eliware/mcp-server";
import { createOAuthIntrospector } from "@eliware/mcp-server/oauth";

await mcpServer({
  port: 1234,
  auth: {
    mode: "oauth2",
    issuer: process.env.OAUTH_ISSUER,
    resource: process.env.OAUTH_RESOURCE,
    scopes: ["example:read"],
    introspect: createOAuthIntrospector({
      resource: process.env.OAUTH_RESOURCE,
      introspectionEndpoint: process.env.OAUTH_INTROSPECTION_ENDPOINT,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    }),
  },
});
```

OAuth2 mode serves protected resource metadata at these routes:

- `/.well-known/oauth-protected-resource`
- `/.well-known/oauth-protected-resource/mcp`

The package does not provide a user login flow or an authorization server.

## Tool auth helpers

Use `requireAuth`, `requireBearer`, `getAccessToken`, `getUser`, `hasScope`, and `requireScope` in tools.
The helpers read verified auth data from `extra.mcpAuth` or `extra._meta.mcpAuth`.
The `getUser` helper returns the subject, client ID, issuer, and scopes when those values exist.
The `requireScope` helper throws an error with status 403 when the caller lacks the scope.

Pass the MCP handler's `extra` argument to these helpers:

```js
import { getUser, requireScope } from "@eliware/mcp-server";

async function readPrivateData(input, extra) {
  requireScope(extra, "example:read");
  return getUser(extra);
}
```

Do not trust claims from an unverified bearer passthrough token.

See the [OAuth2 example](../examples/oauth2/server.mjs) and [passthrough example](../examples/passthrough/server.mjs).
