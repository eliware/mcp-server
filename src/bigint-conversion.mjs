import { convert } from "./bigint/converter.mjs";

export function convertBigIntToString(value) {
  return convert(value, new WeakSet());
}
