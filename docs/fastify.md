# Fastify customization

The package uses Fastify for Streamable HTTP. Use `configureFastify` for routes, hooks, or plugins.
Use the `fastify` option when the application must create or configure the Fastify instance itself.

## Add application routes

The package calls `configureFastify` before it adds the MCP route and authentication hooks.
Add application routes in that callback:

```js
await mcpServer({
  configureFastify(app) {
    app.get("/health", async () => ({ status: "ok" }));
  },
});
```

The package applies MCP authentication to the configured MCP route.
The package does not apply that authentication to application routes such as `/health`.
Add access control to each application route that needs it.

## Supply a Fastify instance

Install `fastify` in the application when it imports Fastify directly.
Pass the instance with `fastify`:

```js
import Fastify from "fastify";
import { mcpServer } from "@eliware/mcp-server";

const app = Fastify();
const server = await mcpServer({ fastify: app, port: 1234 });
```

The package adds its routes and hooks to the supplied instance.
It starts the listener when `port` is a number or string.
Set `port: null` when the host application starts the listener.
The result includes the Fastify instance and an asynchronous `close()` method.

## Configure TLS

Create a Fastify instance with HTTPS options before you pass it to the package.
Read certificate files from approved paths or a secret store:

```js
import { readFileSync } from "node:fs";
import Fastify from "fastify";
import { mcpServer } from "@eliware/mcp-server";

const app = Fastify({
  https: {
    key: readFileSync(process.env.TLS_KEY_FILE),
    cert: readFileSync(process.env.TLS_CERT_FILE),
  },
});

await mcpServer({ fastify: app, port: 1234 });
```

Set both file paths before startup. The package does not load TLS files or replace certificates.

## Configure host and source checks

Set `allowedHosts` and `allowedOrigins` when the application supplies its own Fastify instance.
The package adds checks for those values before the MCP route handles a request.
For a package-created instance, pass these values to the package options.
Keep the allowed values approved for the application deployment.

See [configuration](configuration.md) for all Fastify-related options.
