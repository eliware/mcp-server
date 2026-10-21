export function normalizeToolsDir(toolsDir) {
  const drivePath = toolsDir.replaceAll("C:\\C:\\", "C:\\");
  return drivePath.replace(/^[\\/](?=[A-Za-z]:)/, "");
}
