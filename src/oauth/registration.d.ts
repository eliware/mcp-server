export function registerOAuthClient(options: {
  registrationEndpoint: string;
  metadata: Record<string, unknown>;
  fetchFn?: typeof fetch;
}): Promise<Record<string, unknown>>;
