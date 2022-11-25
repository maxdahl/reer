import { commands } from "./commands";
import { IReer } from "core/interfaces";

export class CmdManager {
  private static instance: CmdManager;

  static getInstance() {
    if (!CmdManager.instance) CmdManager.instance = new CmdManager();

    return CmdManager.instance;
  }

  private reerInstance: IReer;
  private cmdState: Record<string, any>;

  private constructor() {}

  hasCmd(commandString: string) {
    const [cmd] = commandString.split(" ");
    return commands[cmd] !== undefined;
  }

  setReerInstance(instance: IReer) {
    this.reerInstance = instance;
  }

  setCmdState(cmd: string, status: any) {
    this.cmdState[cmd] = status;
  }

  getCmdState(cmd: string) {
    return this.cmdState[cmd];
  }

  run(commandString: string) {
    const [cmd, ...args] = commandString.toLowerCase().split(" ");
    if (!commands[cmd]) throw new TypeError(`Invalid command ${cmd}`);

    const command = new commands[cmd](this.reerInstance, this);
    return command.execute(args, cmd);
  }
}
