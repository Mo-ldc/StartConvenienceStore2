import { Enum } from "cc";
/** 角色动画类型 */
export enum RoleAniType {
    /** 空闲 */
    Idle = 0,
    /** 跑 */
    Run = 1,
    /** 攻击 */
    Attack = 2,
    /** 死亡 */
    Die = 3,
    /** 蓄力 */
    LPower = 4,
    /** 冲锋 */
    Charge = 5,
}
Enum(RoleAniType)

/** 角色状态机 */
export enum RoleState {
    /** 空闲 */
    Idle = 0,
    /** 跑 */
    Run = 1,
    /** 攻击 */
    Attack = 2,
    /** 死亡 */
    Die = 3,
    /** 受击 */
    Hit = 4,
    /** 受控（眩晕/击退等） */
    Controlled = 5,
}
