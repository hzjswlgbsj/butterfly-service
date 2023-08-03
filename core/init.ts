import Koa from "koa";
import Router from "koa-router";
import requireDirectory from "./require-directory";

export default class InitManager {
  static app: Koa;

  static async initCore(app: Koa) {
    InitManager.app = app;
    await InitManager.initLoadRouters();
    InitManager.loadHttpException();
    InitManager.loadConfig();
  }

  // Load all routers
  static async initLoadRouters() {
    // Absolute path to the 'api' directory
    const apiDirectory = `${process.cwd()}/src/api`;
    await requireDirectory(apiDirectory, {
      visit: (router: Router) => {
        if (router instanceof Router) {
          InitManager.app.use(router.routes());
          InitManager.app.use(router.allowedMethods());
        }
      },
    });
  }

  static loadConfig(path: string = "") {
    const configPath = path || `${process.cwd()}/config`;
    const config = require(configPath);
    (global as any).config = config;
  }

  static loadHttpException() {
    const errors = require("./http-exception");
    (global as any).errs = errors;
  }
}
