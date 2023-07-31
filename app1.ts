// app.ts
import Koa from "koa";
import http from "http";
import { registerRoutes } from "./src/routes";
import { PORT } from "./config";
import { roomManager } from "./src/providers";

const app = new Koa();
const server = http.createServer(app.callback());

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  ctx.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

// 注册路由
registerRoutes(app);

// 创建测试房间（目前从前端复制写死的）
roomManager.createProvider("gay42g6xx2f528nx4c");

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
