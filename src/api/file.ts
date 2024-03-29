import { Context } from "koa";
import Router from "koa-router";
import {
  FileAddValidator,
  PositiveGuidParamsValidator,
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
export async function add(ctx: Context) {
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
}

/**
 * 根据guid更新文件内容-后端专用
 */
export async function updateContentByGuid(guid: string, content: string) {
  const [err, data] = await FileDao.update({
    guid,
    content,
  });
  if (!err) {
    return {
      code: 200,
      msg: "更新文章成功",
      errorCode: 0,
      data,
    };
  } else {
    return {
      code: -1,
      msg: err,
      errorCode: 1,
    };
  }
}
/**
 * 更新文件信息
 */
export async function update(ctx: Context) {
  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取文章ID参数
  const id = v.get("body.id");
  const name = v.get("body.name");
  const content = v.get("body.content");

  // 更新文章
  const [err, data] = await FileDao.update({
    id,
    name,
    content,
  });
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.success("更新文章成功");
  } else {
    ctx.body = res.fail(err);
  }
}

/**
 * 获取文件列表
 */
export async function getFiles(filter: FileGetReq) {
  try {
    const data = await FileDao.get(filter);

    return {
      code: 200,
      msg: "获取文章成功",
      errorCode: 0,
      data,
    };
  } catch (error) {
    return {
      state: -1,
      msg: "err",
      error,
      errorCode: 1,
    };
  }
}
/**
 * 获取文件列表
 */
export async function list(ctx: Context) {
  const v = await new LinValidator().validate(ctx);

  const filter: FileGetReq = {};

  const id = v.get("body.id");
  const guid = v.get("body.guid");
  const type = v.get("body.type");
  const page = v.get("body.page");
  const limit = v.get("body.limit");

  if (guid) {
    filter.guid = guid;
  }
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

  try {
    const data = await FileDao.get(filter);

    ctx.response.status = 200;
    ctx.body = res.json(data);
  } catch (error) {
    ctx.body = res.fail(error);
  }
}

/**
 * 获取文件详情，文件详情复杂后会分表，这里需要做数据组合
 */
export async function detail(ctx: Context) {
  const v = await new PositiveGuidParamsValidator().validate(ctx);

  const filter: FileGetReq = {};

  const guid = v.get("body.guid");

  if (guid) {
    filter.guid = guid;
  }

  try {
    const { items } = await FileDao.get(filter);
    if (items.length > 0) {
      ctx.response.status = 200;
      ctx.body = res.json(items[0].dataValues);
    } else {
      ctx.body = res.fail({}, "文件不存在");
    }
  } catch (error) {
    ctx.body = res.fail(error);
  }
}

router.post("/add", /*new Auth(AUTH_ADMIN).m,*/ add);
router.post("/update", /*new Auth(AUTH_ADMIN).m,*/ update);
router.post("/list", /*new Auth(AUTH_ADMIN).m,*/ list);
router.post("/detail", /*new Auth(AUTH_ADMIN).m,*/ detail);

export default router;
