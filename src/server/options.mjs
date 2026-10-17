import { normalizeServerConfig } from "./config.mjs";
import { resolveServerRuntime } from "./runtime.mjs";

export function resolveServerOptions(options = {}) {
  const config = normalizeServerConfig(options);
  return { config, ...resolveServerRuntime({ config, options }) };
}
