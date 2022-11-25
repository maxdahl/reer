import { CmdManager } from "cmd/CmdManager";
import { ICommand } from "cmd/interfaces";
import { IReer } from "core/interfaces";
import * as str from "utils/string";

export class RequestCmd implements ICommand {
  private args: string[] = [];
  constructor(private reerInstance: IReer, private cmdManager: CmdManager) {}

  private parseJSONBody(argStr: string) {
    const parsed = str.toJson(argStr);
    if (parsed.length > 0) return parsed[0];

    return {};
  }

  private get() {
    const [url] = this.args;

    const response = this.reerInstance.runRoute({ url });

    return response;
  }

  private post(method = "post") {
    const [url, ...data] = this.args;
    if (!data) throw new Error("Missing body");

    const response = this.reerInstance.runRoute({
      url,
      data: this.parseJSONBody(data.join("")),
      method: method,
    });

    return response;
  }

  execute(args: string[], cmd: string) {
    this.args = args;

    if (cmd === "get") {
      return this.get();
    }

    return this.post(cmd);
  }
}
