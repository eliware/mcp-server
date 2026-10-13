import type { AuthConfig } from "./auth-config.mjs";

export function requireAuth(extra?: Record<string, unknown>): AuthConfig;
export function requireBearer(extra?: Record<string, unknown>): string;
export function hasScope(extra: Record<string, unknown>, scope: string): boolean;
export function requireScope(extra: Record<string, unknown>, scope: string): void;
export function getUser(extra: Record<string, unknown>): Record<string, unknown> | null;
export function getAccessToken(extra: Record<string, unknown>): string | null;
