import { LinValidator } from "../../core/lin-validator-v2";
import FileModel from "../models/file";
import { FileEditParams, FileEditReq, FileGetReq } from "../types/api";
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
    const file = FileModel.build();
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
  /**
   *
   * @params id FileEditParams
   * @returns
   */
  static async update(params: FileEditParams): Promise<[unknown, any]> {
    // 查询文章
    let file: any;
    if (params.id) {
      file = await FileModel.findOne({ where: { id: params.id } });
    }

    if (params.guid) {
      file = await FileModel.findOne({ where: { guid: params.guid } });
    }

    if (!file) {
      throw new (global as any).errs.NotFound("没有找到相关文件");
    }

    const fields: FileEditReq = {};

    if (params.name) {
      fields.name = params.name;
    }

    if (params.content) {
      fields.content = params.content;
    }

    try {
      const res = await file.update(fields);
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  static async get(params: FileGetReq): Promise<any> {
    const { id, guid, type, limit = 10, page = 1 } = params;

    // 筛选方式
    const filter: FileGetReq = {};

    // 筛选方式：指定guid
    if (guid) {
      filter.guid = guid;
    }
    // 筛选方式：指定id
    if (id) {
      filter.id = id;
    }

    // 筛选方式：文件类型
    if (type) {
      filter.type = type;
    }

    const { count, rows } = await FileModel.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      where: {
        ...filter,
        deleted_at: null,
      },
      // attributes: [
      //   "id",
      //   "name",
      //   "type",
      //   "content",
      //   "guid",
      //   "created_at",
      //   "updated_at",
      // ],
      order: [["created_at", "DESC"]],
    });

    const data = {
      items: rows,
      total: count,
    };

    return data;
  }
}
