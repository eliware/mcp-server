export function createClientStore({ load, save, remove } = {}) {
  if (typeof load !== "function" || typeof save !== "function")
    throw new Error("OAuth client store requires load and save functions");
  return { load, save, remove: remove || (async () => undefined) };
}
