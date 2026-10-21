# Migration to version 15

Version 15 keeps the current server options and tool registration pattern.
Check the OAuth callback and custom PKCE store contract before you deploy this version.

## Install the package

Run this command to install version 15:

```sh
npm install @eliware/mcp-server@15
```

## Update OAuth callbacks

Await `authorizationUrl` and save its `state` value in the user session.
Send the callback state and the saved session state to `exchangeCode`.
The client rejects missing or mismatched state before it sends a token request.
The client stores and consumes each PKCE verifier with its state.

```js
const authorization = await client.authorizationUrl({ redirectUri, scopes });
session.expectedOAuthState = authorization.state;
redirect(authorization.url);

const tokens = await client.exchangeCode({
  code: callback.code,
  redirectUri,
  state: callback.state,
  expectedState: session.expectedOAuthState,
});
```

## Update custom PKCE stores

Provide `save` and `consume` methods when you set `pkceStore`.
Make `consume(state)` return and remove the matching record as one atomic action.
Use shared storage with atomic consumption when requests can run in multiple processes.
Do not use separate calls to read and delete a record.

## Keep existing server setup

Existing Fastify, stdio, tool, and server configuration does not require changes for this migration.
Skip the OAuth steps when your application does not use OAuth client helpers.

Read the [API reference](api.md) and [authentication guide](authentication.md) for complete details.
