import { OrderType, PartType } from "../Type/ObjType";

/**
 * 订单模型
 */
export class OrderModel{
    /** 订单ID */
    orderId: number = 0;
    /** 订单键值 */
    orderKey: string = "";
    /** 订单类型 */
    orderType: OrderType = OrderType.修;
    /** 损毁零件类型 */
    partType: PartType = PartType.无;

    /** 订单品质 */
    quality: number = 0;
    /** 角色属性 */
    /** 知识 整数，0的时候完全无法看出你给的假货 ，1=15%概率，2=50%概率，3=100%概率 */
    knowledge:number = 0;
    /** 财富 整数，0=只能接受参考金额，1=能接受参考金额的150%，2=能接受参考金额的200%，3=能接受参考金额的250% */
    wealth:number = 0;
    /** 耐心 整数，0= 不接受砍价，1=接受1次，2=接受2次，3=接受3次 */
    patience:number = 0;
    /** 当前砍价次数 */
    bargainCount:number = 0;

    /** 订单参考价格 */
    orderPriceReference: number = 0;    
    /** 当前订单决定价格 */
    orderPriceDecided: number = 0;

    /** 客人名字 */
    
    guestName: string = "";
    /** 需求对话 */
    demandDialogue: string = "";
    /** 完成对话 */
    completeDialogue: string = "";
    /** 被拒绝对话 */
    rejectDialogue: string = "";
    /** 被接受对话 */
    acceptDialogue: string = "";

    /** 砍价对话 */
    bargainDialogue: string = "";

    /** 手机键 */
    mobileKey: string = "";
}


