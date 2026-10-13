# Troubleshooting

## The client cannot connect

Check that the server process is running and that the client uses the same transport.
For HTTP, check the port and route. The default route is `/mcp`.
For stdio, set `stdio: true` and start the server as a local process.
Do not write application logs to stdout in stdio mode.

## The server finds no tools

Check that each tool file is in the configured tool directory.
Check that each file name ends in `.mjs` and has a default async export.
Set `toolsDir` to the correct directory or set `entrypoint` to the server file.
Read [tools and schemas](tools.md) for a tool example.

## The server rejects a request

Check the `Authorization` header and the selected auth mode.
Static mode needs the configured token. Passthrough mode needs a bearer token.
OAuth2 mode needs a valid active token with the configured issuer, resource, and scopes.
Read [authentication](authentication.md) for mode details.

## HTTPS does not start

Set `httpsPort`, `tls.key`, and `tls.cert`.
You can use `TLS_KEY_FILE` and `TLS_CERT_FILE` to set file paths.
Check that the process can read each file.

## Validate a local change

Install dependencies with `npm ci`. Run `npm test`.
