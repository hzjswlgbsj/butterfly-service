import { Rule, LinValidator } from "../../core/lin-validator-v2";

export class RoomIdValidator extends LinValidator {
  public roomId: Rule[];

  constructor() {
    super();
    this.roomId = [new Rule("isLength", "房间号不能为空", { min: 1 })];
  }
}
