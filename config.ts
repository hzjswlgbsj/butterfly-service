export const PORT = 80;
export const WEBSOCKET_URL = "ws://115.159.58.109:1234";

export const ENV = {
  environment: "dev",
  database: {
    dbName: "butterfly",
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456789",
  },
  security: {
    secretKey: "secretKey",
    // 过期时间 24小时
    expiresIn: 60 * 60 * 24,
  },
};
