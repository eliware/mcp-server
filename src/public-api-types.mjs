export function missingApiDeclarations(exportNames, declarationText) {
  return exportNames.filter((name) => !new RegExp(`\\b${name}\\b`).test(declarationText));
}
