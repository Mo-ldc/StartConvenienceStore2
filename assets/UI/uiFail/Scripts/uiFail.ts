import { _decorator, Node } from 'cc';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
import { LoanConfig } from 'db://assets/Init/Scripts/Data/Configs/LoanConfig';
import { ShopConfig } from 'db://assets/Init/Scripts/Data/Configs/ShopConfig';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import GameSetting from 'db://assets/Init/Scripts/Data/Setting/GameSetting';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import PlatForm from 'db://assets/Init/Scripts/Tool/PlatForm';
import { BaseUI } from 'db://assets/Init/Scripts/UI/Base/BaseUI';
const { ccclass, property } = _decorator;

@ccclass('uiFail')
export class uiFail extends BaseUI {
    @property(Node)
    btnRebirth: Node = null;

    @property(Node)
    btnRevive: Node = null;

    /** 点击复活（看广告）：跳过房租结算，重置金币到初始值，直接开始新的一天（天数不重置），解锁的假货零件不重置，贷款重置 */
    onClickRevive() {
        AudioMgr.PlaySound(AudioName.BtnClick);
        PlatForm.getInstance().Ui_Ad_GetReward(() => {
            GameData.IsDaySettlement = false;
            GameData.PlayerCoin = GameSetting.PlayerCoin;
            GameData.PlayerOrderNum = 0;
            GameData.PlayerLoan = 0;
            GameData.TodayIncome = 0;
            GameData.TodayExpend = 0;
            GameData.TodayLoan = 0;
            for (const tier of LoanConfig.loanTiers) {
                GameData.clearLoanRecord(tier.loanKey);
            }
            MessMgr.emit(GameEvent.NewDay);
            MessMgr.emit(GameEvent.UpdateGold);
            this.hide();
        });
    }

    /** 点击重生：天数重置，解锁的假货/商品重置，金币重置，贷款重置 */
    onClickRebirth() {
        AudioMgr.PlaySound(AudioName.BtnClick);

        GameData.GameDay = 0;
        GameData.PlayerCoin = GameSetting.PlayerCoin;
        GameData.PlayerLoan = 0;
        GameData.PlayerOrderNum = 0;
        GameData.PayRent = 0;
        GameData.IsDaySettlement = false;
        GameData.TodayIncome = 0;
        GameData.TodayExpend = 0;
        GameData.TodayLoan = 0;

        for (const tier of LoanConfig.loanTiers) {
            GameData.clearLoanRecord(tier.loanKey);
        }

        for (const partList of ShopConfig.shopPartList) {
            for (const item of partList.shopListData) {
                GameData.setObjectStorageData(item.shopKey, { count: 0, isUnlocked: false });
            }
        }
        for (const goodsList of ShopConfig.shopGoodsList) {
            for (const item of goodsList.shopListData) {
                GameData.setObjectStorageData(item.shopKey, { count: 0, isUnlocked: false });
            }
        }

        MessMgr.emit(GameEvent.NewDay);
        MessMgr.emit(GameEvent.UpdateGold);
        this.hide();
    }
}


