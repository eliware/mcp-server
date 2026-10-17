# Troubleshooting

## The client cannot connect

Check that the server process is running and that the client uses the same transport.
For HTTP, check the host, network number, and route. The default route is `/mcp`.
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
Check that the client uses protocol revision `2026-07-28` and sends the required request envelope.
Read [authentication](authentication.md) for mode details.

## Fastify does not start

Check that the network number is available. Check that the process can use the selected host.
Set `port: null` to create the app without starting a listener.

## Validate a local change

Install dependencies with `npm ci`. Run `eliware-test`.
