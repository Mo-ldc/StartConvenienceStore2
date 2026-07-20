import { Enum } from "cc";

export enum GameEvent {
    /** 切换房间 */
    ChangeRoom = "ChangeRoom",
    /** 跳转到零件商店-指定零件 */
    JumpToPartShop = "JumpToPartShop",

    /** 房间UI激活 */
    RoomUIActive = "RoomUIActive",
    /** 更新金币 */
    UpdateGold = "UpdateGold",
    /** 更新贷款 */
    UpdateLoan = "UpdateLoan",

    /** 申请贷款 */
    ApplyLoan = "ApplyLoan",

    /** 更新对象数量 */
    UpdateObjectCount = "UpdateObjectCount",
    /** 玩家出价 */
    PlayerBid = "PlayerBid",
    /** 改变出价显示 */
    UpdatePriceLabel = "UpdatePriceLabel",

    /** 接受订单 */
    AcceptOrder = "AcceptOrder",

    /** 订单更新 */
    UpdateOrder = "UpdateOrder",
    /** 完成订单 */
    OrderCompleted = "OrderCompleted",
    /** 订单拒绝 */
    OrderRejected = "OrderRejected",

    /** 刷新角色 */
    RefreshRole = "RefreshRole",
    /** 结算判断 */
    SettlementJudge = "SettlementJudge",

    /** 开启新的一天 */
    NewDay = "NewDay",


    /** 房间创建手机 */
    RoomCreateMobile = "RoomCreateMobile",

    /** 手机移动到维修间 */
    MobileMoveToRepairRoom = "MobileMoveToRepairRoom",
    /** 手机移动到前台 */
    MobileMoveToLobbyRoom = "MobileMoveToLobbyRoom",

    /** 拿起工具 */
    PickUpTool = "PickUpTool",
    /** 放下工具 */
    PutDownTool = "PutDownTool",
    /** 检测工具是否和零件相交 */
    CheckToolPartIntersection = "CheckToolPartIntersection",
    /** 零件步骤推进 */
    PartStepChanged = "PartStepChanged",

    /** 零件从手机移出 */
    PartRemovedFromPhone = "PartRemovedFromPhone",
    /** 零件放入手机 */
    PartPlacedOnPhone = "PartPlacedOnPhone",
    /** NPC出价结果 */
    NpcBidResult = "NpcBidResult",
    /** 金币飞行动画 */
    GoldFly = "GoldFly",
}
Enum(GameEvent);
