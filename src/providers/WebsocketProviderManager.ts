import * as Y from "yjs";
import WebsocketProvider from "./WebsocketProvider";
import { fromUint8Array, toUint8Array } from "js-base64";

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

  public createProvider(roomId: string) {
    let provider = this.providers.get(roomId);
    if (!provider) {
      provider = new WebsocketProvider(roomId);
      this.add(roomId, provider);

      // TODO:
      // 这里会比较频繁的被触发，不可能实时的保存到数据库中去，这里除了简单
      // 的增加防抖操作外，还可以从这里保存数据到 Redis 中，然后慢慢同步到
      // 数据库，这样做的原因是：
      // 1.yjs是全量数据，即使一个新的用户进入后，也会通过y-websocket拿到最新的数据
      // 2.当并发协同文档数量大的时候内存压力非常大
      provider.onChange(
        (event: Y.YEvent<Y.XmlText>[], transaction: Y.Transaction) => {
          console.log(
            `收到房间 ${roomId} 的数据发生改变`
            // event
            // transaction
          );

          // 将数据转化为base64后持久化，https://docs.yjs.dev/api/document-updates#example-base64-encoding
          const documentState = Y.encodeStateAsUpdate(provider!.ydoc); // is a Uint8Array

          // Transform Uint8Array to a Base64-String
          const base64Encoded = fromUint8Array(documentState);

          // Transform Base64-String back to an Uint8Array
          // const binaryEncoded = toUint8Array(base64Encoded);

          // Applies Uint8Array data to document
          // Y.applyUpdateV2(ydoc, binaryEncoded);

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
