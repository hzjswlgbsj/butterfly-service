import basicAuth from "basic-auth";
import jwt from "jsonwebtoken";

export class Auth {
  public level: number;
  public static USER: number;
  public static ADMIN: number;
  public static SPUSER_ADMIN: number;
  constructor(level: number) {
    this.level = level || 1;
    Auth.USER = 8;
    Auth.ADMIN = 16;
    Auth.SPUSER_ADMIN = 32;
  }

  get m() {
    // token 检测
    // token 开发者 传递令牌
    // token body header
    // HTTP 规定 身份验证机制 HttpBasicAuth
    return async (ctx: any, next: any) => {
      const tokenToken = basicAuth(ctx.req);

      let errMsg = "无效的token";
      // 无带token
      if (!tokenToken || !tokenToken.name) {
        errMsg = "需要携带token值";
        throw new (global as any).errs.Forbidden(errMsg);
      }

      try {
        const decode: any = jwt.verify(
          tokenToken.name,
          (global as any).config.security.secretKey
        );
        if (decode.scope < this.level) {
          errMsg = "权限不足";
          throw new (global as any).errs.Forbidden(errMsg);
        }

        ctx.auth = {
          uid: decode.uid,
          scope: decode.scope,
        };

        await next();
      } catch (error: any) {
        // token 不合法 过期
        if (error.name === "TokenExpiredError") {
          errMsg = "token已过期";
        }

        throw new (global as any).errs.Forbidden(errMsg);
      }
    };
  }
}
