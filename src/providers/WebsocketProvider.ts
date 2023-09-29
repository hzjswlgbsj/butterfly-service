import * as Y from "yjs";
import { WebsocketProvider as YWebsocketProvider } from "y-websocket"; // 这个包的类型有问题
import { WEBSOCKET_URL } from "../../config";
import { OP } from "../types";
import ws from "ws";
import { updateContentByGuid } from "../api/file";
import Scheduler from "../lib/schedule";
import { fromUint8Array } from "js-base64";

export default class WebsocketProvider {
  public ydoc: Y.Doc;
  public operations: Y.XmlText;
  public canSaveDataToDbTask: boolean = false;
  private provider: YWebsocketProvider;
  private todoUndoManager: Y.UndoManager;
  private scheduler: Scheduler;

  constructor(roomId: string) {
    this.ydoc = new Y.Doc();

    // 增加数据持久化定时任务
    this.scheduler = new Scheduler();

    // 添加任务
    this.scheduler.addTask({
      roomId, // 房间号
      userInfo: {
        userId: "sixty", // 暂时没有用户系统使用测试
        userName: "sixty", // 暂时没有用户系统使用测试
      },
      intervalInMinutes: 1, // 任务执行间隔，以分钟为单位
      task: () => {
        console.log("定时任务执行，开始执行数据持久化");
        this.saveToDb(roomId);
      },
    });

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
    if (!this.canSaveDataToDbTask) {
      this.canSaveDataToDbTask = true;
      this.scheduler.runAllTasks();
    }
    this.ydoc.on("update", callback);
  }

  async saveToDb(roomId: string) {
    try {
      const documentState = Y.encodeStateAsUpdate(this.ydoc); // is a Uint8Array
      // Transform Uint8Array to a Base64-String
      const base64Encoded = fromUint8Array(documentState);

      await updateContentByGuid(roomId, base64Encoded);
      console.log("文件内容已经更新到数据库", roomId, base64Encoded);
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
