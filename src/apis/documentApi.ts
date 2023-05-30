import { Context } from "koa";
import { nanoid } from "nanoid";

export async function addDocument(ctx: Context) {
  const guid = nanoid();

  console.log("即将添加一篇文档", guid);
  // 返回房间ID给客户端或其他逻辑
  return guid;
}
