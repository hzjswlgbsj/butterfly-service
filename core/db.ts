const Sequelize = require("sequelize");
import { ENV } from "../config";
const { dbName, host, port, user, password } = ENV.database;

const sequelize = new Sequelize(dbName, user, password, {
  dialect: "mysql",
  host,
  port,
  logging: false,
  timezone: "+08:00",
  define: {
    // created_at && updated_at
    timestamps: true,
    // delete_time
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    // 把驼峰命名转换为下划线
    underscored: true,
    scopes: {
      bh: {
        attributes: {
          exclude: ["password", "updated_at", "deleted_at", "created_at"],
        },
      },
      iv: {
        attributes: {
          exclude: ["content", "password", "updated_at", "deleted_at"],
        },
      },
    },
  },
});

// 创建模型
sequelize.sync({ force: false });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err: any) => {
    console.error("Unable to connect to the database:", err);
  });

// sequelize.query("CREATE DATABASE IF NOT EXISTS sixty DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci").then(res=>{
//   console.log('CREATE DATABASE SUCCESS!')
// }).catch(err => {
//   console.log('CREATE DATABASE FAIL!', err)
// })

export default sequelize;
