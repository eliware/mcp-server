import { createOAuthAuthorizationUrl } from "./url.mjs";
import { createOAuthAuthorizationParams } from "./params.mjs";

export function createAuthorizationUrlOperation({ provider, credentials }) {
  return function authorizationUrl(options = {}) {
    const authorizationParams = createOAuthAuthorizationParams(options);
    const url = createOAuthAuthorizationUrl({
      provider,
      credentials,
      redirectUri: options.redirectUri,
      scopes: options.scopes,
      authorizationParams,
    });
    return { url, codeVerifier: authorizationParams.codeVerifier };
  };
}
