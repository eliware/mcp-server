import { createOAuthAuthorizationUrl } from "./oauth-authorization-url.mjs";
import { exchangeOAuthCode } from "./oauth-code-exchange.mjs";

export function createOAuthAuthorizationFlow({ provider, credentials, fetchFn = fetch }) {
  return {
    authorizationUrl(options = {}) {
      return createOAuthAuthorizationUrl({ provider, credentials, ...options });
    },
    exchangeCode(options) {
      return exchangeOAuthCode({ provider, credentials, fetchFn, ...options });
    },
  };
}
