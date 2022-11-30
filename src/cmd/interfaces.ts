import { Printable } from "ui/types";

export interface ICommand {
  execute: (args: string[], cmd: string) => Printable;
}
