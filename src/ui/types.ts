export type Printable =
  | string
  | number
  | boolean
  | Array<Printable>
  | { toString: () => string };
