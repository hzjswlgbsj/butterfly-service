import { Context } from "koa";
import Router from "koa-router";
import { Auth } from "../../middlewares/auth";

const router = new Router({
  prefix: "/room",
});

const AUTH_ADMIN = 16;
/**
 * 激活进入一篇文档
 */
router.post("/entry", new Auth(AUTH_ADMIN).m, async (ctx: Context) => {
  const roomId = ctx.params.roomId;

  console.log("激活进入一篇文档", roomId);
  // 返回房间ID给客户端或其他逻辑
  ctx.body = { roomId };
});

export default router;
