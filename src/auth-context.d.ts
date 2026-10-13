import type { AuthConfig } from "./auth-config.mjs";

export function requireAuth(extra?: Record<string, unknown>): AuthConfig;
export function getUser(extra: Record<string, unknown>): Record<string, unknown> | null;
