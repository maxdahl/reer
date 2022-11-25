import * as fs from "fs";
import * as path from "path";
import { objectToString } from "./formatting";

export function parseJson(filename: string) {
  let config = {};
  if (fs.existsSync(filename)) {
    config = JSON.parse(fs.readFileSync(filename).toString());
  }

  return config;
}

export function writeObject(file: string, obj: Record<any, any>) {
  fs.writeFileSync(path.join(file), objectToString(obj));
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
