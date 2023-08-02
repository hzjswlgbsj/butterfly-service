import { Middleware, ParameterizedContext, Next } from "koa";
import { entryRoom } from "../api/room";
import { add } from "../api/file";

interface Route {
  path: string;
  handler: (
    context: ParameterizedContext<ParameterizedContext<any, {}>, Next, any>,
    next: Next
  ) => any;
}

const routes: Route[] = [
  { path: "/room/entry", handler: entryRoom },
  { path: "/file/add", handler: add },
  // 添加其他路由
];

export function registerRoutes(app: any) {
  routes.forEach((route) => {
    app.use(
      async (
        ctx: ParameterizedContext<ParameterizedContext<any, {}>, Next, any>,
        next: Next
      ) => {
        if (ctx.request.path === route.path) {
          await route.handler(ctx, next);
        } else {
          await next();
        }
      }
    );
  });
}
