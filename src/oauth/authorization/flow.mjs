import { createAuthorizationUrlOperation } from "./url-operation.mjs";
import { createCodeExchangeOperation } from "./exchange-code.mjs";

export function createOAuthAuthorizationFlow({ provider, credentials, fetchFn = fetch }) {
  return {
    authorizationUrl: createAuthorizationUrlOperation({ provider, credentials }),
    exchangeCode: createCodeExchangeOperation({ provider, credentials, fetchFn }),
  };
}
