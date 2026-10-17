import { log as logger } from "@eliware/common";
import { normalizeEntrypoint } from "../entrypoint-path.mjs";
export function normalizeServerConfig(options = {}) {
  const defaultEntrypoint = process.argv[1]?.endsWith(".mjs") ? process.argv[1] : undefined;
  const defaults = {
    log: logger,
    entrypoint: defaultEntrypoint,
    host: "127.0.0.1",
    port: 3000,
    auth: { mode: "none" },
    context: {},
    endpointPath: "/mcp",
    stdio: false,
    fastify: undefined,
    configureFastify: undefined,
  };
  const config = { ...defaults, ...options };
  return { ...config, entrypoint: normalizeEntrypoint(config.entrypoint) };
}
