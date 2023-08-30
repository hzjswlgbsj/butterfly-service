import moment from "moment";
import { Model, DataTypes } from "sequelize";
import sequelize from "../../core/db";

// 定义文件模型
class FileModel extends Model {
  // public name: string = "";
  // public type: string = "";
  // public guid: string = "";
  // public content: string = "";
}

// 初始文章模型
FileModel.init(
  {
    id: {
      type: DataTypes.INTEGER().UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: "文件主键ID",
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: "文章标题",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "文件类型",
    },
    guid: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "文件唯一标识",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "文件内容",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "更新时间",
      get() {
        return moment(this.getDataValue("created_at")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "创建时间",
      get() {
        return moment(this.getDataValue("updated_at")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "作者、创建者",
    },
    updater: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "最新更新者",
    },
  },
  {
    sequelize,
    modelName: "file",
    tableName: "file",
  }
);

export default FileModel;
