import { Context } from "koa";
import Router from "koa-router";
import {
  FileAddValidator,
  PositiveIdParamsValidator,
} from "../validators/file";
import { nanoid } from "nanoid";
import { Auth } from "../../middlewares/auth";
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
  const v = await new FileAddValidator().validate(ctx);
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

/**
 * 更新文件内容
 */
// router.post("/update", new Auth(AUTH_ADMIN).m, async (ctx) => {
router.post("/update", async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取文章ID参数
  const id = v.get("body.id");

  // 更新文章
  const [err, data] = await FileDao.update(id, v);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.success("更新文章成功");
  } else {
    ctx.body = res.fail(err);
  }
});

export default router;
