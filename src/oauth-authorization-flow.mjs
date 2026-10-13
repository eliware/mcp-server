import { createOAuthAuthorizationUrl } from "./oauth-authorization-url.mjs";
import { createOAuthAuthorizationParams } from "./oauth-authorization-params.mjs";
import { exchangeOAuthCode } from "./oauth-code-exchange.mjs";

export function createOAuthAuthorizationFlow({ provider, credentials, fetchFn = fetch }) {
  return {
    authorizationUrl(options = {}) {
      const authorizationParams = createOAuthAuthorizationParams(options);
      const url = createOAuthAuthorizationUrl({
        provider,
        credentials,
        redirectUri: options.redirectUri,
        scopes: options.scopes,
        authorizationParams,
      });
      return { url, codeVerifier: authorizationParams.codeVerifier };
    },
    exchangeCode(options) {
      return exchangeOAuthCode({ provider, credentials, fetchFn, ...options });
    },
  };
}
