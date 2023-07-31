import * as Y from "yjs";
import { WebsocketProvider as YWebsocketProvider } from "y-websocket"; // 这个包的类型有问题
import { WEBSOCKET_URL } from "../../config";
import { OP } from "../types";
const ws = require("ws");

export default class WebsocketProvider {
  roomId: string;
  ydoc: Y.Doc;
  provider: YWebsocketProvider;
  todoUndoManager: Y.UndoManager;
  operations: Y.XmlText;

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

    // this.operations = this.ydoc.getArray("operations");
    this.operations = this.ydoc.get("content", Y.XmlText) as Y.XmlText;
    this.todoUndoManager = new Y.UndoManager(this.operations);
    this.provider.on("synced", () => {
      // console.log(`房间${this.roomId}链接成功！`, this.operations);
    });
  }

  // 监听 todoItems 变化
  onChange(
    callback: (event: Y.YEvent<any>[], transaction: Y.Transaction) => void
  ) {
    this.operations.observeDeep(callback);
  }

  undo() {
    this.todoUndoManager.undo();
  }

  redo() {
    this.todoUndoManager.redo();
  }

  getTodoItems() {
    return this.operations;
  }

  destroy() {
    this.provider.disconnect();
  }
}
