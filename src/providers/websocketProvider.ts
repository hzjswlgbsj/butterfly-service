import * as Y from "yjs";
import { WebsocketProvider as YWebsocketProvider } from "y-websocket"; // 这个包的类型有问题
import { WEBSOCKET_URL } from "../config";
import { OP } from "../types";
const ws = require("ws");

export default class WebsocketProvider {
  roomId: string;
  ydoc: Y.Doc;
  provider: YWebsocketProvider;
  todoUndoManager: Y.UndoManager;
  operations: Y.Array<OP>;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.ydoc = new Y.Doc();

    this.provider = new YWebsocketProvider(
      WEBSOCKET_URL,
      this.roomId,
      this.ydoc,
      {
        WebSocketPolyfill: ws,
      }
    );

    this.operations = this.ydoc.getArray("doc-operations");
    this.todoUndoManager = new Y.UndoManager(this.operations);
    this.provider.on("synced", () => {
      console.log(`房间${this.roomId}链接成功！`);
    });
  }

  // 监听 todoItems 变化
  onChange(
    callback: (event: Y.YArrayEvent<OP>, transaction: Y.Transaction) => void
  ) {
    this.operations.observe(callback);
  }

  undo() {
    this.todoUndoManager.undo();
  }

  redo() {
    this.todoUndoManager.redo();
  }

  getTodoItems() {
    return this.operations.toArray();
  }

  destroy() {
    this.provider.disconnect();
  }
}
