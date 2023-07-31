const Koa = require("koa");
const http = require("http");
const InitManager = require("./core/init");
const parser = require("koa-bodyparser");
const cors = require("@koa/cors");
const ratelimit = require("koa-ratelimit");
require("module-alias/register");
import { registerRoutes } from "./src/routes";
const catchError = require("./middlewares/exception");
import { roomManager } from "./src/providers";
import { PORT } from "./config";

const app = new Koa();
const server = http.createServer(app.callback());

app.use(async (ctx: any, next: any) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  ctx.set("Access-Control-Allow-Headers", "Content-Type");
  await next();
});

app.use(cors());
app.use(catchError);
app.use(parser());

// 接口调用频率限制（Rate-Limiting）
// Rate limiter middleware for koa.
// https://github.com/koajs/ratelimit
const db = new Map();
app.use(
  ratelimit({
    driver: "memory",
    db: db,
    duration: 60000,
    errorMessage: "Sometimes You Just Have to Slow Down.",
    id: (ctx) => ctx.ip,
    headers: {
      remaining: "Rate-Limit-Remaining",
      reset: "Rate-Limit-Reset",
      total: "Rate-Limit-Total",
    },
    max: 100,
    disableHeader: false,
    whitelist: (ctx) => {
      // some logic that returns a boolean
    },
    blacklist: (ctx) => {
      // some logic that returns a boolean
    },
  })
);

// 创建测试房间（目前从前端复制写死的）
roomManager.createProvider("gay42g6xx2f528nx4c");

// 注册路由
// registerRoutes(app);

InitManager.initCore(app);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
