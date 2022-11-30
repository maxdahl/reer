// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require("../../package.json").version;

import { program } from "commander";
import * as path from "path";
import * as fs from "fs";
import * as prompt from "prompt-sync";
import { promptHistory } from "utils/promptHistory";

import axios from "utils/axios";
import { IApp } from "./interfaces";
import { IReer } from "./interfaces";
import { Config } from "./Config";
import * as ui from "ui/";
import * as fileUtil from "utils/file";
import { HttpCookieManager } from "http/CookieManager";
import { ICookie } from "http/interfaces";
import { Cookie } from "http/Cookie";

export class App implements IApp {
  constructor(private reer: IReer) {
    program
      .description("A cli api testing tool written in typescript")
      .version(version)
      .argument("[routes]", "route to test")
      .argument("[commands]", "commands to execute")
      .option(
        "-p, --path <string>",
        "The working directory of your project",
        process.cwd()
      )
      .option(
        "-d, --directory <string>",
        "The directory where the reer files are. Must be within the project directory. Defaults to reer",
        ".reer"
      )
      .option(
        "-c, --config <string>",
        "The reer config file. Must be in the reer directory. Defaults to reer.json",
        "reer.json"
      );
    // .option(
    //   "--nosave",
    //   "[WIP]Dont save anything to disk and don't create any folders",
    //   false
    // );

    program.parse();
  }

  /*
   * Get the full path of a location inside reerDir
   */
  private getFullPath(location: string) {
    const reerDir = Config.get("app.reerDir");
    return path.join(reerDir, location);
  }

  private loadCookies() {
    const cookieFile = Config.get("app.locations.cookies");
    const rawCookies = fileUtil.parseJson(
      this.getFullPath(cookieFile)
    ) as Record<string, ICookie>;
    const cookies = {};

    Object.values(rawCookies).forEach((cookie) => {
      cookies[cookie.name] = new Cookie(cookie);
    });

    HttpCookieManager.setCookies(cookies);
  }

  private saveCookies() {
    const cookies = HttpCookieManager.getCookies();
    const cookieFile = Config.get("app.locations.cookies");

    fileUtil.writeObject(this.getFullPath(cookieFile), cookies);
  }

  private initProject() {
    const opts = program.opts();

    if (!fileUtil.exists(opts.path))
      throw new Error(`Directory ${opts.path} does not exist`);

    try {
      fs.cpSync(
        path.join(__dirname, "../../templates/default"),
        path.join(opts.path, opts.directory),
        { recursive: true }
      );
    } catch (err) {
      if (err.message) console.error(err.message);
      else console.log(err);
    }
  }

  private loadAppConfig() {
    const opts = program.opts();

    const reerDir = path.join(opts.path, opts.directory);
    if (!fileUtil.exists(reerDir)) {
      return;
    }

    const configFile = path.join(reerDir, opts.config);

    const appConfig = {
      locations: {
        userConfig: "config/project.json",
        cookies: "store/.cookies",
        history: "store/.history",
        routes: "routes",
      },

      baseUrl: "",
      ...fileUtil.parseJson(configFile),

      reerDir,
      configFile: configFile,
      configFileName: opts.config,
    };

    axios.defaults.baseURL = appConfig.baseUrl;
    Config.set("app", appConfig);
  }

  private loadProjectConfig() {
    const projectConfigFile = Config.get("app.locations.projectConfig");
    const configFile = path.join(this.getFullPath(projectConfigFile));

    Config.set("project", fileUtil.parseJson(configFile));
  }

  private writeProjectConfig() {
    const config = Config.get("project");
    const configFile = path.join(
      Config.get("app.reerDir"),
      Config.get("app.locations.projectConfig")
    );

    fileUtil.writeObject(configFile, config);
  }

  private async runCmd(cmd: string) {
    try {
      const res = await this.reer.executeCmd(cmd);
      return res;
    } catch (err) {
      return err.message;
    }
  }

  run() {
    if (program.args[0]?.trim() === "init") {
      return this.initProject();
    } else {
      this.loadAppConfig();
      this.loadProjectConfig();
      this.loadCookies();
    }

    if (program.args.length > 0) {
      program.args.forEach(async (cmd) => {
        const output = await this.runCmd(cmd);
        ui.print(output);
      });
    } else {
      this.listen();
    }
  }

  async listen() {
    const historyFile = Config.get("app.locations.history");
    const history = promptHistory(this.getFullPath(historyFile));

    const prmpt = prompt({
      history,
    });

    let run = true;
    while (run === true) {
      const cmd = prmpt("CMD > ");
      if (cmd === null || cmd === "exit" || cmd === "quit") run = false;
      else {
        const output = await this.runCmd(cmd);
        ui.print(output);
      }
    }

    history.save();
    // this.writeUserConfig();
    this.saveCookies();
  }
}
