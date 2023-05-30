// app.ts
import Koa from "koa";
import http from "http";
import { registerRoutes } from "./routes";
import { PORT } from "./config";
import { roomManager } from "./providers";

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

// function createProvider(roomId: string) {
//   const ydoc = new Y.Doc();
//   const yArray = ydoc.getArray("todoItems");
//   const provider = new WebsocketProvider(WEBSOCKET_URL, roomId, ydoc, {
//     WebSocketPolyfill: ws,
//   });
//   provider.on("status", (event: any) => {
//     console.log(event.status); // logs "connected" or "disconnected"
//   });
//   // 在连接建立后，可以对文档进行操作
//   provider.on("synced", () => {
//     // 执行与文档同步后的操作
//     console.log("链接成功！");
//   });

//   provider.on("sync", (isSynced: boolean) => {
//     console.log("======= sync", isSynced); // logs "connected" or "disconnected"
//   });

//   // 处理接收到的外部更新事件
//   ydoc.on("update", (update) => {
//     // 处理文档更新
//     console.log("文档发生改变", yArray.toJSON());
//   });
//   yArray.observe((event: Y.YArrayEvent<any>, transaction: Y.Transaction) => {
//     console.log("收到客户端的消息", event.target.toArray());
//   });
// }
