export function injectRequestAuthMetadata(params, auth) {
  if (!params || typeof params !== "object") return;
  const currentMetadata = params._meta;
  if (
    !auth &&
    (!currentMetadata ||
      typeof currentMetadata !== "object" ||
      !Object.hasOwn(currentMetadata, "mcpAuth"))
  ) {
    return;
  }
  const metadata = { ...currentMetadata };
  delete metadata.mcpAuth;
  if (auth) metadata.mcpAuth = auth;
  params._meta = metadata;
}
