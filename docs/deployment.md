# Deployment

The package starts a Fastify HTTP server or a local stdio server.
The host application owns deployment, network access, secrets, and process supervision.

## Configure the listener

The HTTP server listens on `127.0.0.1:3000` by default.
Set `host` and `port` to match the host environment.
Keep the loopback host when a local proxy accepts public traffic.
Use a public interface only when network rules allow approved clients and the route checks authentication.

Set `endpointPath` when the client requires a route other than `/mcp`.
Set `allowedHosts` and `allowedOrigins` to the names that the deployment accepts.
Read [Fastify customization](fastify.md) to configure TLS or supply a custom app.

## Prevent access without approval

Select an authentication mode for every network endpoint that needs bearer checks.
Use static authentication for one configured token.
Use bearer passthrough only when trusted application code validates each token.
Use OAuth2 introspection when an OAuth provider checks tokens.
Read [authentication](authentication.md) before you expose the route.

Store tokens and OAuth secrets in an environment secret store.
Do not commit secret values or write them to logs.
Use HTTPS for OAuth issuer, introspection, authorization, registration, and token endpoints.
The package does not configure a firewall, proxy, domain, or certificate renewal.

## Stop the server

Call the result's asynchronous `close()` method during graceful shutdown:

```js
const server = await mcpServer({ port: process.env.PORT || 3000 });

process.once("SIGTERM", () => void server.close());
process.once("SIGINT", () => void server.close());
```

Use the same `close()` method for HTTP and stdio results.
The package does not install process signal handlers for the application.

## Run in a container

Use the supplied [container example](../examples/container.mjs) as a starting point.
Copy the application source and production dependencies into the image.
Set the port and required secrets through the deployment environment.
Do not bake secret values into the image.
