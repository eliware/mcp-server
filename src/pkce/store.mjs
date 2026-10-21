export function createPkceStore({ save, consume } = {}) {
  if (typeof save !== "function" || typeof consume !== "function")
    throw new Error("PKCE store requires save and consume functions");
  return { save, consume };
}

export function createInMemoryPkceStore() {
  const records = new Map();
  return createPkceStore({
    save: async (state, record) => records.set(state, record),
    consume: (state) => {
      const record = records.get(state);
      records.delete(state);
      return record;
    },
  });
}

export async function consumePkceState({ store, state, expectedState } = {}) {
  if (!state || !expectedState) throw new Error("Invalid OAuth state");
  const record = await store.consume(state);
  if (!record?.verifier || !record.sessionState) throw new Error("OAuth state expired or unknown");
  if (record.sessionState !== expectedState) throw new Error("Invalid OAuth state");
  return record;
}
