import { CmdResult } from "core/types";

export abstract class Command {
  constructor(protected readonly cmdArguments: string[][]) {}

  protected checkArguments() {
    this.cmdArguments.forEach((args, index) => {
      if (!args.includes(args[index]))
        throw new TypeError(
          `Invalid argument ${args[index]}. Allowed are ${args}`
        );
    });
  }

  abstract execute(args: string[], cmd?: string): CmdResult;
}
