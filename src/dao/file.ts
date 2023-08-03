import { LinValidator } from "../../core/lin-validator-v2";

const { Op } = require("sequelize");

const { Article } = require("../models/article");
const { Category } = require("../models/category");
const { Comment } = require("../models/comment");
const { Admin } = require("../models/admin");
const { isArray, unique } = require("../lib/utils");

// 定义文件模型
export default class FileDao {
  // 添加一个文件
  static async add(v: LinValidator) {
    // 检测是否存在文章
    const title = v.get("body.title");
    const hasArticle = await Article.findOne({
      where: {
        title,
        deleted_at: null,
      },
    });

    // 如果存在，抛出存在信息
    if (hasArticle) {
      throw new (global as any).errs.Existing("文章已存在");
    }

    // 创建文章
    const article = new Article();

    article.title = title;
    article.introduction = v.get("body.introduction");
    article.cover_picture = v.get("body.cover_picture");
    article.content = v.get("body.content");
    article.nickname = v.get("body.nickname");
    article.tag_ids = v.get("body.tag_ids");
    article.music_id = v.get("body.music_id");
    article.category_id = v.get("body.category_id");

    try {
      const res = await article.save();
      return [null, res];
    } catch (err) {
      console.log(err);
      return [err, null];
    }
  }
}
