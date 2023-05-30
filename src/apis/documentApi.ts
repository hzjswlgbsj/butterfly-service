import { Context } from "koa";
import { getProvider, createProvider } from "../providers/websocketProvider";

export async function initializeDocument(ctx: Context) {
  const roomId = ctx.params.roomId;
  let provider = getProvider(roomId);
  if (!provider) {
    provider = createProvider(roomId);
  }

  // 返回房间ID给客户端或其他逻辑
  ctx.body = { roomId };
}
