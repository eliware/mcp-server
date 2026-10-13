import { normalizeServerConfig } from "./server-config.mjs";
import { resolveServerRuntime } from "./server-runtime.mjs";

export function resolveServerOptions(options = {}) {
  const config = normalizeServerConfig(options);
  return { config, ...resolveServerRuntime({ config, options }) };
}
