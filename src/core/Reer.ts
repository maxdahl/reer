import * as fs from "fs";
import * as path from "path";
import { CmdManager } from "cmd/CmdManager";

import { Config } from "./Config";
import { RouteConfig } from "./types";
import { IRequestManager, IReer } from "./interfaces";

export class Reer implements IReer {
  constructor(
    private requestManager: IRequestManager,
    private cmdManager: CmdManager = CmdManager.getInstance()
  ) {
    this.cmdManager.setReerInstance(this);
  }

  async executeCmd(cmd: string) {
    const [file, routeName] = cmd.split("/");
    if (!routeName || this.cmdManager.hasCmd(cmd)) {
      return Promise.resolve(this.cmdManager.run(cmd));
    } else {
      return await this.runRoute({ file: `${file}.json`, name: routeName });
    }
  }

  /**
   * Parse an object and resolve config items
   **/
  private resolveRouteConfig(object: Record<string, any>): RouteConfig {
    const resolved = {};
    Object.keys(object).forEach((key) => {
      if (typeof object[key] === "string") {
        resolved[key] = Config.resolveVariables(object[key]);
      } else if (typeof object[key] === "object") {
        if (Array.isArray(object[key])) {
          resolved[key] = object[key].map((val: string) =>
            Config.resolveVariables(val)
          );
        } else {
          resolved[key] = this.resolveRouteConfig(object[key]);
        }
      } else {
        resolved[key] = object[key];
      }
    });

    return resolved as RouteConfig;
  }

  private parseRoutingFile(filename: string) {
    const routesDir = path.join(
      Config.get("app.reerDir"),
      Config.get("app.locations.routes")
    );
    const routeFile = path.join(routesDir, filename);

    if (!fs.existsSync(routeFile))
      throw new Error(`File ${routeFile} not found`);

    const routes = JSON.parse(fs.readFileSync(routeFile).toString());
    return routes;
  }

  async runRoute(route: { file: string; name: string } | RouteConfig) {
    let routeConfig: RouteConfig;

    if ("file" in route) {
      const routes = this.parseRoutingFile(route.file);
      if (!routes[route.name])
        throw new Error(`No route ${route.name} in ${route.file}`);

      routeConfig = this.resolveRouteConfig(routes[route.name]);
    } else {
      routeConfig = this.resolveRouteConfig(route);
    }

    if (!routeConfig.name) routeConfig.name = route.name;

    if (routeConfig.before) {
      if (Array.isArray(routeConfig.before))
        routeConfig.before.forEach((cmd) => this.executeCmd(cmd));
      else this.executeCmd(routeConfig.before);
    }

    const response = await this.requestManager.makeRequest(routeConfig);
    return response;
  }

  getRequestManager() {
    return this.requestManager;
  }
}
