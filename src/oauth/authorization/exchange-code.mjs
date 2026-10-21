import { exchangeOAuthCode } from "../code-exchange.mjs";

export function createCodeExchangeOperation({ provider, credentials, fetchFn = fetch }) {
  return function exchangeCode(options) {
    return exchangeOAuthCode({ provider, credentials, fetchFn, ...options });
  };
}
