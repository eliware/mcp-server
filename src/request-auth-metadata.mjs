export function injectRequestAuthMetadata(params, auth) {
  if (!params || typeof params !== "object") return;
  const metadata = { ...params._meta };
  delete metadata.mcpAuth;
  if (auth) metadata.mcpAuth = auth;
  params._meta = metadata;
}
