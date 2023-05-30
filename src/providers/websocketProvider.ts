import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const providers: Record<string, WebsocketProvider> = {};
const PORT = 3000; // 设置 WebSocket 服务器端口

export function createProvider(roomId: string) {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(
    `ws://localhost:${PORT}`,
    roomId,
    ydoc
  );
  providers[roomId] = provider;
  return provider;
}

export function getProvider(roomId: string) {
  return providers[roomId];
}

export function removeProvider(roomId: string) {
  delete providers[roomId];
}
