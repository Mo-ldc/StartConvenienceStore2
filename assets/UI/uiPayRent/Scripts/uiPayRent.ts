import { _decorator, Component, Label, Node } from 'cc';
import { WordAni } from 'db://assets/Init/Scripts/AniTool/WordAni';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import GameSetting from 'db://assets/Init/Scripts/Data/Setting/GameSetting';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import { UIMgr, UIName } from 'db://assets/Init/Scripts/Mgr/UIMgr';
import { BaseUI } from 'db://assets/Init/Scripts/UI/Base/BaseUI';
const { ccclass, property } = _decorator;

@ccclass('uiPayRent')
export class uiPayRent extends BaseUI {

    /**交不起按钮 */
    @property({ type: Node, tooltip: '交不起按钮' })
    btnCantPay: Node = null;

    /** 交租按钮 */
    @property({ type: Node, tooltip: '交租按钮' })
    btnPayRent: Node = null;

    /** 房租 */
    @property({ type: Label, tooltip: '房租' })
    rent: Label = null;


    init(): void {
        WordAni.PlayWordAni(this.rent, GameData.PayRent);
        if(GameData.PayRent > GameData.PlayerCoin){
            this.btnCantPay.active = true;
            this.btnPayRent.active = false;
        }else{
            this.btnCantPay.active = false;
            this.btnPayRent.active = true;
        }
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

    /** 点击交租 */
    onClickPayRent() {
        AudioMgr.PlaySound(AudioName.BtnClick)  
        this.hide()
        /** 开始新的一天 */
        // GameData.NewDay()
        // 可以按天数增加房租
        //
        GameData.PlayerCoin -= GameData.PayRent;
        AudioMgr.PlaySound(AudioName.PayCoin);
        GameData.IsDaySettlement = false;
        MessMgr.emit(GameEvent.NewDay);
        MessMgr.emit(GameEvent.UpdateGold);


    }
}


