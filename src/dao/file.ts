import { LinValidator } from "../../core/lin-validator-v2";
import FileModel from "../models/file";
import { FileGetReq } from "../types/api";
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
   * @param id 文件的id
   * @param v 参数对象
   * @returns
   */
  static async update(id: number, v: LinValidator): Promise<[unknown, any]> {
    // 查询文章
    const file: any = await FileModel.findOne({ where: { id } });

    if (!file) {
      throw new (global as any).errs.NotFound("没有找到相关文件");
    }

    const name = v.get("body.name");
    const content = v.get("body.content");
    const fields: any = {};

    if (name) {
      fields.name = name;
    }

    if (content) {
      fields.content = content;
    }

    try {
      const res = await file.update(fields);
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  static async get(params: FileGetReq) {
    const { id, type, limit = 10, page = 1 } = params;

    // 筛选方式
    const filter: FileGetReq = {};

    // 筛选方式：指定id
    if (id) {
      filter.id = id;
    }

    // 筛选方式：文件类型
    if (type) {
      filter.type = type;
    }

    try {
      const file = await FileModel.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        where: {
          ...filter,
          deleted_at: null,
        },
        order: [["created_at", "DESC"]],
      });

      let rows = file.rows;

      const data = {
        data: rows,
        // 分页信息
        meta: {
          current_page: page,
          per_page: limit,
          count: file.count,
          total: file.count,
          total_pages: Math.ceil(file.count / limit),
        },
      };

      return [null, data];
    } catch (err) {
      return [err, null];
    }
  }
}
