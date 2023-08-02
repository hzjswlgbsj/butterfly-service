const { Op } = require('sequelize')
const { Tag } = require('../models/tag')

class TagDao {
  // 创建标签
  static async create(params = {}) {
    const {
      name,
      color = '#7B68EE',
    } = params
    // 查询是否存在重复的标签
    const hasTag = await Tag.findOne({
      where: {
        name,
        deleted_at: null
      }
    });

    if (hasTag) {
      throw new global.errs.Existing('该标签已存在');
    }

    const tag = new Tag();
    tag.name = name
    tag.color = color

    try {
      const res = await tag.save();
      return [null, res]
    } catch (err) {
      return [err, null]
    }
  }

  // 删除标签
  static async delete(id) {
    // 查询标签
    const tag = await Tag.findOne({
      where: {
        id,
        deleted_at: null
      }
    });

    if (!tag) {
      throw new global.errs.NotFound('没有找到相关标签');
    }

    try {
      const res = await tag.destroy()
      return [null, res]
    } catch (err) {
      return [err, null]
    }
  }

  // 获取标签详情
  static async detail(id) {
    try {
      const tag = await Tag.scope('bh').findOne({
        where: {
          id,
          deleted_at: null
        }
      });

      if (!tag) {
        throw new global.errs.NotFound('没有找到相关标签');
      }

      return [null, tag]
    } catch (err) {
      return [err, null]
    }
  }

  // 更新标签
  static async update(id, v) {
    const tag = await Tag.findByPk(id);

    if (!tag) {
      throw new global.errs.NotFound('没有找到相关标签');
    }

    tag.name = v.get('body.name');
    tag.color = v.get('body.color');

    try {
      const res = await tag.save();
      return [null, res]
    } catch (err) {
      return [err, null]
    }
  }

  // 标签列表
  static async list(params = {}) {
    const { color, keyword, limit = 5, page = 1 } = params;
    // 筛选方式
    let filter = {
      deleted_at: null
    };

    // 筛选方式：存在分类ID
    if (color) {
      filter.color = color;
    }

    // 筛选方式：存在搜索关键字
    if (keyword) {
      filter.name = {
        [Op.like]: `%${keyword}%`
      };
    }

    try {
      const tag = await Tag.findAndCountAll({
        limit, //每页10条
        offset: (page - 1) * limit,
        where: filter,
        order: [
          ['created_at', 'DESC']
        ]
      });

      let rows = tag.rows

      if (Array.isArray(rows) && rows.length > 0) {
        rows.sort((a, b) => b.sort_order - a.sort_order)
      }

      const data = {
        data: rows,
        // 分页
        meta: {
          current_page: parseInt(page),
          per_page: limit,
          count: tag.count,
          total: tag.count,
          total_pages: Math.ceil(tag.count / limit),
        }
      }

      return [null, data]
    } catch (err) {
      return [err, null]
    }
  }
}

module.exports = {
  TagDao
}
