# Configuration

Pass one options object to `mcpServer(options)`. The server returns its Express app, active server instances, MCP server, and transport.
Read `src/index.d.ts` for TypeScript types.

## Network options

| Option           | Use                                                       | Default                                         |
| ---------------- | --------------------------------------------------------- | ----------------------------------------------- |
| `httpPort`       | Set the HTTP port. Set `null` or `false` to disable HTTP. | The operating system selects an available port. |
| `httpsPort`      | Set the HTTPS port.                                       | Disabled.                                       |
| `httpRedirect`   | Redirect HTTP requests to HTTPS.                          | `false`                                         |
| `endpointPath`   | Set the MCP route.                                        | `/mcp`                                          |
| `allowedOrigins` | Set allowed CORS origins.                                 | `[]`                                            |
| `app`            | Supply an Express app.                                    | A new app.                                      |
| `configureApp`   | Add middleware before the MCP route.                      | No callback.                                    |

HTTPS needs a key and a certificate. Set `tls.key` and `tls.cert` to values or file paths.
Set `tls.ca` or `tls.caFile` when the server needs a certificate authority file.
You can set `TLS_KEY_FILE`, `TLS_CERT_FILE`, and `TLS_CA_FILE` as environment variables.

## Tool options

| Option       | Use                                      | Default                         |
| ------------ | ---------------------------------------- | ------------------------------- |
| `entrypoint` | Set the server entry file.               | The running `.mjs` entry file.  |
| `toolsDir`   | Set the folder that contains tool files. | `tools/` beside the entry file. |
| `context`    | Pass values to each tool.                | `{}`                            |
| `name`       | Set MCP server metadata.                 | Package name.                   |
| `version`    | Set MCP server metadata.                 | Package version.                |

The server uses bundled example tools if it cannot find an entry file.
Each tool file must end in `.mjs` and export a default async registration function.

## Transport options

| Option               | Use                            | Default |
| -------------------- | ------------------------------ | ------- |
| `stdio`              | Use the local stdio transport. | `false` |
| `stateless`          | Use stateless Streamable HTTP. | `true`  |
| `enableJsonResponse` | Enable JSON responses.         | `true`  |

The `stdio` option starts the stdio transport and does not start HTTP or HTTPS listeners.
See [transport and protocol behavior](requirements.md) for boundaries.

## Logging

Set `log` to an object with optional `debug`, `info`, `warn`, and `error` functions.
Without a custom logger, the package uses its shared logger. In stdio mode, the default logger writes to stderr.
