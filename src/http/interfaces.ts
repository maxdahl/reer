import { AxiosResponse } from "axios";
import { ResponseHeaders } from "./types";

export interface ICookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;

  toString: () => string;
}

export interface IHttpResponse {
  readonly request: IHttpRequest;
  readonly axiosResponse: AxiosResponse;
  readonly cookies: Record<string, ICookie>;
  readonly headers: ResponseHeaders;
  readonly data: any;
  readonly status: number;
  readonly statusText: string;

  getDataString: () => string;
  toString: () => string;
}

export interface IHttpRequest {
  setHeader: (name: string, value: string) => void;
  getHeader: (name: string) => string;
  getHeaders: () => Record<string, string>;

  setCookie: (name: string, value: string) => void;
  getCookie: (name: string) => ICookie;
  getCookies: () => Record<string, ICookie>;

  execute: () => Promise<IHttpResponse>;
}
