import { highlight } from "cli-highlight";

export function objectToHighlightedString(obj: Record<string, any>) {
  return highlight(JSON.stringify(obj, null, 4));
}
