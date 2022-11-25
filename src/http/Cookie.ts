import { ICookie } from "./interfaces";

export class Cookie implements ICookie {
  constructor(
    public name: string,
    public value: string,
    public domain?: string,
    public path?: string,
    public expires?: Date,
    public httpOnly?: boolean,
    public secure?: boolean
  ) {}

  toString() {
    const { name, value, domain, path, expires, httpOnly, secure } = this;

    let cookieStr = `${name}=${value};`;
    if (domain) cookieStr += ` Domain=${domain};`;
    if (path) cookieStr += ` Path=${path};`;
    if (expires) cookieStr += ` Expires=${expires.toUTCString()};`;
    if (httpOnly) cookieStr += ` HttpOnly;`;
    if (secure) cookieStr += ` Secure;`;

    return cookieStr;
  }

  static fromString(str: string) {
    const parts = str.split(";");
    const [name, value] = parts[0].split("=");

    if (!name || !value) throw new TypeError(`Invalid cookie string (${str})`);

    const cookie = new Cookie(name, value);
    for (let i = 1; i < parts.length; i++) {
      const attribute = parts[i].replace(";", "").trim().toLowerCase();
      if (attribute === "httponly") cookie.httpOnly = true;
      else if (attribute === "secure") cookie.secure = true;
      else {
        const [key, value] = attribute.split("=");
        if (key && value) {
          switch (key.toLowerCase()) {
            case "domain":
              cookie.domain = value;
              break;
            case "path":
              cookie.path = value;
              break;
            case "expires":
              cookie.expires = new Date(value);
              break;
          }
        }
      }
    }

    return cookie;
  }
}
