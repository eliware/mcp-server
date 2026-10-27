export function readPackageMeta({ readFile, packagePath }) {
  return JSON.parse(readFile(packagePath, "utf8"));
}
