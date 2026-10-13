import { convertBigIntToString } from "./bigint-conversion.mjs";

export function buildResponse(data) {
  return {
    content: [{ type: "text", text: JSON.stringify(convertBigIntToString(data), null, 2) }],
  };
}
