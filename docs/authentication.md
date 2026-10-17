# Authentication

The server checks authentication on POST requests to the MCP route.
The default mode is `none`. Select a mode before you expose a network endpoint.

## No authentication

Set `auth: { mode: "none" }` for a local environment or one that has protection at a different layer.
This mode does not check bearer tokens.

## Static bearer token

Set `auth: { mode: "static", token: value }` to accept one configured token.
The request must send `Authorization: Bearer <token>`.
The server rejects a missing or invalid token.
Read the token from a secret store or environment variable. Do not put it in source code.

## Bearer passthrough

Set `auth: { mode: "bearer-passthrough" }` to require a bearer token without validating it.
The server passes the token to the tool. Validate it in trusted application code before use.
This mode does not verify the token with an identity provider.

## OAuth2 introspection

Set `auth.mode` to `oauth2`. Set `issuer`, `resource`, and an `introspect` function.
You can use `createOAuthIntrospector()` to call an OAuth2 introspection endpoint.
Set `introspection` with endpoint and client values to create this function from configuration.
The server checks active status, issuer, resource, expiry, bearer token type, and required scopes.

The server returns status 503 when the introspection endpoint is unavailable.

Set `scopes` to require scopes. Set `subjectClaim` to select a subject claim. The default claim is `sub`.

```js
import { mcpServer, createOAuthIntrospector } from "@eliware/mcp-server";

await mcpServer({
  httpPort: 1234,
  auth: {
    mode: "oauth2",
    issuer: process.env.OAUTH_ISSUER,
    resource: process.env.OAUTH_RESOURCE,
    scopes: ["example:read"],
    introspect: createOAuthIntrospector({
      issuer: process.env.OAUTH_ISSUER,
      resource: process.env.OAUTH_RESOURCE,
      introspectionEndpoint: process.env.OAUTH_INTROSPECTION_ENDPOINT,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    }),
  },
});
```

OAuth2 mode serves protected resource metadata.

The package does not provide a user login flow.

## Tool auth helpers

Use `requireAuth`, `requireBearer`, `getAccessToken`, `getUser`, `hasScope`, and `requireScope` in tools.
`requireScope` throws an error when the caller lacks the requested scope.
The `getUser` helper returns the subject, client ID, issuer, and scopes when those values exist.

See the [OAuth2 example](../examples/oauth2/server.mjs) and [passthrough example](../examples/passthrough/server.mjs).
