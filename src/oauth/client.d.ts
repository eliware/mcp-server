export function createOAuthClient(options: {
  issuer: string;
  client: Record<string, unknown>;
  store?: Record<string, Function>;
  pkceStore?: {
    save(state: string, record: { verifier: string; sessionState: string }): void | Promise<void>;
    consume(
      state: string,
      expectedState: string,
    ):
      | { verifier: string; sessionState: string }
      | null
      | undefined
      | Promise<{ verifier: string; sessionState: string } | null | undefined>;
  };
  fetchFn?: typeof fetch;
}): Promise<{
  provider: Record<string, unknown>;
  credentials: Record<string, unknown>;
  authorizationUrl(options: {
    redirectUri?: string;
    scopes?: string[];
    state?: string;
    codeVerifier?: string;
    sessionState: string;
  }): Promise<{ url: string; state: string }>;
  exchangeCode(options: {
    code: string;
    redirectUri: string;
    state: string;
    expectedState: string;
  }): Promise<Record<string, unknown>>;
}>;
