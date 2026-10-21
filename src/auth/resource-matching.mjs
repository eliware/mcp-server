export function matchesResource(info, resource) {
  if (info?.resource === resource) return true;
  return Array.isArray(info?.aud) ? info.aud.includes(resource) : info?.aud === resource;
}
