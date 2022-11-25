import { Printable } from "./types";

export function print(data: Printable, fn = console.log) {
  if (data.toString) {
    fn(data.toString());
  } else if (Array.isArray(data)) {
    data.forEach((d) => print(d));
  } else {
    fn(data);
  }
}
