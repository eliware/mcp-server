export function createOAuthAuthContext(options: {
  config: { mode: string; subjectClaim: string; resource?: string };
  info: Record<string, unknown>;
  accessToken: string;
  scopes: string[];
}): Record<string, unknown>;
