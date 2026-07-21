import { _decorator, Label, Node } from 'cc';
import { WordAni } from 'db://assets/Init/Scripts/AniTool/WordAni';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { CtrMgr } from 'db://assets/Init/Scripts/Mgr/CtrMgr';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import { UIMgr, UIName } from 'db://assets/Init/Scripts/Mgr/UIMgr';
import { BaseUI } from 'db://assets/Init/Scripts/UI/Base/BaseUI';
const { ccclass, property } = _decorator;

@ccclass('uiResult')
export class uiResult extends BaseUI {
    @property({type: Label, tooltip: '今天支出文本'})
    todayExpend: Label = null;
    @property({type: Label, tooltip: '今天收入文本'})
    todayIncome: Label = null;
    @property({type: Label, tooltip: '今天还债文本'})
    todayRepay: Label = null;
    /** 今日房租 */
    @property({type: Label, tooltip: '今日房租文本'})
    todayRent: Label = null;

    @property({type: Label, tooltip: '今天利润文本'})
    todayProfit: Label = null;
    @property({type: Label, tooltip: '开点天数文本'})
    openDay: Label = null;

    @property({type: Label, tooltip: '剩余金额文本'})
    remainAmount: Label = null;

    /** 结算节点 */
    @property({type: Node, tooltip: '结算节点'})    
    resultNode: Node = null;
    /** 付不起节点 */
    @property({type: Node, tooltip: '付不起节点'})
    cantPayNode: Node = null;

    init(): void {
        this.initText();
        const ctrLoan = CtrMgr.getInstance().ctrLoan;
        const repayTotal = ctrLoan ? ctrLoan.getTodayRepayTotal() : 0;
        let 利润 = GameData.TodayExpend - GameData.TodayIncome - GameData.PayRent;

        let 剩余金额 = GameData.PlayerCoin - GameData.PayRent;
        let showData = [
            { label: this.todayExpend, str: GameData.TodayExpend },
            { label: this.todayIncome, str: GameData.TodayIncome },
            { label: this.todayRepay, str: repayTotal },
            { label: this.todayRent, str: GameData.PayRent },
            { label: this.todayProfit, str: 利润 },
        ]
        let timeDelay = 0.5
        for (let i = 0; i < showData.length; i++) {
            const element = showData[i];
            this.scheduleOnce(() => {
                this.showText(element.label, element.str);
            }, i * timeDelay);
        }
        this.scheduleOnce(() => {
            this.showText(this.remainAmount, 剩余金额);
            if(剩余金额 >= 0){
                this.resultNode.active = true;
            }else{
                this.cantPayNode.active = true;
            }

        }, showData.length * timeDelay + 1);
    }

    private initText(): void {
        if (this.todayExpend) this.todayExpend.string = "0";
        if (this.todayIncome) this.todayIncome.string = "0";
        if (this.todayRepay) this.todayRepay.string = "0";
        if (this.todayProfit) this.todayProfit.string = "0";
        if (this.openDay) this.openDay.string = "开店第" + GameData.GameDay + "天:";
        if (this.remainAmount) this.remainAmount.string = "0";
        if (this.resultNode) this.resultNode.active = false;
        if (this.cantPayNode) this.cantPayNode.active = false;
    }

    private showText(label: Label, str: number): void {
        WordAni.PlayWordAni(label, str);
    }

    onClickResult(): void {
        AudioMgr.PlaySound(AudioName.BtnClick);
        CtrMgr.getInstance().ctrLoan?.repayTodayLoan();
        this.hide();
        /** 开始新的一天 */
        // GameData.NewDay()
        // 可以按天数增加房租
        //
        GameData.PlayerCoin -= GameData.PayRent;
        AudioMgr.PlaySound(AudioName.PayCoin);
        MessMgr.emit(GameEvent.NewDay);
        MessMgr.emit(GameEvent.UpdateGold);
    }

    /** 点击交不起 */
    onClickCantPay() {
        AudioMgr.PlaySound(AudioName.BtnClick)
        this.hide()
        
        /** 显示失败界面 */
        // UIMgr.getInstance().showPage(UIName.uiResult);
    
        // 没有失败界面 先临时这样
        // 目前从新开始 清除所有数据
        // GameData.PlayerCoin = GameSetting.PlayerCoin;
        // GameData.PlayerOrderNum = 0;
        // GameData.IsDaySettlement = false;
        // GameData.GameDay = 0;
        // GameData.PayRent = 1000;
        // MessMgr.emit(GameEvent.NewDay);
        // MessMgr.emit(GameEvent.UpdateGold);
        UIMgr.getInstance().showPage(UIName.uiFail);
    }

}


