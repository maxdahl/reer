import { HttpRequest } from "http/Request";
import { IHttpRequest, IHttpResponse } from "http/interfaces";
import { RequestCollection, ResponseCollection, RouteConfig } from "./types";
import { Config } from "./Config";

import * as ui from "ui/";

export class RequestManager {
  private static instance: RequestManager;

  static getInstance() {
    if (!RequestManager.instance)
      RequestManager.instance = new RequestManager();

    return RequestManager.instance;
  }

  private requests: RequestCollection = [];
  private responses: ResponseCollection = [];

  private retryCount = 0;
  private MAX_RETRIES = 3;

  private constructor() {}

  getRequests() {
    return this.requests;
  }

  getResponses() {
    return this.responses;
  }

  async makeRequest(routeConfig: RouteConfig) {
    this.retryCount = 0;
    return await this.executeRequest(routeConfig);
  }

  private async executeRequest(routeConfig: RouteConfig) {
    let request: IHttpRequest;
    let response: IHttpResponse;

    try {
      let baseUrl: string = Config.get("app.baseUrl");
      if (baseUrl && routeConfig.ignoreBaseUrl !== true) {
        if (!baseUrl.endsWith("/")) baseUrl += "/";
        routeConfig.url = `${baseUrl}${routeConfig.url}`;
      }

      request = new HttpRequest(routeConfig);
      ui.print(`${request.method} ${request.url}`);
      response = await request.execute();

      return response;
    } catch (err) {
      switch (err.code) {
        case "ECONNREFUSED":
          return "Could not send request. Is the server running?";
        // throw new Error(`Could not send request. Is the Server running?`);
        default:
          if (this.retryCount < this.MAX_RETRIES) {
            this.retryCount += 1;
            return this.executeRequest(routeConfig);
          } else {
            throw err;
          }
      }
    } finally {
      let status = "FAILED";
      if (response) {
        status = `${response.status} ${response.statusText}`;
        this.responses.push({ response });
      }
      this.requests.push({ status, request, route: routeConfig });
    }
  }
}
