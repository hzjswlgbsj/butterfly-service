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
export async function entry(ctx: Context) {
  const v = await new RoomIdValidator().validate(ctx);

  const roomId = v.get("body.roomId");
  try {
    console.log("激活进入一篇文档", roomId);
    await roomManager.createProvider(roomId);
    ctx.response.status = 200;
    ctx.body = res.json(roomId);
  } catch (error) {
    ctx.body = res.fail("激活失败");
  }
}
/**
 * 获取当前被激活的房间列表
 */
export async function list(ctx: Context) {
  try {
    const data = await roomManager.all();
    // 返回房间ID给客户端或其他逻辑
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } catch (error) {
    ctx.body = res.fail("获取失败");
  }
}

router.post("/list", /*new Auth(AUTH_ADMIN).m,*/ list);
router.post("/entry", /*new Auth(AUTH_ADMIN).m,*/ entry);

export default router;
