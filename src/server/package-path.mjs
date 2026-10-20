import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

export function findPackagePath({ entrypoint, cwd = process.cwd(), exists = existsSync }) {
  let directory = entrypoint ? dirname(entrypoint) : cwd;
  while (true) {
    const candidate = resolve(directory, "package.json");
    if (exists(candidate)) return candidate;
    const parent = dirname(directory);
    if (parent === directory) return resolve(cwd, "package.json");
    directory = parent;
  }
}
