export function createOAuthClient(options: {
  issuer: string;
  client: Record<string, unknown>;
  store?: Record<string, Function>;
  fetchFn?: typeof fetch;
}): Promise<{
  provider: Record<string, unknown>;
  credentials: Record<string, unknown>;
  authorizationUrl(options?: {
    redirectUri?: string;
    scopes?: string[];
    state?: string;
    codeVerifier?: string;
  }): { url: string; codeVerifier: string };
  exchangeCode(options: {
    code: string;
    redirectUri: string;
    codeVerifier: string;
  }): Promise<Record<string, unknown>>;
}>;
