import { fileURLToPath } from "node:url";

export function normalizeEntrypoint(entrypoint) {
  if (entrypoint instanceof URL) return fileURLToPath(entrypoint);
  return entrypoint
    ?.replace(/^([A-Za-z]):[\\/]+[A-Za-z]:[\\/]+/i, "$1:\\")
    .replace(/^[\\/](?=[A-Za-z]:)/, "");
}
