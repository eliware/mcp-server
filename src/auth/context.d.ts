import type { AuthConfig } from "./config.mjs";

export function requireAuth(extra?: Record<string, unknown>): AuthConfig;
export function getUser(extra: Record<string, unknown>): Record<string, unknown> | null;
export function getAuthContext(extra?: Record<string, unknown>): AuthConfig | undefined;
