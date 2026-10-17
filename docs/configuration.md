# Configuration

Pass one options object to `mcpServer(options)`. The function returns a Fastify app or a stdio result.
Read `src/index.d.ts` for TypeScript types.

## Network options

| Option             | Use                                                                          | Default                |
| ------------------ | ---------------------------------------------------------------------------- | ---------------------- |
| `host`             | Set the network interface.                                                   | `127.0.0.1`            |
| `port`             | Set the TCP listener number. Set `null` to create the app without listening. | `3000`                 |
| `endpointPath`     | Set the MCP route.                                                           | `/mcp`                 |
| `allowedHosts`     | Set host names for DNS rebinding checks.                                     | Localhost rules.       |
| `allowedOrigins`   | Set browser source names for request checks.                                 | Localhost rules.       |
| `fastify`          | Supply a Fastify app.                                                        | A new MCP Fastify app. |
| `configureFastify` | Add routes, hooks, or plugins before MCP setup.                              | No callback.           |

Pass a Fastify app with HTTPS options when TLS is necessary. Add the MCP Fastify adapter's host checks to a custom app when required.

## Tool options

| Option       | Use                                      | Default                         |
| ------------ | ---------------------------------------- | ------------------------------- |
| `entrypoint` | Set the server entry file.               | The running `.mjs` entry file.  |
| `toolsDir`   | Set the folder that contains tool files. | `tools/` beside the entry file. |
| `context`    | Pass values to each tool.                | `{}`                            |
| `name`       | Set MCP server metadata.                 | Package name.                   |
| `version`    | Set MCP server metadata.                 | Package version.                |

When no entry file is available, the server uses its bundled example tool directory.
Each adapter must end in `.mjs` and re-export its matching handler from `src/tools/`.

## Transport options

| Option  | Use                            | Default |
| ------- | ------------------------------ | ------- |
| `stdio` | Use the local stdio transport. | `false` |

The `stdio` option starts stdio and does not start a Fastify listener.
See [transport and protocol behavior](requirements.md) for boundaries.

## Logging

Set `log` to an object with optional `debug`, `info`, `warn`, and `error` functions.
Without a custom logger, the package uses its shared logger. In stdio mode, the default logger writes to stderr.
