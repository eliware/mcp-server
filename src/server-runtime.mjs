import { dirname, resolve } from "node:path";
import { path } from "@eliware/common";
import { stderrLogger } from "./server-http.mjs";
import { normalizeToolsDir } from "./tools.mjs";

export function resolveServerRuntime({ config, options = {} }) {
  const toolsDir = normalizeToolsDir(
    options.toolsDir ||
      (config.entrypoint
        ? resolve(dirname(config.entrypoint), "tools")
        : path(import.meta, "..", "examples", "tools")),
  );
  const activeLog = config.stdio && !options.log ? stderrLogger : config.log;
  return { toolsDir, activeLog };
}
