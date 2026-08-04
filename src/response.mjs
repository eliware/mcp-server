export function convertBigIntToString(value) {
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return value.map(convertBigIntToString);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, convertBigIntToString(item)]));
  return value;
}

export function buildResponse(data) {
  return { content: [{ type: 'text', text: JSON.stringify(convertBigIntToString(data), null, 2) }] };
}
