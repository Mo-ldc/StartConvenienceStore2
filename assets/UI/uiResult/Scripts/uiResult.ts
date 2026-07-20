import { _decorator, Component, Node } from 'cc';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { UIMgr, UIName } from 'db://assets/Init/Scripts/Mgr/UIMgr';
import { BaseUI } from 'db://assets/Init/Scripts/UI/Base/BaseUI';
const { ccclass, property } = _decorator;

@ccclass('uiResult')
export class uiResult extends BaseUI {
    
    init(): void {
        
    }


    /** 点击结算 */
    onClickResult(): void {
        AudioMgr.PlaySound(AudioName.BtnClick);
        this.hide();


        UIMgr.getInstance().showPage(UIName.uiPayRent);
    }
}


