export function createPkceStore({ save, load, remove } = {}) {
  if (typeof save !== "function" || typeof load !== "function" || typeof remove !== "function")
    throw new Error("PKCE store requires save, load, and remove functions");
  return { save, load, remove };
}

export function createInMemoryPkceStore() {
  const records = new Map();
  return createPkceStore({
    save: async (state, record) => records.set(state, record),
    load: async (state) => records.get(state),
    remove: async (state) => records.delete(state),
  });
}

export async function consumePkceState({ store, state, expectedState } = {}) {
  if (!state || !expectedState || state !== expectedState) throw new Error("Invalid OAuth state");
  const record = await store.load(state);
  if (!record?.verifier) throw new Error("OAuth state expired or unknown");
  await store.remove(state);
  return record;
}
