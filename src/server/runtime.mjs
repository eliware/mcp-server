import { dirname, resolve } from "node:path";
import { path } from "@eliware/common";
import { stderrLogger } from "../logger.mjs";
import { normalizeToolsDir } from "../tool/discovery.mjs";

export function resolveServerRuntime({ config, options = {} }) {
  const toolsDir = normalizeToolsDir(
    options.toolsDir ||
      (config.entrypoint
        ? resolve(dirname(config.entrypoint), "tools")
        : path(import.meta, "..", "..", "examples", "tools")),
  );
  const activeLog = config.stdio && !options.log ? stderrLogger : config.log;
  return { toolsDir, activeLog };
}
