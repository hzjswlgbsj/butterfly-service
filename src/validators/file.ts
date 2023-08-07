import { Rule, LinValidator } from "../../core/lin-validator-v2";

export class FileAddValidator extends LinValidator {
  public name: Rule[];
  public type: Rule[];
  public guid: Rule[];

  constructor() {
    super();
    this.name = [new Rule("isLength", "文件名不能为空", { min: 1 })];
    this.type = [new Rule("isLength", "文件名不能为空", { min: 1 })];
    this.guid = [new Rule("isLength", "文件名不能为空", { min: 1 })];
  }
}

export class PositiveIdParamsValidator extends LinValidator {
  public id: Rule[];

  constructor() {
    super();
    this.id = [new Rule("isInt", "文章ID需要正整数", { min: 1 })];
  }
}
