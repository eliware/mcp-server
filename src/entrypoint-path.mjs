import { fileURLToPath } from "node:url";

export function normalizeEntrypoint(entrypoint) {
  if (entrypoint instanceof URL) return fileURLToPath(entrypoint);
  if (typeof entrypoint === "string" && entrypoint.startsWith("file:")) {
    return fileURLToPath(new URL(entrypoint));
  }
  return entrypoint
    ?.replace(/^([A-Za-z]):[\\/]+[A-Za-z]:[\\/]+/i, "$1:\\")
    .replace(/^[\\/](?=[A-Za-z]:)/, "");
}
