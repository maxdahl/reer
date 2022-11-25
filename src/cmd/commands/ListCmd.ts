import { CmdManager } from "cmd/CmdManager";
import { IReer } from "core/interfaces";
import { Command } from "./Command";

export class ListCmd extends Command {
  constructor(private reerInstance: IReer, private cmdManager: CmdManager) {
    const args = [["req", "requests", "res", "responses"]];

    super(args);
  }

  execute(args: string[]) {
    this.checkArguments(args);

    if (["requests", "req"].includes(args[0])) {
      const reqList = this.reerInstance.getRequestManager().getRequests();
      const output = [];

      reqList.forEach((req, index) => {
        const reqOutput = [
          `${req.route.method.toUpperCase()} ${req.route.url}`,
          `${req.status}`,
          req.request.getHeaders(),
          req.route.data,
        ];

        output.push(reqOutput);
      });

      return output;
    }

    return [];
  }
}
