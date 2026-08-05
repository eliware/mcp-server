import { mcpServer } from '@eliware/mcp-server';
import { createOAuthIntrospector } from '@eliware/mcp-server';

await mcpServer({
  auth: {
    mode: 'oauth2',
    issuer: process.env.OAUTH_ISSUER,
    resource: process.env.OAUTH_RESOURCE,
    scopes: ['example:read'],
    introspect: createOAuthIntrospector({
      issuer: process.env.OAUTH_ISSUER,
      resource: process.env.OAUTH_RESOURCE,
      introspectionEndpoint: process.env.OAUTH_INTROSPECTION_ENDPOINT,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    }),
  },
  toolsDir: new URL('../tools/', import.meta.url).pathname,
  httpPort: 1234,
});
