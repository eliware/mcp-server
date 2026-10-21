export function createPkceStore(options: { save: Function; consume: Function }): {
  save: Function;
  consume: Function;
};
export function createInMemoryPkceStore(): {
  save: (state: string, record: Record<string, unknown>) => Promise<void>;
  consume: (state: string) => Record<string, unknown> | undefined;
};
export function consumePkceState(options: {
  store: Record<string, Function>;
  state: string;
  expectedState: string;
}): Promise<Record<string, unknown>>;
