import fs from "node:fs";
import { normalizeToolsDir } from "./directory-path.mjs";

export function discoverTools({ toolsDir, readDir = fs.readdirSync, toolCache = new Map() }) {
  const resolvedToolsDir = normalizeToolsDir(toolsDir);
  const tools = readDir(resolvedToolsDir)
    .filter((file) => file.endsWith(".mjs"))
    .map((file) => ({ file, toolName: file.replace(/\.mjs$/, "") }));
  toolCache.set(resolvedToolsDir, tools);
  return { resolvedToolsDir, tools };
}
