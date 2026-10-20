import { dirname, resolve } from "node:path";
import { stderrLogger } from "../logger.mjs";
import { normalizeToolsDir } from "../tool/discovery.mjs";
import { findPackagePath } from "./package-path.mjs";

export function resolveServerRuntime({ config, options = {} }) {
  const toolsDir = normalizeToolsDir(
    options.toolsDir ||
      (config.entrypoint
        ? resolve(dirname(config.entrypoint), "tools")
        : resolve(process.cwd(), "tools")),
  );
  const packagePath = options.packagePath || findPackagePath({ entrypoint: config.entrypoint });
  const activeLog = config.stdio && !options.log ? stderrLogger : config.log;
  return { toolsDir, packagePath, activeLog };
}
