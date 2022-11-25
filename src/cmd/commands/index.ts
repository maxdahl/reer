import { RequestCmd } from "./RequestCmd";
import { ListCmd } from "./ListCmd";

export const commands = {
  get: RequestCmd, // get <url: string>,
  post: RequestCmd, // post <url: string> <body: object>
  put: RequestCmd, // put <url: string> <body: object>
  patch: RequestCmd, // patch <url: string> <body: object>
  delete: RequestCmd, // delete <url: string> <body: object>
  list: ListCmd, // list <requests | req | responses | res> -- lists all previous requests/responses
  // "select", // select <request | req | response | res> <id:number> -- select request/response with <id>
  // "headers", // show headers of selected req/res
  // "cookies", // show cookies of selected req/res
  // "run", // run (<request:string | id:number>) -- specified request again or run last selected
  // "config", // config <get | set> <var:string> (<val: string>) -- get/set config item
};
