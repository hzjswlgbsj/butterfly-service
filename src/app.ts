// app.ts
import Koa from "koa";
import http from "http";
import { registerRoutes } from "./routes";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { PORT, WEBSOCKET_URL } from "./config";
import { YjsClient } from "./yjs-client";

const ws = require("ws");
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
createProvider("slate-demo-room1");

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

function createProvider(roomId: string) {
  // 连接 ws
  const yjsClient = new YjsClient(roomId, "username");
  // 监听 todoItems 数据的变化
  yjsClient.onItemsChange(
    (event: Y.YArrayEvent<any>, transaction: Y.Transaction) => {
      console.log("数据发生改变", event, transaction);
    }
  );
}
