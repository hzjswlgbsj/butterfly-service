import { Rule, LinValidator } from "../../core/lin-validator-v2";

export class ArticleValidator extends LinValidator {
  constructor() {
    super();
    this.title = [new Rule("isLength", "文章标题 title 不能为空", { min: 1 })];
    this.introduction = [
      new Rule("isLength", "文章简介 introduction 不能为空", { min: 1 }),
    ];
    this.nickname = [
      new Rule("isLength", "文章作者 nickname 不能为空", { min: 1 }),
    ];
    this.cover_picture = [
      new Rule("isLength", "文章封面 cover_picture 不能为空", { min: 1 }),
    ];
    this.content = [
      new Rule("isLength", "文章内容 content 不能为空", { min: 1 }),
    ];
  }
}
