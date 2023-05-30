import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket"; // 这个包的类型有问题
import { nanoid } from "nanoid";
import { Awareness } from "y-protocols/awareness.js";
import { generateRandomColor } from "./util";
import { WEBSOCKET_URL } from "./config";

export class YjsClient {
  roomId: string;
  ydoc: Y.Doc;
  provider: WebsocketProvider;
  yTodoItems: Y.Array<any>;
  todoUndoManager: Y.UndoManager;
  awareness: Awareness;

  constructor(roomId: string, username: string) {
    this.roomId = roomId;
    this.ydoc = new Y.Doc();

    this.provider = new WebsocketProvider(
      WEBSOCKET_URL,
      this.roomId,
      this.ydoc
    );

    this.awareness = this.provider.awareness;
    this.awareness.setLocalState({
      user: {
        name: username,
        color: generateRandomColor(),
      },
      cursor: {
        x: undefined,
        y: undefined,
      },
    });

    this.yTodoItems = this.ydoc.getArray("todoItems");
    this.todoUndoManager = new Y.UndoManager(this.yTodoItems);
  }

  // 更新光标位置信息
  updateCursor(x: number | undefined, y: number | undefined) {
    this.awareness.setLocalStateField("cursor", { x, y });
  }

  onAwarenessChange(callback: (state: any) => void) {
    this.awareness.on("change", (changed: any, origin: any) => {
      if (origin === "local") return; // 自己的操作不触发回调
      callback(this.awareness.getStates() as any);
    });
  }

  // 监听 todoItems 变化
  onItemsChange(
    callback: (event: Y.YArrayEvent<any>, transaction: Y.Transaction) => void
  ) {
    this.yTodoItems.observe(callback);
  }

  addItem(text: string) {
    this.yTodoItems.unshift([
      {
        id: nanoid(),
        text,
        done: false,
      },
    ]);
  }

  deleteItem(index: number) {
    this.yTodoItems.delete(index, 1);
  }

  toggleTodoItemDone(index: number) {
    // 下面的写法无法触发 observe
    // const item = this.yTodoItems.get(index);
    // item.done = !item.done;

    // 下面的写法可以触发 observe
    const item = this.yTodoItems.get(index);
    this.yTodoItems.delete(index, 1);
    this.yTodoItems.insert(index, [
      {
        id: item.id,
        text: item.text,
        done: !item.done,
      },
    ]);
    // 或者可以用嵌套 Map 的写法
  }

  deleteAllItems() {
    this.yTodoItems.delete(0, this.yTodoItems.length);
  }

  undo() {
    this.todoUndoManager.undo();
  }

  redo() {
    this.todoUndoManager.redo();
  }
  // getTodoItems() {
  //   return this.yTodoItems.toArray();
  // }

  destroy() {
    this.provider.disconnect();
  }
}
