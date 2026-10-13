import fs from "node:fs";

export function normalizeToolsDir(toolsDir) {
  const drivePath = toolsDir.replaceAll("C:\\C:\\", "C:\\");
  return drivePath.replace(/^[\\/](?=[A-Za-z]:)/, "");
}

export function discoverTools({ toolsDir, readDir = fs.readdirSync, toolCache = new Map() }) {
  const resolvedToolsDir = normalizeToolsDir(toolsDir);
  let tools = toolCache.get(resolvedToolsDir);
  if (!tools) {
    tools = readDir(resolvedToolsDir)
      .filter((file) => file.endsWith(".mjs"))
      .map((file) => ({ file, toolName: file.replace(/\.mjs$/, "") }));
    toolCache.set(resolvedToolsDir, tools);
  }
  return { resolvedToolsDir, tools };
}
