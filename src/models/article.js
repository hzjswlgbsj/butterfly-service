const moment = require('moment');
const { sequelize } = require('../../core/db')
const { Model, DataTypes } = require('sequelize')
const { Category } = require('./category')
// 定义文章模型
class Article extends Model {
}

// 初始文章模型
Article.init({
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '文章主键ID'
  },
  title: {
    type: DataTypes.STRING(128),
    allowNull: false,
    comment: '文章标题'
  },
  introduction: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '文章简介'
  },
  cover_picture: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '文章封面图'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '文章内容'
  },
  nickname: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '作者昵称'
  },
  tag_ids: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '标签id集合'
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '发表地点'
  },
  views: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
    defaultValue: 0,
    comment: '文章浏览次数'
  },
  category_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
    comment: '关联分类ID'
  },
  status: {
    type: DataTypes.INTEGER(2).UNSIGNED,
    allowNull: false,
    comment: '文章状态，1-正常  0-异常'
  },
  music_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: true,
    comment: '网易云音乐的id'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '更新时间',
    get() {
      return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '创建时间',
    get() {
      return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  sequelize,
  modelName: 'article',
  tableName: 'article'
})

module.exports = {
  Article
}
