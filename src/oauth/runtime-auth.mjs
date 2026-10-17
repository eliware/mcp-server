import { createOAuthIntrospector } from "../auth/introspection.mjs";

export function resolveRuntimeAuth(auth) {
  return auth?.mode === "oauth2" && !auth.introspect && auth.introspection
    ? {
        ...auth,
        introspect: createOAuthIntrospector({
          resource: auth.resource,
          introspectionEndpoint: auth.introspection.endpoint,
          clientId: auth.introspection.clientId,
          clientSecret: auth.introspection.clientSecret,
          fetchFn: auth.introspection.fetchFn,
        }),
      }
    : auth;
}
