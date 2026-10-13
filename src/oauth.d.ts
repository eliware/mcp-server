export function discoverOAuthProvider(options: {
  issuer: string;
  fetchFn?: typeof fetch;
}): Promise<Record<string, unknown>>;
export function registerOAuthClient(options: {
  registrationEndpoint: string;
  metadata: Record<string, unknown>;
  fetchFn?: typeof fetch;
}): Promise<Record<string, unknown>>;
export function createClientStore(options: { load: Function; save: Function; remove?: Function }): {
  load: Function;
  save: Function;
  remove: Function;
};
