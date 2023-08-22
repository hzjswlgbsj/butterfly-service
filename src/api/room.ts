import { Context } from "koa";
import Router from "koa-router";
import { Auth } from "../../middlewares/auth";
import { roomManager } from "../providers";
import { RoomIdValidator } from "../validators/room";
import Resolve from "../lib/helper";
const res = new Resolve();

const router = new Router({
  prefix: "/room",
});

const AUTH_ADMIN = 16;
/**
 * 激活进入一篇文档
 */
// router.post("/entry", new Auth(AUTH_ADMIN).m, async (ctx: Context) => {
router.post("/entry", async (ctx: Context) => {
  const v = await new RoomIdValidator().validate(ctx);

  // 获取文章ID参数
  const roomId = v.get("body.roomId");
  try {
    console.log("激活进入一篇文档", roomId);
    await roomManager.createProvider(roomId);
    // 返回房间ID给客户端或其他逻辑
    ctx.response.status = 200;
    ctx.body = res.json(roomId);
  } catch (error) {
    ctx.body = res.fail("激活失败");
  }
});

export default router;
