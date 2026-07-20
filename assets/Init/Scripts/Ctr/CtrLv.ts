import { _decorator } from 'cc';
import { CtrBase } from './CtrBase';
import { GameData } from '../Data/Data/GameData';
import { GameEvent } from '../Data/Enum/GameEvent';
import { MessMgr } from '../Mgr/MessMgr';
import { CtrMgr } from '../Mgr/CtrMgr';
import { OrderModel } from '../Data/Model/OrderModel';
import { OrderConfig } from '../Data/Configs/OrderConfig';
import { PlotConfig } from '../Data/Configs/PlotConfig';
import GameSetting from '../Data/Setting/GameSetting';
import { UIMgr, UIName } from '../Mgr/UIMgr';
const { ccclass } = _decorator;

@ccclass('CtrLv')
export class CtrLv extends CtrBase {
    /** 当前订单 */
    private curOrder: OrderModel = null;

    registerEvent(): void {
        MessMgr.on(GameEvent.PlayerBid, this.onPlayerBid, this);
        console.log("注册 CtrLv 事件");
        MessMgr.on(GameEvent.SettlementJudge, this.onSettlementJudge, this);
        MessMgr.on(GameEvent.NewDay, this.onNewDay, this);
        
    }
    resetEvent(): void {
        MessMgr.off(GameEvent.PlayerBid, this.onPlayerBid, this);
        console.log("取消 CtrLv 事件");
        MessMgr.off(GameEvent.SettlementJudge, this.onSettlementJudge, this);
        MessMgr.off(GameEvent.NewDay, this.onNewDay, this);
    }

    init(...args: any[]): void {
        this.calculateRent();
    }

    /** 初始化当前订单（随机配置 + 随机对话） */
    private initOrder(): void {

        this.curOrder = new OrderModel();
        const orderConfig = OrderConfig.random();
        // console.log("随机订单:", orderConfig);
        this.curOrder.orderKey = orderConfig.orderKey;
        this.curOrder.orderType = orderConfig.orderType;
        this.curOrder.orderPriceReference = orderConfig.orderPrice;
        this.curOrder.orderPriceDecided = orderConfig.orderPrice;
        this.curOrder.quality = orderConfig.quality ?? 0;
        this.curOrder.partType = orderConfig.partType ?? 0;

        this.curOrder.knowledge = this.randomRange(0, 3);
        this.curOrder.wealth = this.randomRange(0, 3);
        this.curOrder.patience = this.randomRange(0, 3);
        this.curOrder.mobileKey = orderConfig.mobileKey;

        // 根据零件类型生成请求对话
        this.curOrder.demandDialogue = PlotConfig.getRequestDialogue(this.curOrder.partType);
        this.curOrder.completeDialogue = PlotConfig.getPhaseDialogue("complete");
        this.curOrder.rejectDialogue = PlotConfig.getPhaseDialogue("reject");
        this.curOrder.acceptDialogue = PlotConfig.getPhaseDialogue("accept");
        this.curOrder.bargainDialogue = PlotConfig.getPhaseDialogue("bargain");
        
    }
    /** 计算当天租金 */
    public calculateRent() {
        let startRent = GameSetting.PlayerRent;
        let rent = startRent + Math.abs(GameData.GameDay - 1) * GameSetting.RentIncrement;
        GameData.PayRent = rent;
    }

    /** 计算当前玩家的天数所能获得的最大订单数 */
    public getMaxOrderNum(): number {
        /** 最小天数 + 每2天+1单，最大订单数 */
        const startNum = GameSetting.OrderStartNum;
        const maxNum = Math.min(startNum + Math.floor(GameData.GameDay / 2), GameSetting.OrderMaxNum);

        return maxNum;
    }
    /** 订单结算判断 */
    private onSettlementJudge(): void {
        console.error("进行订单结算判断");
        
        
        // TODO: 订单结算判断
        
        let max = this.getMaxOrderNum();
        console.log("最大订单数:", max, "当前订单数:", GameData.PlayerOrderNum);
        if(GameData.PlayerOrderNum >= max){
            // 进入结算
            console.warn("进入结算： 玩家订单数", GameData.PlayerOrderNum, ">=", max);
            
            UIMgr.getInstance().showPage(UIName.uiResult);
            GameData.IsDaySettlement = true;
        }else{
            console.log("继续生成订单： 玩家订单数", GameData.PlayerOrderNum, "<", max);
            this.initOrder();
            MessMgr.emit(GameEvent.RefreshRole);
        }
    }
    public onNewDay(): void {

        GameData.GameDay = GameData.GameDay + 1;
        this.calculateRent();
        this.initOrder();
        MessMgr.emit(GameEvent.RefreshRole);
        console.warn("开始新的一天:", GameData.GameDay);
        GameData.PlayerOrderNum = 0;
    }

    /** 获取当前订单 */
    public getCurrentOrder(): OrderModel {
        return this.curOrder;
    }


    //#region 天数管理


    public startNewDay(): void {
        GameData.GameDay = GameData.GameDay + 1;
        CtrMgr.getInstance().ctrLoan?.settleDay(GameData.GameDay);
        this.initOrder();
    }

    //#endregion

    //#region 订单管理

    /** 玩家出价 → NPC 根据财富/耐心属性评估 */
    private onPlayerBid(price: number): void {
        if (!this.curOrder) return;

        // wealth: 0→只能接受参考价, 1→150%, 2→200%, 3→250%
        const wealthMult = 1 + (this.curOrder.wealth ?? 0) * 0.5;
        const maxAccept = this.curOrder.orderPriceReference * wealthMult;

        // patience: 0→不砍价, 1→1次, 2→2次, 3→3次
        const maxBargains = this.curOrder.patience ?? 0;
        this.curOrder.bargainCount = (this.curOrder.bargainCount ?? 0) + 1;

        if (price <= maxAccept) {
            this.curOrder.orderPriceDecided = price;
            MessMgr.emit(GameEvent.UpdatePriceLabel, price);
            MessMgr.emit(GameEvent.NpcBidResult, {
                result: 'accept', price: price,
                message: '对方接受了这个价格！',
            });
        } else if (this.curOrder.bargainCount <= maxBargains) {
            MessMgr.emit(GameEvent.NpcBidResult, {
                result: 'reject', price: price,
                message: `对方拒绝，还能还价${maxBargains - this.curOrder.bargainCount + 1}次`,
            });
            // 维持原价
            MessMgr.emit(GameEvent.UpdatePriceLabel, this.curOrder.orderPriceDecided);
        } else {
            MessMgr.emit(GameEvent.NpcBidResult, {
                result: 'final_reject', price: price,
                message: '对方拒绝且不再接受出价',
            });
        }
    }

    //#endregion

    private randomRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
