import { _decorator } from 'cc';
import { CtrBase } from './CtrBase';
import { LoanConfig } from '../Data/Configs/LoanConfig';
import { GameData } from '../Data/Data/GameData';
import { GameEvent } from '../Data/Enum/GameEvent';
import { MessMgr } from '../Mgr/MessMgr';
import { LoanRecordData } from '../Data/Data/SaveData';
import { AudioMgr, AudioName } from '../Mgr/AudioMgr';
const { ccclass } = _decorator;

/**
 * 贷款控制器
 *
 * 职责：
 * - 提供贷款接口（分3档，每档可自主设置是否需要广告及广告次数）
 * - 每个档位每个游戏天只能贷一次
 * - 每个档位以「档位键」为存储键单独缓存记录【是否已贷 / 广告次数 / 是否已还】，跨天自动清空
 * - 日结偿还入口预留（settleDay），具体偿还逻辑后续实现
 */
@ccclass('CtrLoan')
export class CtrLoan extends CtrBase {
    registerEvent(): void {
        MessMgr.on(GameEvent.ApplyLoan, this.requestLoan, this);
    }
    unregisterEvent(): void {
        MessMgr.off(GameEvent.ApplyLoan, this.requestLoan, this);
    }
    init(...args: any[]): void {
        this.syncFromData();
    }

    /** 跨天检测：新的一天则清空所有档位缓存 */
    private syncFromData(): void {
        const day = GameData.GameDay;
        if (GameData.LoanDay !== day) {
            this.resetDay(day);
        }
    }

    /** 读取某档位缓存记录（键即档位键） */
    private getRecord(loanKey: string): LoanRecordData {
        return GameData.getLoanRecord(loanKey);
    }

    /** 写入某档位缓存记录 */
    private setRecord(loanKey: string, record: LoanRecordData): void {
        GameData.setLoanRecord(loanKey, record);
    }

    /**
     * 观看一次广告：累加并缓存广告次数
     * @param loanKey 档位键
     * @returns 当前已观看广告次数
     */
    public watchAd(loanKey: string): number {
        const cfg = LoanConfig.getTier(loanKey);
        if (!cfg) {
            console.warn("CtrLoan: 未找到贷款档位 " + loanKey);
            return 0;
        }
        const record = this.getRecord(loanKey);
        if (record.hasLoaned) return record.adCount;
        record.adCount++;
        this.setRecord(loanKey, record);
        return record.adCount;
    }

    /** 已观看广告次数 */
    public getAdCount(loanKey: string): number {
        return this.getRecord(loanKey).adCount;
    }


    /** 某档今天是否已贷 */
    public isLoaned(loanKey: string): boolean {
        return this.getRecord(loanKey).hasLoaned;
    }

    /** 某档今天是否已还 */
    public isRepaid(loanKey: string): boolean {
        return this.getRecord(loanKey).hasRepaid;
    }



    /**
     * 申请贷款
     * needAd 的档位需先通过 watchAd 看够广告，再调用此方法
     * @param loanKey 档位键
     * @returns 实际到账金额，失败返回 0
     */
    public requestLoan(loanKey: string): number {
        const cfg = LoanConfig.getTier(loanKey);
        if (!cfg) {
            console.warn("CtrLoan: 未找到贷款档位 " + loanKey);
            return 0;
        }
        const saveData = this.getRecord(loanKey);
        if (saveData.hasLoaned) {
            console.warn("CtrLoan: 该档位今天不可贷 已贷过 " + loanKey);
            return 0;
        }

        // 到账 + 累计负债
        GameData.PlayerCoin += cfg.loanAmount;
        GameData.PlayerLoan += cfg.loanAmount;
        GameData.TodayLoan += cfg.loanAmount;
        AudioMgr.PlaySound(AudioName.ReceiveCoin);

        // 标记已贷并缓存
        const record = this.getRecord(loanKey);
        record.hasLoaned = true;
        this.setRecord(loanKey, record);

        MessMgr.emit(GameEvent.UpdateGold);
        MessMgr.emit(GameEvent.UpdateLoan, GameData.PlayerLoan);
        return cfg.loanAmount;
    }

    /** 今天已贷款的档位键列表 */
    public getTodayLoans(): string[] {
        const arr: string[] = [];
        for (let i = 0; i < LoanConfig.loanTiers.length; i++) {
            const key = LoanConfig.loanTiers[i].loanKey;
            if (this.getRecord(key).hasLoaned) arr.push(key);
        }
        return arr;
    }

    /** 今天已贷款总额 */
    public getTodayBorrowed(): number {
        let sum = 0;
        for (let i = 0; i < LoanConfig.loanTiers.length; i++) {
            const cfg = LoanConfig.loanTiers[i];
            if (this.getRecord(cfg.loanKey).hasLoaned) sum += cfg.loanAmount;
        }
        return sum;
    }

    /** 今日应还款总额（本金+利息） */
    public getTodayRepayTotal(): number {
        let sum = 0;
        for (let i = 0; i < LoanConfig.loanTiers.length; i++) {
            const cfg = LoanConfig.loanTiers[i];
            if (this.getRecord(cfg.loanKey).hasLoaned) {
                sum += cfg.loanAmount + Math.round(cfg.loanAmount * cfg.loanRate);
            }
        }
        return sum;
    }

    /** 偿还今日贷款（本金+利息），扣除 PlayerCoin 并清零 TodayLoan */
    public repayTodayLoan(): number {
        const total = this.getTodayRepayTotal();
        if (total <= 0) return 0;
        GameData.PlayerCoin -= total;
        GameData.PlayerLoan -= GameData.TodayLoan;
        GameData.TodayLoan = 0;
        for (let i = 0; i < LoanConfig.loanTiers.length; i++) {
            const record = this.getRecord(LoanConfig.loanTiers[i].loanKey);
            record.hasRepaid = true;
            this.setRecord(LoanConfig.loanTiers[i].loanKey, record);
        }
        return total;
    }

    /** 当前总负债 */
    public getTotalLoan(): number {
        return GameData.PlayerLoan;
    }

    /**
     * 日结：偿还并重置当天贷款缓存
     * @param newDay 新的游戏天数
     * TODO: 偿还逻辑（利息/扣款/逾期，设置 hasRepaid）后续实现
     */
    public settleDay(newDay: number): void {
        // TODO: 在此实现偿还逻辑
        this.resetDay(newDay);
    }

    /** 重置当天所有档位缓存 */
    private resetDay(day: number): void {
        for (let i = 0; i < LoanConfig.loanTiers.length; i++) {
            GameData.clearLoanRecord(LoanConfig.loanTiers[i].loanKey);
        }
        GameData.LoanDay = day;
    }
}
