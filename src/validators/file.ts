import { Rule, LinValidator } from "../../core/lin-validator-v2";

export default class FileValidator extends LinValidator {
  public name: Rule[];
  constructor() {
    super();
    this.name = [new Rule("isLength", "文件名不能为空", { min: 1 })];
  }
}
