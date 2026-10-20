export function assertHttpsOAuthEndpoint(value, name) {
  let endpoint;
  try {
    endpoint = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid HTTPS URL`);
  }
  if (endpoint.protocol !== "https:") throw new Error(`${name} must use HTTPS`);
  if (endpoint.username || endpoint.password) {
    throw new Error(`${name} must not contain embedded credentials`);
  }
  return value;
}
