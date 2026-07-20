import { Gender, Quality } from "../Enum/Enum";
import { OrderState } from "../State/State";
import { GoodsType, OrderType, PartType } from "../Type/ObjType";

/** 订单数据  */
export class OrderConfigData {
    /** 订单键  */
    orderKey: string = "";
    /** 订单类型  */
    orderType: OrderType = OrderType.修;
    /** 品质 */
    quality?: Quality = Quality.低;
    /** 毁坏零件 */
    partType?: PartType = PartType.无;
    /** 订单参考价格 */
    orderPrice: number = 0;
    /** 手机键 */
    mobileKey: string = "";
}



/** 角色数据  */
export class RoleConfigData{
    /** 角色键  */
    roleKey: string = "";
    /** 角色名称  */
    roleName?: string = "";
    /** 性别  */
    sex?: Gender = Gender.男;
}
/** 剧情数据 */
export class PlotConfigData{
    /** 剧情键  */
    plotKey: string = "";
    /** 订单内容  */
    订单内容?: string = "";
    /** 接下订单后对话 */
    接下订单?: string = "";
    /** 拒绝订单后对话 */
    拒绝订单?: string = "";
    /** 完成订单后对话 */
    完成订单?: string = "";
}
export class MobileConfigData {
    /** 手机键  */
    mobileKey: string = "";
    /** 手机资源键  */
    mobileResKey?: string = "";
    /** 手机名称  */
    mobileName?: string = "";
    /** 品质 */
    quality:Quality = Quality.低;
}
/** 对象音频数据 */
export class ObjAudioConfigData {
    /** 对象键 */
    objKey: string = "";
    /** 角色进场 */
}

/** 商品数据 */
export class ShopConfigData {
    /** 商品键  */
    shopKey: string = "";
    /** 商品类型  */
    shopType?: GoodsType = GoodsType.无;
    /** 配件类型 */
    partType?: PartType = PartType.无;

    /** 品质 */
    quality?: Quality = Quality.低;
    /** 商品资源键  */
    shopResKey?: string = "";
    /** 商品名称  */
    shopName: string = "";

    /** 商品价格  */
    shopPrice: number = 0;
    /** 真货假货？ */
    isReal: boolean = true;
    /** 是否锁 */
    isLock: boolean = false;
}

/** 商店列表数据 */
export class ShopListConfigData {
    /** 商店列表键  */
    shopListName: string = "";
    /** 零件类型 */
    partType?: PartType = PartType.无;
    /** 商店列表数据  */
    shopListData: ShopConfigData[] = [];
}

/** 贷款档位数据 */
export class LoanConfigData {
    /** 贷款档位键 */
    loanKey: string = "";
    /** 贷款金额 */
    loanAmount: number = 0;
    /** 利率 */
    loanRate: number = 0;
    /** 是否需要看广告 */
    needAd: boolean = false;
}
/** 价格文本数据 */
export class TalkConfigData {

    /** 价格文本键  */
    talkKey: string = "";
    /** 文本内容  */
    talkContent: string = "";
    /** 性别 */
    sex?: Gender = Gender.男;
    /** 私有参数 */
    num?: number = 0;
}


