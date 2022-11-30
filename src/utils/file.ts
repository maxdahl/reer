import * as fs from "fs";
import * as path from "path";

export function parseJson(filename: string) {
  let config = {};
  if (fs.existsSync(filename)) {
    try {
      config = JSON.parse(fs.readFileSync(filename).toString());
    } catch (err) {}
  }

  return config;
}

export function writeObject(file: string, obj: Record<any, any>) {
  fs.writeFileSync(path.join(file), JSON.stringify(obj));
}

export function exists(path: string | string[]) {
  if (Array.isArray(path)) {
    for (const p of path) {
      if (fs.existsSync(p) === false) return false;
    }
  } else {
    return fs.existsSync(path);
  }

  return true;
}
