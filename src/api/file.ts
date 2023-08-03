import { Context } from "koa";
import Router from "koa-router";
import { ArticleValidator } from "../validators/file";
import { nanoid } from "nanoid";
import { Auth } from "../../middlewares/auth";
// import { ArticleDao } from "../../dao/article";
// import { CommentDao } from "../../dao/comment";
// import { Resolve } from "../../lib/helper";

// const res = new Resolve();
const router = new Router({
  prefix: "/file",
});

const AUTH_ADMIN = 16;

router.get("/bb", (ctx: Context) => {
  ctx.body = "Hello, world!";
});

/**
 * 创建文章
 */
// router.post("/add", new Auth(AUTH_ADMIN).m, async (ctx: Context) => {
// 先不校验token
router.post("/add", async (ctx: Context) => {
  const guid = nanoid();
  ctx.body = guid;

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
export default router;
