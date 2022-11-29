import { program } from "commander";
import * as path from "path";
import * as fs from "fs";
import * as prompt from "prompt-sync";
import * as promptHistory from "prompt-sync-history";

import { IApp } from "./interfaces";
import { IReer } from "./interfaces";
import { Config } from "./Config";
import * as ui from "ui/print";
import * as fileUtil from "utils/file";

export class App implements IApp {
  constructor(private reer: IReer) {
    program
      .argument("[string]", "route to test")
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

    Config.set("app", appConfig);
  }

  private loadProjectConfig() {
    const configFile = path.join(
      Config.get("app.reerDir"),
      Config.get("app.locations.projectConfig")
    );

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
    const prmpt = prompt({
      history: promptHistory(),
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

    // this.writeUserConfig();
    // this.writeCookies();
  }
}
