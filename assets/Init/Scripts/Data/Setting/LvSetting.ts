import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export class WaveConfig {
    波次数: number = 1;
    是否使用统一等级?: boolean = true;
    等级?: number = 1;

    是否无尽小怪?: boolean = false;
    每波小怪数量?: number = 0;
    小怪等级?: number = 1;

    是否无尽精英怪?: boolean = false;
    每波精英怪数量?: number = 0;
    精英怪等级?: number = 1;

    是否无尽Boss?: boolean = false;
    每波Boss数量?: number = 0;
    Boss等级?: number = 1;
}
export class LvSetting {
 


    //#region 关卡配置

    static 刷新一次消耗金币 = 50;

    //#endregion


}


