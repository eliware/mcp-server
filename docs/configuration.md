# Configuration

Pass one options object to `mcpServer(options)`. The result has a `close()` method for both transports.
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

Pass a Fastify app with HTTPS options when TLS is necessary. The package adds configured host and browser source checks to a supplied app.
When you supply an app without these options, configure host and browser source checks before remote access.

## Tool options

| Option       | Use                                      | Default                            |
| ------------ | ---------------------------------------- | ---------------------------------- |
| `entrypoint` | Set the server entry file.               | The running JavaScript entry file. |
| `toolsDir`   | Set the folder that contains tool files. | `tools/` beside the entry file.    |
| `context`    | Pass values to each tool.                | `{}`                               |
| `name`       | Set MCP server metadata.                 | Consumer package name.             |
| `version`    | Set MCP server metadata.                 | Consumer package version.          |

When no entry file is available, the server uses `tools/` in the current directory.
Each tool module must end in `.mjs` and export a default registration function.
The server reads default metadata from the consumer package manifest.
Set both `name` and `version` when the consumer manifest is not available.

## Transport options

| Option  | Use                            | Default |
| ------- | ------------------------------ | ------- |
| `stdio` | Use the local stdio transport. | `false` |

The `stdio` option starts stdio and does not start a Fastify listener.
See [transport and protocol behavior](requirements.md) for boundaries.

## Logging

Set `log` to an object with optional `debug`, `info`, `warn`, and `error` functions.
Without a custom logger, the package uses its shared logger. In stdio mode, the default logger writes to stderr.
