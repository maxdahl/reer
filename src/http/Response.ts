import { AxiosResponse } from "axios";
import highlight from "cli-highlight";
import { objectToHighlightedString } from "../utils/formatting";
import { Cookie } from "./Cookie";
import { HttpCookieManager } from "./CookieManager";
import { IHttpRequest, IHttpResponse, ICookie } from "./interfaces";
import { ResponseHeaders } from "./types";

export class HttpResponse implements IHttpResponse {
  public readonly request: IHttpRequest;
  public readonly axiosResponse: AxiosResponse;
  public readonly cookies: Record<string, ICookie>;
  public readonly headers: ResponseHeaders;
  public readonly data: any;
  public readonly status: number;
  public readonly statusText: string;

  constructor(req: IHttpRequest, res: AxiosResponse) {
    this.request = req;
    this.axiosResponse = res;
    this.headers = res.headers;
    this.data = res.data;
    this.status = res.status;
    this.statusText = res.statusText;

    this.cookies = this.parseCookies();
    HttpCookieManager.appendCookies(this.cookies);
  }

  private parseCookies() {
    const cookies = {};
    const cookieHeaders = this.headers["set-cookie"];

    if (cookieHeaders) {
      cookieHeaders.forEach((header) => {
        const cookie = Cookie.fromString(header);
        cookies[cookie.name] = cookie;
      });
    }

    return cookies;
  }

  /**
   * Convert the response data to a string
   */
  getDataString(): string {
    const contentType =
      this.headers["content-type"].split(";")[0] || "text/plain";
    if (contentType.includes("text")) return highlight(this.data);

    switch (contentType.toLowerCase()) {
      case "application/json":
        return objectToHighlightedString(JSON.parse(this.data));
    }

    return <string>this.data;
  }

  toString() {
    const seperator = "\r\n";

    let resString = "";
    resString += `${this.status} ${this.statusText}\r\n`;
    resString += seperator;
    resString += objectToHighlightedString(this.headers) + "\r\n";
    resString += seperator;
    resString += this.getDataString();

    return resString;
  }
}
