import type { AuthConfig } from "./auth-config.mjs";

export function requireAuth(extra?: Record<string, unknown>): AuthConfig;
export function getUser(extra: Record<string, unknown>): Record<string, unknown> | null;
export function createOAuthAuthContext(options: {
  config: { mode: string; subjectClaim: string; resource?: string };
  info: Record<string, unknown>;
  accessToken: string;
  scopes: string[];
}): Record<string, unknown>;
