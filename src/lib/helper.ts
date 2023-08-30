export default class Resolve {
  fail(err: any, msg = "操作失败", errorCode = 10001) {
    return {
      msg,
      err,
      errorCode,
      state: -1,
    };
  }

  success(msg = "success", errorCode = 0, code = 200) {
    return {
      msg,
      code,
      errorCode,
    };
  }

  json(data: any, msg = "success", errorCode = 0, code = 200) {
    return {
      code,
      msg,
      data,
      state: 1,
    };
  }
}
