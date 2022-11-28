import { Reer } from "./core/Reer";
import { App } from "./core/App";
import { RequestManager } from "core/RequestManager";

const reer = new Reer(RequestManager.getInstance());
const app = new App(reer);

export { reer, app };
