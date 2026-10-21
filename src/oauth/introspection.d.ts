export function createOAuthIntrospector(options: {
  resource?: string;
  introspectionEndpoint: string;
  clientId?: string;
  clientSecret?: string;
  fetchFn?: typeof fetch;
}): (token: string) => Promise<Record<string, unknown> | null>;
