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
import { FileGetReq } from "../types/api";
import { LinValidator } from "../../core/lin-validator-v2";

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
router.post("/update", async (ctx: Context) => {
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

/**
 * 获取文件列表
 */
// router.post("/get", new Auth(AUTH_ADMIN).m, async (ctx) => {
router.post("/get", async (ctx: Context) => {
  const v = await new LinValidator().validate(ctx);

  const filter: FileGetReq = {};

  const id = v.get("body.id");
  const type = v.get("body.type");
  const page = v.get("body.page");
  const limit = v.get("body.limit");

  if (id) {
    filter.id = id;
  }
  if (type) {
    filter.type = type;
  }
  if (page) {
    filter.page = page;
  }
  if (limit) {
    filter.limit = limit;
  }

  // 更新文章
  const [err, data] = await FileDao.get(filter);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
});

export default router;
