import { Enum } from "cc";

/** 对象类型 */
export enum ObjType{
    None = "None",
    
    /** 维修对象 */
    RepairObject = "RepairObject",
    /** 零件对象 */
    PartObject = "PartObject",
    /**商品对象 */
    GoodsObject = "GoodsObject",
}

/** 订单类型  */
export enum OrderType {
    修 = 0,
    买 = 1,
}

/** 部件类型 */
export enum PartType {
    无 = 0,
    后盖 = 1,
    电池 = 2,
    SIM卡 = 3,
    主板 = 4,
    镜头 = 5,
    屏幕 = 6,
    屏幕膜 = 7,
}
Enum(PartType);
/** 修复工具类型 */
export enum RepairToolType {
    /** 无 */
    无 = 0,
    吸盘 = 1,
    刮刀 = 2,
    镊子 = 3,
    烙铁 = 4,
    螺丝 = 5,
    抹布 = 6,
    清洁液 = 7,
    热风枪 = 8,
    毛刷 = 9,
}
Enum(RepairToolType);

/** 商品类型 */
export enum GoodsType {
    无 = 0, 
    手机套 = 1,
    充电宝 = 2,
    充电器 = 3,
    耳机 = 4,
    手机袋 = 5,
    音响 = 6,
    其他 = 7,
}
/** 货物真假 */
export enum GoodsReal {
    真 = 1,
    假 = 0,
}
