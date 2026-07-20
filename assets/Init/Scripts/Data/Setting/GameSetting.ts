import { _decorator, Component } from "cc";
import { EditorGroupData } from "../Data/Data";
const { ccclass, property } = _decorator;

/** 游戏设置 */
@ccclass('GameSetting')
export default class GameSetting extends Component{
   //#region 编辑界面参数 角色数据
    static 刚体数据组: EditorGroupData = { groupID: "1", groupLayer: Infinity };
    static 基础数据组: EditorGroupData = { groupID: "2", groupLayer: 1 };
    static UI数据组: EditorGroupData = { groupID: "3", groupLayer: 3 };
    static 攻击类型组: EditorGroupData = { groupID: "4", groupLayer: 2 };
    static 动画数据组: EditorGroupData = { groupID: "5", groupLayer: 4 };
    //#endregion

    //#region 玩家基础初始数据
    /** 初始体力 */
    static PlayerEnergy: number = 30;
    /** 最大体力 */
    static PlayerMaxEnergy: number = 30;
    /** 一次关卡消耗体力 */
    static PlayerEnergyCost: number = 5;
    /** 一次广告获得体力 */
    static PlayerEnergyAd: number = 10;
    /** 一次分享获得体力 */
    static PlayerEnergyShare: number = 5;

    /** 初始货币 */
    static PlayerCoin: number = 5000;
    /** 初始星级 */
    static PlayerStar: number = 0;

    /** 回复体力设置 */
    static EnergyRecoverSet = {
        recoverTime: 360,// 单位s
        recoverAmount: 1// 单位
    }


    /** 初始房租 */
    static PlayerRent: number = 1000;

    /** 房租递增 1天 */
    static RentIncrement: number = 500;

    /** 初始订单数 */
    static OrderStartNum: number = 5;
    /** 极限订单数 */
    static OrderMaxNum: number = 10;
    /** 订单数递增 2天 + 1单 */
    static OrderIncrement: number = 1;

}


