// import { Context } from "koa";
// import { nanoid } from "nanoid";

// export async function add(ctx: Context) {
//   const guid = nanoid();

//   console.log("即将添加一篇文档", guid);
//   // 返回房间ID给客户端或其他逻辑
//   ctx.body = { guid };
// }

import { Context } from "koa";
import Router from "koa-router";
import { ArticleValidator } from "../validators/file";
import { nanoid } from "nanoid";
const { Auth } = require("../../../middlewares/auth");
const { ArticleDao } = require("../../dao/article");
const { CommentDao } = require("../../dao/comment");
const { Resolve } = require("../../lib/helper");
const res = new Resolve();

const AUTH_ADMIN = 16;

const router = new Router({
  prefix: "/file",
});

/**
 * 创建文章
 */
router.post("/add", new Auth(AUTH_ADMIN).m, async (ctx: Context) => {
  const guid = nanoid();
  console.log("添加一篇文档", guid);
  // 通过验证器校验参数是否通过
  // const v = await new ArticleValidator().validate(ctx);
  // // 创建文章
  // const [err, data] = await ArticleDao.create(v);
  // if (!err) {
  //   // 返回结果
  //   ctx.response.status = 200;
  //   ctx.body = res.json(data.id);
  // } else {
  //   ctx.body = res.fail(err);
  // }
});
module.exports = router;
