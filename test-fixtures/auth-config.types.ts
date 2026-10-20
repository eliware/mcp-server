import type { AuthConfig } from "../src/index.js";
import type { createOAuthIntrospector } from "../src/oauth/public-api.js";

export const oauthConfig: AuthConfig = {
  mode: "oauth2",
  issuer: "https://issuer.test",
  resource: "https://resource.test",
  requiredScopes: ["read"],
  subjectClaim: "username",
  introspection: {
    endpoint: "https://issuer.test/introspect",
    clientId: "client",
    clientSecret: "secret",
    fetchFn: fetch,
  },
};

export const introspectorOptions: Parameters<typeof createOAuthIntrospector>[0] = {
  resource: "https://resource.test",
  introspectionEndpoint: "https://issuer.test/introspect",
};
