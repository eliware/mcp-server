export function discoverOAuthProvider(options: {
  issuer: string;
  fetchFn?: typeof fetch;
}): Promise<Record<string, unknown>>;
