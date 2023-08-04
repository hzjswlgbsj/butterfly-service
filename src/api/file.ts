import { Context } from "koa";
import Router from "koa-router";
import FileValidator from "../validators/file";
import { nanoid } from "nanoid";
// import { Auth } from "../../middlewares/auth";
import FileDao from "../dao/file";
import Resolve from "../lib/helper";

const res = new Resolve();
const router = new Router({
  prefix: "/file",
});

const AUTH_ADMIN = 16;

/**
 * 创建文章
 */
// router.post("/add", new Auth(AUTH_ADMIN).m, async (ctx: Context) => {
// 先不校验token
router.post("/add", async (ctx: Context) => {
  const guid = nanoid();
  if (!ctx.request.body) {
    ctx.request.body = {};
  }
  (ctx.request.body as any).guid = guid;

  // 通过验证器校验参数是否通过
  const v = await new FileValidator().validate(ctx);
  // 创建文章
  const [err, data] = await FileDao.add(v);
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(data.id);
  } else {
    ctx.body = res.fail(err);
  }
});
export default router;
