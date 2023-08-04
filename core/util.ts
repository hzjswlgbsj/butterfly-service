import jwt from "jsonwebtoken";
/***
 *
 */
export const findMembers = function (instance: any, options: any) {
  const { prefix, specifiedType, filter } = options;
  // 递归函数
  function _find(instance: any): any {
    //基线条件（跳出递归）
    if (instance.__proto__ === null) return [];

    let names = Reflect.ownKeys(instance);
    names = names.filter((name: symbol | string) => {
      // 过滤掉不满足条件的属性或方法名
      return _shouldKeep(name);
    });

    return [...names, ..._find(instance.__proto__)];
  }

  function _shouldKeep(value: any) {
    if (filter) {
      if (filter(value)) {
        return true;
      }
    }
    if (prefix) if (value.startsWith(prefix)) return true;
    if (specifiedType)
      if (instance[value] instanceof specifiedType) return true;
  }

  return _find(instance);
};

// 颁布令牌
export const generateToken = function (uid: string, scope: string) {
  const secretKey = (global as any).config.security.secretKey;
  const expiresIn = (global as any).config.security.expiresIn;
  const token = jwt.sign(
    {
      uid,
      scope,
    },
    secretKey,
    {
      expiresIn: expiresIn,
    }
  );
  return token;
};
