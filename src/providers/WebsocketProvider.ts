import * as Y from "yjs";
import { WebsocketProvider as YWebsocketProvider } from "y-websocket"; // 这个包的类型有问题
import { WEBSOCKET_URL } from "../../config";
import { OP } from "../types";
import ws from "ws";
import { updateContentByGuid } from "../api/file";

export default class WebsocketProvider {
  ydoc: Y.Doc;
  provider: YWebsocketProvider;
  todoUndoManager: Y.UndoManager;
  operations: Y.XmlText;

  constructor(roomId: string) {
    this.ydoc = new Y.Doc();

    this.provider = new YWebsocketProvider(WEBSOCKET_URL, roomId, this.ydoc, {
      // @ts-ignore
      WebSocketPolyfill: ws,
    });

    this.operations = this.ydoc.get("content", Y.XmlText) as Y.XmlText;
    this.todoUndoManager = new Y.UndoManager(this.operations);

    this.provider.on("synced", (data: any) => {
      console.log(`房间${roomId}链接成功！`, data);
    });
  }

  // 监听变化
  onChange(
    callback: (
      update: Uint8Array,
      origin: any,
      doc: Y.Doc,
      tr: Y.Transaction
    ) => void
  ) {
    this.provider.doc.on("update", callback);
  }

  async saveToDb(roomId: string, ydocJson: string) {
    try {
      await updateContentByGuid(roomId, ydocJson);
      console.log("文件内容已经更新到数据库", roomId, ydocJson);
    } catch (error) {
      console.log("文件内容更新到数据库失败", error);
    }
  }

  undo() {
    this.todoUndoManager.undo();
  }

  redo() {
    this.todoUndoManager.redo();
  }

  getContent() {
    return this.operations;
  }

  destroy() {
    this.provider.disconnect();
  }
}
