import { Context } from "koa";
import { nanoid } from "nanoid";

export async function entryRoom(ctx: Context) {
  const roomId = ctx.params.roomId;

  console.log("激活进入一篇文档", roomId);
  // 返回房间ID给客户端或其他逻辑
  ctx.body = { roomId };
}
