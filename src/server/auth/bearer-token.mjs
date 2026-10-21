export function readBearerToken(request) {
  return /^Bearer\s+(.+)$/i.exec(request.headers.authorization || "")?.[1];
}
