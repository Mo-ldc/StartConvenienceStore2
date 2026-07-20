/** 关卡/天数配置 */
export class LvConfig {
    /** 每天最大订单数 */
    static maxOrdersPerDay: number = 8;
    /** 每天最少订单数 */
    static minOrdersPerDay: number = 4;
    /** 每天起始订单数（后续可随天数增长） */
    static baseOrdersPerDay: number = 5;
}
