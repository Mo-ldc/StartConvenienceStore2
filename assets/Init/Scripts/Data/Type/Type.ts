import { Enum } from "cc";

/** 动画类型 */
export enum AniType {
    /** 无动画 */
    None = 0,
    /** 内置动画 */
    BuiltIn = 1,
    /** Spine动画 */
    Spine = 2,
}
Enum(AniType);

/** UI显示类型 */
export enum UIShowType {
    /** 无UI */
    None = 0,
    /** 短暂显示 */
    Brief = 1,
    /** 永久显示 */
    Permanent = 2,
}
/** 操作类型 */
export enum OperType {
    无操作 = 0,
    点击 = 1,
    滑动 = 2,
    悬停 = 3,
}



