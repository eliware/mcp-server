import { withCycleCheck } from "./cycle-check.mjs";

export function convert(value, ancestors) {
  if (typeof value === "bigint") return value.toString();
  if (!value || typeof value !== "object") return value;
  return withCycleCheck(value, ancestors, () => {
    if (Array.isArray(value)) return value.map((item) => convert(item, ancestors));
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, convert(item, ancestors)]),
    );
  });
}
