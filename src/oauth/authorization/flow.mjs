import { createOAuthAuthorizationUrl } from "./url.mjs";
import { createOAuthAuthorizationParams } from "./params.mjs";
import { exchangeOAuthCode } from "../code-exchange.mjs";

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
