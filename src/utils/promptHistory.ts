// this is from prompt-sync-history package with a modified push function
import * as fs from "fs";

export function promptHistory(file: string = undefined, max = 1000) {
  let HIST = [];

  if (file) {
    try {
      HIST = fs
        .readFileSync(file, { encoding: "utf8" })
        .split("\n")
        .slice(0, -1);
    } catch (e) {}

    HIST = HIST.slice(HIST.length - max, HIST.length);
    console.log("LOAD", HIST);
  }
  let ix = HIST.length;

  return {
    atStart: function () {
      return ix <= 0;
    },
    atPenultimate: function () {
      return ix === HIST.length - 1;
    },
    pastEnd: function () {
      return ix >= HIST.length;
    },
    atEnd: function () {
      return ix === HIST.length;
    },
    prev: function () {
      return HIST[--ix];
    },
    next: function () {
      console.log("next", HIST[ix + 1]);
      return HIST[++ix];
    },
    reset: function () {
      ix = HIST.length;
    },
    push: function (str: string) {
      HIST.push(str);
    },
    save: function () {
      if (!file) return;
      fs.writeFileSync(file, HIST.join("\n") + "\n");
    },
  };
}
