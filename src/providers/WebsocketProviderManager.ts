import * as Y from "yjs";
import WebsocketProvider from "./WebsocketProvider";
import { OP } from "../types";

class WebsocketProviderManager {
  private providers: Map<string, WebsocketProvider>;

  constructor() {
    this.providers = new Map();
  }

  public createProvider(roomId: string) {
    const provider = new WebsocketProvider(roomId);
    this.add(roomId, provider);

    provider.onChange((event: Y.YEvent<any>[], transaction: Y.Transaction) => {
      console.log(
        `收到房间 ${roomId} 的数据发生改变`,
        event
        // transaction
      );
    });

    return provider;
  }

  public get(roomId: string) {
    if (!roomId) {
      throw new Error("错误的房间号");
    }

    return this.providers.get(roomId);
  }

  public add(roomId: string, provider: WebsocketProvider) {
    if (!roomId) {
      throw new Error("错误的房间号");
    }

    const room = this.providers.get(roomId);

    if (room) {
      console.log(`房间${roomId}已存在`, room);
      return room;
    } else {
      this.providers.set(roomId, provider);
      return provider;
    }
  }

  public removeProvider(roomId: string) {
    this.providers.delete(roomId);
  }
}

export const roomManager = new WebsocketProviderManager();
