import { _decorator, Label } from 'cc';
import PlatForm from 'db://assets/Init/Scripts/Tool/PlatForm';
import { BaseUI } from 'db://assets/Init/Scripts/UI/Base/BaseUI';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import { UIMgr, UIName } from 'db://assets/Init/Scripts/Mgr/UIMgr';
import { WordAni } from 'db://assets/Init/Scripts/AniTool/WordAni';
const { ccclass, property } = _decorator;

@ccclass('uiPenalty')
export class uiPenalty extends BaseUI {
    @property({ type: Label, tooltip: '罚款金额文本' })
    penaltyLabel: Label = null;

    init(): void {
        const amount = GameData.PenaltyAmount;
        if (this.penaltyLabel) {
            WordAni.PlayWordAni(this.penaltyLabel, amount);
        }
    }

    onClickConfirm() {
        const amount = GameData.PenaltyAmount;
        GameData.PlayerCoin -= amount;
        GameData.IsPenalty = false;
        GameData.PenaltyAmount = 0;
        this.hide();
        MessMgr.emit(GameEvent.UpdateGold);
        if (GameData.PlayerCoin < 0) {
            UIMgr.getInstance().showPage(UIName.uiFail);
        } else {
            MessMgr.emit(GameEvent.PenaltyResolved);
        }
    }

    onClickExempt() {
        PlatForm.getInstance().Ui_Ad_GetReward(() => {
            GameData.IsPenalty = false;
            GameData.PenaltyAmount = 0;
            this.hide();
            MessMgr.emit(GameEvent.PenaltyResolved);
        });
    }
}
