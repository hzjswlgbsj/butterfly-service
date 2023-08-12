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
    let provider = this.providers.get(roomId);

    if (!provider) {
      provider = new WebsocketProvider(roomId);
      await this.add(roomId, provider);

      // TODO:
      // 这里会比较频繁的被触发，不可能实时的保存到数据库中去，这里除了简单
      // 的增加防抖操作外，还可以从这里保存数据到 Redis 中，然后慢慢同步到
      // 数据库，这样做的原因是：
      // 1.yjs是全量数据，即使一个新的用户进入后，也会通过y-websocket拿到最新的数据
      // 2.当并发协同文档数量大的时候内存压力非常大
      provider.onChange(
        (update: Uint8Array, origin: any, doc: Y.Doc, tr: Y.Transaction) => {
          console.log(
            `收到房间 ${roomId} 的数据发生改变`,
            // update,
            origin,
            doc
            // tr
          );

          // origin参数，如果本次操作是自己产生的它的值是一个Symbol(slate-yjs-operation)，如果是接收到其他客户端的值
          // 那它的值是改变产生的那个客户端的 WebsocketProvider实例

          // Transform Uint8Array to a Base64-String
          const base64Encoded = fromUint8Array(update);
          provider!.saveToDb(roomId, base64Encoded);
        }
      );
    }

    return provider;
  }

  public get(roomId: string) {
    if (!roomId) {
      throw new Error("错误的房间号");
    }

    return this.providers.get(roomId);
  }

  public async add(roomId: string, provider: WebsocketProvider) {
    if (!roomId) {
      throw new Error("错误的房间号");
    }

    if (this.providers.has(roomId)) {
      const room = this.providers.get(roomId);
      console.log(`房间${roomId}已存在`, room);
      return room;
    } else {
      // 如果不存在那需要去数据库中获取文档的内容
      const res = await getFiles({
        guid: roomId,
      });

      if (res.data.data && res.data.data.length) {
        const base64Encoded = res.data.data[0].dataValues.content;
        // Transform Base64-String back to an Uint8Array
        const binaryEncoded = toUint8Array(base64Encoded);

        // Applies Uint8Array data to document
        Y.applyUpdate(provider.ydoc, binaryEncoded);
      }

      this.providers.set(roomId, provider);
      return provider;
    }
  }

  public removeProvider(roomId: string) {
    this.providers.delete(roomId);
  }
}

export const roomManager = new WebsocketProviderManager();
