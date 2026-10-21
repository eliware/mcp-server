export function createPkceStore(options: { save: Function; load: Function; remove: Function }): {
  save: Function;
  load: Function;
  remove: Function;
};
export function createInMemoryPkceStore(): {
  save: (state: string, record: Record<string, unknown>) => Promise<void>;
  load: (state: string) => Promise<Record<string, unknown> | undefined>;
  remove: (state: string) => Promise<boolean>;
};
export function consumePkceState(options: {
  store: Record<string, Function>;
  state: string;
  expectedState: string;
}): Promise<Record<string, unknown>>;
