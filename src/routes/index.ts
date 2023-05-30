// src/routes/index.ts
import { Middleware, ParameterizedContext, Next } from "koa";
import { entryRoom } from "../apis/RoomApi";
import { addDocument } from "../apis/DocumentApi";

interface Route {
  path: string;
  handler: (
    context: ParameterizedContext<ParameterizedContext<any, {}>, Next, any>,
    next: Next
  ) => any;
}

const routes: Route[] = [
  { path: "/room/entry", handler: entryRoom },
  { path: "/document/add", handler: addDocument },
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
