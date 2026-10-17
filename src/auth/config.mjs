import { normalizeOAuthAuth } from "../oauth/auth-config.mjs";

const MODES = new Set(["none", "static", "bearer-passthrough", "oauth2"]);

export function normalizeAuth(auth = { mode: "none" }) {
  const config = typeof auth === "string" ? { mode: auth } : auth || {};
  const mode = config.mode || "none";
  if (!MODES.has(mode)) throw new Error(`Unsupported auth mode: ${mode}`);
  if (mode === "static" && !config.token) throw new Error("static auth requires auth.token");
  if (mode !== "oauth2") return { ...config, mode };
  return normalizeOAuthAuth(config);
}
