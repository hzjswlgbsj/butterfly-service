const moment = require('moment');

const { sequelize } = require('../../core/db')
const { Model, DataTypes } = require('sequelize')

// 定义文章模型
class Tag extends Model {

}

// 初始分类模型
Tag.init({
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    comment: '分类主键ID'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '分类名称'
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '#7B68EE',
    comment: "标签颜色",
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '创建时间',
    get() {
      return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '更新时间',
    get() {
      return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '删除时间',
    get() {
      return moment(this.getDataValue('deleted_at')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  sequelize,
  modelName: 'tag',
  tableName: 'tag'
})

module.exports = {
  Tag
}
