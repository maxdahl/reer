import { CmdResult } from "core/types";

export interface ICommand {
  execute: (args: string[], cmd: string) => CmdResult;
}
