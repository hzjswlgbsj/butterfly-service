import * as Y from "yjs";
import WebsocketProvider from "./WebsocketProvider";
import { fromUint8Array, toUint8Array } from "js-base64";
import { getFiles } from "../api/file";
/**
 * TODO:
 * 这里对y - websocket的实例进行了管理，因为使用yjs无法绕开解决冲入需要加载全量数据的问题
 * 所以在这一层需要做不少的处理才能勉强保持性能
 * 1.使用外部数据库存储
 * 2.优化 Y.Doc 数据结构
 * 3.定期清理不活跃的文档
 * 4.使用缓存
 */
class WebsocketProviderManager {
  private providers: Map<string, WebsocketProvider>;

  constructor() {
    this.providers = new Map();
  }

  public async createProvider(roomId: string) {
    try {
      let provider = this.providers.get(roomId);

      if (!provider) {
        provider = new WebsocketProvider(roomId);

        await this.add(roomId, provider);

        provider.onChange(
          (update: Uint8Array, origin: any, doc: Y.Doc, tr: Y.Transaction) => {
            console.log(
              `收到房间 ${roomId} 的数据发生改变`,
              update,
              // origin,
              doc
              // tr
            );

            // origin参数，如果本次操作是自己产生的它的值是一个Symbol(slate-yjs-operation)，如果是接收到其他客户端的值
            // 那它的值是改变产生的那个客户端的 WebsocketProvider实例
            if (typeof origin !== "symbol") {
              // Transform Uint8Array to a Base64-String
              const base64Encoded = fromUint8Array(update);

              console.log("收到改变，增量数据为", base64Encoded);
              // provider!.saveToDb(roomId, base64Encoded);
            }
          }
        );
      }

      return provider;
    } catch (error) {
      console.log("创建provider实例失败", error);
      throw error;
    }
  }

  public get(roomId: string) {
    if (!roomId) {
      throw new Error("错误的房间号");
    }

    return this.providers.get(roomId);
  }

  public all() {
    const rooms = Array.from(this.providers.entries());
    return rooms.map((item) => {
      return {
        [item[0]]: {
          operations: item[1].operations,
          ydoc: item[1].ydoc,
        },
      };
    });
  }

  public async add(roomId: string, provider: WebsocketProvider) {
    if (!roomId) {
      throw new Error("错误的房间号");
    }

    try {
      if (this.providers.has(roomId)) {
        const room = this.providers.get(roomId);
        console.log(`房间${roomId}已存在`, room);
        return room;
      } else {
        this.providers.set(roomId, provider);
      }

      // 去数据库中获取文档的内容
      const res = await getFiles({
        guid: roomId,
      });

      if (res.data.items && res.data.items.length) {
        const base64Encoded = res.data.items[0].dataValues.content;
        // Transform Base64-String back to an Uint8Array
        const binaryEncoded = toUint8Array(base64Encoded);

        console.log("当前文档数据库中的初始值", binaryEncoded);
        if (binaryEncoded.length) {
          // Applies Uint8Array data to document
          Y.applyUpdate(provider.ydoc, binaryEncoded);
        }
      }

      return provider;
    } catch (error) {
      throw error;
    }
  }

  public removeProvider(roomId: string) {
    this.providers.delete(roomId);
  }

  /**
   * 清空所有y-websocket实例，并且清空当前服务器内存中的ydoc缓存数据，不会清空持久化到数据库的数据
   * 注意：执行该操作后因为服务端所有的provider都被销毁了，所以此操作会直接影响客户端的内容显示和操作
   * 但是用户刷新页面后会重新链接并从数据库获取持久化的数据
   */
  public clear() {
    console.log("清空providers");
    this.providers.forEach((provider: WebsocketProvider) => {
      // 清除ydoc的数据
      provider.ydoc.destroy();

      // 销毁y-websocket实例
      provider.destroy();
    });

    // 清空内存中缓存的providers
    this.providers.clear();
  }
}

export const roomManager = new WebsocketProviderManager();
