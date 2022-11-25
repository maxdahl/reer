import { objectToString } from "../utils/formatting";
import axios from "../utils/axios";
import { ContentTypes } from "./contentTypes";
import { Cookie } from "./Cookie";
import { HttpCookieManager } from "./CookieManager";
import { HttpResponse } from "./Response";
import { RequestConfig } from "./types";

export class HttpRequest {
  private method: string;
  private url: string;
  private type: string;
  private headers: Record<string, string>;
  private cookies: Record<string, Cookie>;
  private data: any;

  constructor(requestConfig: RequestConfig) {
    this.method = requestConfig.method?.toUpperCase() || "GET";
    this.url = requestConfig.url;
    this.type = requestConfig.type || ContentTypes.JSON;
    this.headers = requestConfig.headers || {};
    this.data = requestConfig.data;

    if (!this.url.startsWith("http")) this.url = `http://${this.url}`;

    if (requestConfig.cookies) {
      Object.entries(requestConfig.cookies).forEach(([name, value]) => {
        const cookie = new Cookie(name, value);
        this.cookies[name] = cookie;
      });
    }

    this.cookies = {
      ...HttpCookieManager.getCookies(),
      ...this.cookies,
    };

    this.setContentTypeHeader();
  }

  private setContentTypeHeader() {
    if (this.method === "GET") {
      delete this.headers["Content-Type"];
    } else if (this.type) {
      if (this.type.includes("/")) this.headers["Content-Type"] = this.type;
      else if (ContentTypes[this.type.toUpperCase()]) {
        this.headers["Content-Type"] = ContentTypes[this.type.toUpperCase()];
      } else throw new TypeError(`Invalid Content-Type ${this.type}`);
    }
  }

  private cookiesToHeaders() {
    let cookieStr = "";
    Object.values(this.cookies).forEach((cookie) => {
      cookieStr += cookie.toString() + ";";
    });

    this.headers["Cookie"] = cookieStr;
  }

  setHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  getHeader(name: string) {
    return this.headers[name];
  }

  getHeaders() {
    return this.headers;
  }

  setCookie(name: string, value: string) {
    this.cookies[name] = new Cookie(name, value);
  }

  getCookie(name: string) {
    return this.cookies[name];
  }

  getCookies() {
    return this.cookies;
  }

  async execute() {
    this.cookiesToHeaders();

    const res = await axios.request({
      method: this.method,
      url: this.url,
      headers: this.headers,
      data: JSON.stringify(this.data),
    });

    return new HttpResponse(this, res);
  }

  toString() {
    const seperator = "\r\n";

    let resString = "";
    resString += `${this.method} ${this.url}\r\n`;
    resString += seperator;
    resString += objectToString(this.headers) + "\r\n";
    resString += seperator;
    resString += objectToString(this.data);

    return resString;
  }
}
