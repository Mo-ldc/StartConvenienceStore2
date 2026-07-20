import { _decorator, Button, Component, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { LoanConfig } from 'db://assets/Init/Scripts/Data/Configs/LoanConfig';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import PlatForm from 'db://assets/Init/Scripts/Tool/PlatForm';
import { BaseUI } from 'db://assets/Init/Scripts/UI/Base/BaseUI';
import { LoanNode } from './LoanNode';
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
            let loanSrc = loanNode.getComponent(LoanNode);
            if(!loanSrc){
                continue;
            }
            loanSrc.init(config);

            /** 是否已经贷款这个档位 */
            const isLoan = saveData.hasLoaned;
            const btn = loanSrc.btn;

            if (btn) {
                const spr = btn.getComponent(Sprite);
                const btnCom = btn.getComponent(Button);
                const ad = loanSrc.adNode;
                if (spr) {
                    spr.grayscale = isLoan;
                }
                if (btnCom) {
                    btnCom.interactable = !isLoan;
                }
                if(ad){
                    ad.active = config.needAd;
                }
                if (isLoan) {
                    btn.off(Node.EventType.TOUCH_END);
                } else {
                    btn.on(Node.EventType.TOUCH_END, this.onClickLoan.bind(this, config.loanKey, loanSrc.btn, config.needAd), this);
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


