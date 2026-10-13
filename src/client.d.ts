export function resolveOAuthClient(options: {
  client: Record<string, unknown>;
  provider: Record<string, unknown>;
  store?: Record<string, Function>;
}): Promise<Record<string, unknown>>;
