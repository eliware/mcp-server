export type AuthMode = "none" | "static" | "bearer-passthrough" | "oauth2";

export interface AuthConfig {
  mode: AuthMode;
  token?: string;
  issuer?: string;
  resource?: string;
  scopes?: string[];
  introspect?: (token: string) => Promise<Record<string, unknown> | null>;
  introspection?: { endpoint: string; clientId?: string; clientSecret?: string };
}

export function normalizeAuth(auth?: AuthMode | AuthConfig | null): AuthConfig;
