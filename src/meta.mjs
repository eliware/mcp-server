import fs from "fs";
import { resolve } from "node:path";
import { readPackageMeta } from "./meta/reader.mjs";

export function loadPackageMeta({
  name,
  version,
  log,
  readFile = fs.readFileSync,
  packagePath = resolve(process.cwd(), "package.json"),
}) {
  try {
    const pkg = readPackageMeta({ readFile, packagePath });
    const result = { name: name || pkg.name, version: version || pkg.version };
    if (!result.name || !result.version) throw new Error("Package name and version are required");
    return result;
  } catch (err) {
    if (name && version) return { name, version };
    log?.warn?.("[SERVER] Could not read consumer package metadata:", err?.stack || err);
    throw new Error("Set name and version or provide a readable consumer package.json", {
      cause: err,
    });
  }
}
