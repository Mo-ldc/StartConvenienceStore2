import { _decorator, Button, Component, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { LoanConfig } from 'db://assets/Init/Scripts/Data/Configs/LoanConfig';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import PlatForm from 'db://assets/Init/Scripts/Tool/PlatForm';
import { BaseUI } from 'db://assets/Init/Scripts/UI/Base/BaseUI';
const { ccclass, property } = _decorator;

@ccclass('uiLoan')
export class uiLoan extends BaseUI {


    /** 贷款节点 */
    @property(Node)
    loanNode: Node = null;

    @property(Prefab)
    LoanPrefab: Prefab = null;

    init(): void {
        this.initLoanNode();    
    }
    /** 初始化贷款节点 */
    private initLoanNode(): void {
        this.loanNode.removeAllChildren();
        const arr = LoanConfig.loanTiers;
        for (let i = 0; i < arr.length; i++) {
            const config = arr[i];
            const saveData = GameData.getLoanRecord(config.loanKey);
            // console.log("贷款记录:", saveData);
            const loanNode = instantiate(this.LoanPrefab);
            this.loanNode.addChild(loanNode);
            const 贷款按钮 = loanNode.getChildByName("贷款按钮");
            const loanKey = config.loanKey;
            const 贷款文本 = loanNode.getChildByName("贷款文本");
            if(贷款文本){
                贷款文本.getComponent(Label).string ="贷款" + config.loanAmount + "金币？";
            }
            /** 是否已经贷款这个档位 */
            const isLoan = saveData.hasLoaned;
            if (贷款按钮) {
                const spr = 贷款按钮.getComponent(Sprite);
                const btn = 贷款按钮.getComponent(Button);
                const ad = 贷款按钮.getChildByName("ad");
                if (spr) {
                    spr.grayscale = isLoan;
                }
                if (btn) {
                    
                    btn.interactable = !isLoan;
                }
                if(ad){
                    ad.active = config.needAd;
                }
                if (isLoan) {
                    贷款按钮.off(Node.EventType.TOUCH_END);
                } else {
                    贷款按钮.on(Node.EventType.TOUCH_END, this.onClickLoan.bind(this, loanKey, 贷款按钮, config.needAd), this);
                }
                
            }
            
        }
    }
    
    /** 点击贷款 */
    private onClickLoan(loanKey: string, btn: Node, needAd: boolean): void {
        // console.log("点击贷款")
        if(!loanKey){
            return;
        }

        AudioMgr.PlaySound(AudioName.BtnClick)
        console.log("点击贷款", loanKey)
        if(needAd){
            PlatForm.getInstance().Ui_Ad_GetReward(()=>{
                this._loan(loanKey, btn);
            });
        }else{
            this._loan(loanKey, btn);
        }
      
    }
    /** 贷款 */
    private _loan(loanKey: string, btn: Node): void {
        MessMgr.emit(GameEvent.ApplyLoan, loanKey)
        this.scheduleOnce(() => {
            if (btn) {
                const spr = btn.getComponent(Sprite);
                const btnCom = btn.getComponent(Button);
                if (spr) {
                    spr.grayscale = true;
                }
                if (btn) {
                    btnCom.interactable = false;
                }
            }
        });
    }


}


