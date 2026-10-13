export function convertBigIntToString(value) {
  return convert(value, new WeakSet());
}

function convert(value, ancestors) {
  if (typeof value === "bigint") return value.toString();
  if (!value || typeof value !== "object") return value;
  if (ancestors.has(value)) throw new TypeError("Cannot convert circular data to a response");
  ancestors.add(value);
  const result = Array.isArray(value)
    ? value.map((item) => convert(item, ancestors))
    : Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, convert(item, ancestors)]),
      );
  ancestors.delete(value);
  return result;
}
