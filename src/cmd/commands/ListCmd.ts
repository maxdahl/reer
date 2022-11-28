import { CmdManager } from "cmd/CmdManager";
import { ICommand } from "cmd/interfaces";
import { IReer } from "core/interfaces";

export class ListCmd implements ICommand {
  constructor(private reerInstance: IReer, private cmdManager: CmdManager) {}

  execute(args: string[]) {
    if (["requests", "req"].includes(args[0])) {
      const reqList = this.reerInstance.getRequestManager().getRequests();
      const output = [];

      reqList.forEach((req) => {
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
