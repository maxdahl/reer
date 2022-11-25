import { highlight } from "cli-highlight";

export function objectToString(obj: Record<string, any>) {
  return highlight(JSON.stringify(obj, null, 4));
}
