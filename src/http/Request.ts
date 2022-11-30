import { objectToHighlightedString } from "../utils/formatting";
import axios from "../utils/axios";
import { ContentTypes } from "./contentTypes";
import { Cookie } from "./Cookie";
import { HttpCookieManager } from "./CookieManager";
import { HttpResponse } from "./Response";
import { RequestConfig } from "./types";
import { ICookie } from "./interfaces";

export class HttpRequest {
  private _method: string;
  private _url: string;
  private _type: string;
  private _headers: Record<string, string>;
  private _cookies: Record<string, ICookie>;
  private _data: any;

  constructor(requestConfig: RequestConfig) {
    this._method = requestConfig.method?.toUpperCase() || "GET";
    this._url = requestConfig.url;
    this._type = requestConfig.type || ContentTypes.JSON;
    this._headers = requestConfig.headers || {};
    this._data = requestConfig.data;

    if (!this._url.startsWith("http")) this._url = `http://${this._url}`;

    if (requestConfig.cookies) {
      Object.entries(requestConfig.cookies).forEach(([name, value]) => {
        const cookie = new Cookie(name, value);
        this._cookies[name] = cookie;
      });
    }

    this._cookies = {
      ...HttpCookieManager.getCookies(),
      ...this._cookies,
    };

    this.setContentTypeHeader();
  }

  get method() {
    return this._method;
  }

  get url() {
    return this._url;
  }

  get type() {
    return this._type;
  }

  get headers() {
    return this._headers;
  }

  get cookies() {
    return this._cookies;
  }

  get data() {
    return this._data;
  }

  setHeader(name: string, value: string) {
    this._headers[name] = value;
  }

  getHeader(name: string) {
    return this._headers[name];
  }

  setCookie(name: string, value: string) {
    this._cookies[name] = new Cookie(name, value);
  }

  getCookie(name: string) {
    return this._cookies[name];
  }

  private setContentTypeHeader() {
    if (this._method === "GET") {
      delete this._headers["Content-Type"];
    } else if (this._type) {
      if (this._type.includes("/")) this._headers["Content-Type"] = this._type;
      else if (ContentTypes[this._type.toUpperCase()]) {
        this._headers["Content-Type"] = ContentTypes[this._type.toUpperCase()];
      } else throw new TypeError(`Invalid Content-Type ${this._type}`);
    }
  }

  private cookiesToHeaders() {
    let cookieStr = "";
    Object.values(this._cookies).forEach((cookie) => {
      cookieStr += cookie.toString() + ";";
    });

    return cookieStr;
    // this._headers["Cookie"] = cookieStr;
  }

  async execute() {
    const res = await axios.request({
      method: this._method,
      url: this._url,
      headers: {
        Cookie: this.cookiesToHeaders(),
        ...this._headers,
      },
      data: JSON.stringify(this._data),
    });

    return new HttpResponse(this, res);
  }

  toString() {
    const seperator = "\r\n";

    let resString = "";
    resString += `${this._method} ${this._url}\r\n`;
    resString += seperator;
    resString += objectToHighlightedString(this._headers) + "\r\n";
    resString += seperator;
    resString += objectToHighlightedString(this._data);

    return resString;
  }
}
