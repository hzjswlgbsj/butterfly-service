import { LinValidator } from "../../core/lin-validator-v2";
import FileModel from "../models/file";
import { setParam } from "../util";

// 定义文件模型
export default class FileDao {
  // 添加一个文件
  static async add(v: LinValidator): Promise<[unknown, any]> {
    // 检测是否存在文章
    const name = v.get("body.name");
    const hasFile = await FileModel.findOne({
      where: { name, deleted_at: null },
    });

    // 如果存在，抛出存在信息
    if (hasFile) {
      throw new (global as any).errs.Existing("文件名重复");
    }

    // 创建文章
    const file = new FileModel();
    const keys: string[] = ["name", "guid", "content", "type"];
    setParam(file, v, keys);
    try {
      const res = await file.save();
      return [null, res];
    } catch (err: unknown) {
      console.log(err);
      return [err, null];
    }
  }
}
