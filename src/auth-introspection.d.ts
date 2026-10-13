export function createOAuthIntrospector(options: {
  issuer?: string;
  resource?: string;
  introspectionEndpoint: string;
  clientId?: string;
  clientSecret?: string;
  fetchFn?: typeof fetch;
}): (token: string) => Promise<Record<string, unknown> | null>;
