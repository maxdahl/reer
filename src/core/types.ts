import { IHttpRequest, IHttpResponse } from "http/interfaces";
import { RequestConfig } from "http/types";

export type RequestCollection = {
  status: string;
  route: RouteConfig;
  request: IHttpRequest;
}[];

export type ResponseCollection = {
  response: IHttpResponse;
}[];

export type RouteConfig = RequestConfig & {
  name?: string;
  before?: string | string[];
  after?: string | string[];
  ignoreBaseUrl?: boolean;
};

export interface AppArgument {
  file: string;
  route: string;
}
