import { IHttpResponse } from "http/interfaces";
import { RequestCollection, ResponseCollection, RouteConfig } from "./types";

export interface IRequestManager {
  getRequests: () => RequestCollection;
  getResponses: () => ResponseCollection;
  makeRequest: (routeConfig: RouteConfig) => Promise<IHttpResponse>;
}

export interface IReer {
  executeCmd: (cmd: string) => Promise<string>;
  runRoute: (
    route: { file: string; name: string } | RouteConfig
  ) => Promise<IHttpResponse>;
  getRequestManager: () => IRequestManager;
}

export interface IApp {
  run: () => void;
}
