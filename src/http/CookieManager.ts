import { ICookie } from "./interfaces";

export class HttpCookieManager {
  private constructor() {}

  private static _cookies: Record<string, ICookie> = {};

  static setCookie(name: string, value: ICookie) {
    HttpCookieManager._cookies[name] = value;
  }

  static setCookies(cookies: Record<string, ICookie>) {
    HttpCookieManager._cookies = cookies;
  }

  static appendCookies(cookies: Record<string, ICookie>, overwrite = true) {
    if (overwrite) {
      HttpCookieManager._cookies = {
        ...HttpCookieManager._cookies,
        ...cookies,
      };
    } else {
      HttpCookieManager._cookies = {
        ...cookies,
        ...HttpCookieManager._cookies,
      };
    }
  }

  static getCookie(name: string) {
    return HttpCookieManager._cookies[name];
  }

  static getCookies() {
    return HttpCookieManager._cookies;
  }
}
