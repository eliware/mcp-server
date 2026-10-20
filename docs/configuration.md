# Configuration

Pass one options object to `mcpServer(options)`. The result has a `close()` method for both transports.
The package includes TypeScript declarations for the public API.

## Network options

| Option             | Use                                                                          | Default                     |
| ------------------ | ---------------------------------------------------------------------------- | --------------------------- |
| `host`             | Set the network interface.                                                   | `127.0.0.1`                 |
| `port`             | Set the TCP listener number. Set `null` to create the app without listening. | `3000`                      |
| `endpointPath`     | Set the MCP route.                                                           | `/mcp`                      |
| `allowedHosts`     | Set host names for checks on a supplied app.                                 | SDK defaults for a new app. |
| `allowedOrigins`   | Set browser source names for checks on a supplied app.                       | SDK defaults for a new app. |
| `fastify`          | Supply a Fastify app.                                                        | A new MCP Fastify app.      |
| `configureFastify` | Add routes, hooks, or plugins before MCP setup.                              | No callback.                |
| `auth`             | Select request authentication.                                               | `none`                      |
| `log`              | Set the logger for server messages.                                          | The shared logger.          |

Pass a Fastify app with HTTPS options to enable TLS.
The SDK enables host checks and browser source checks for localhost on a new app.
The package adds configured host checks and browser source checks to a supplied app.
Set these options before you expose a supplied app to remote access.
When you set a public network interface, set allowed hosts and authentication.
Set `port: null` when the host application manages the listener.

## Tool options

| Option       | Use                                        | Default                            |
| ------------ | ------------------------------------------ | ---------------------------------- |
| `entrypoint` | Set the server entry file.                 | The running JavaScript entry file. |
| `toolsDir`   | Set the folder that contains tool modules. | `tools/` beside the entry file.    |
| `context`    | Pass values to each tool.                  | `{}`                               |
| `name`       | Set MCP server metadata.                   | Consumer package name.             |
| `version`    | Set MCP server metadata.                   | Consumer package version.          |

When no entry file is available, the server uses `tools/` in the current directory.
The server loads each direct `.mjs` file in that folder as a tool module.
Each tool module must export a default sync or async registration function.
Keep non-tool files outside this folder.
The server reads default metadata from the nearest consumer package manifest.
Set both `name` and `version` when the consumer manifest is not available.

The server throws an error when it cannot read the manifest and `name` or `version` is missing.

## Transport options

| Option  | Use                            | Default |
| ------- | ------------------------------ | ------- |
| `stdio` | Use the local stdio transport. | `false` |

The `stdio` option starts stdio and creates no Fastify app or listener.
See [transport and protocol behavior](requirements.md) for boundaries.

## Logging

Set `log` to an object with optional `debug`, `info`, `warn`, and `error` functions.
Without a custom logger, the package uses its shared logger.
In stdio mode, the default logger writes to stderr to keep protocol output on stdout.

## Startup errors

The server throws an error when it cannot load or add a tool module.
Check the file name, default export, imports, and registration code.
The server also throws an error when it cannot read package metadata and you omit explicit metadata.
