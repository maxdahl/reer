/*
 * Parse a string and return everything that is a json object
 * '{"foo": "bar"} random text {"foo2": "bar"}' => [{"foo": "bar"}, {"foo2": "bar"}]
 */
export function toJson(str: string) {
  const expr = /(\{[^{}]+:[^{}]+\})/gm;
  const parsed = [];

  let match: RegExpExecArray | null;
  do {
    match = expr.exec(str);
    if (match) {
      try {
        const obj = JSON.parse(match[1]);
        parsed.push(obj);
      } catch (err) {}
    }
  } while (match !== null);

  return parsed;
}
