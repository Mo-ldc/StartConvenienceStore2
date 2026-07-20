import { _decorator, Component, Label, Node } from 'cc';
import { BaseUI } from 'db://assets/Init/Scripts/UI/Base/BaseUI';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import { BtnNum } from './BtnNum';
const { ccclass, property } = _decorator;

@ccclass('uiBid')
export class uiBid extends BaseUI {
    /** 出价文本 */
    @property(Label)
    priceLabel: Label = null;
    /** 当前输入的文本 */
    curInput: string = "";

    /** 按钮数组 */
    @property({ type: [BtnNum] })
    btnArray: BtnNum[] = [];
    protected registerEvent(): void {
        super.registerEvent();
         for (let i = 0; i < this.btnArray.length; i++) {
            const btn = this.btnArray[i];
            if(!btn) continue;
            btn.setLabel();
            btn.btnNode?.on(Node.EventType.TOUCH_END, this.onButtonInput.bind(this, btn));
        }
    }
    protected removeEvent(): void {
        super.removeEvent();
        for (let i = 0; i < this.btnArray.length; i++) {
            const btn = this.btnArray[i];
            if(!btn) continue;
            btn.btnNode?.off(Node.EventType.TOUCH_END);
        }
    }

    init(): void {
        super.init();
        this.priceLabel.string = "0";
        this.curInput = "0";

       
    }

    /** 按钮输入 */
    private onButtonInput(btn: BtnNum) {
        let custom = btn.node.name;
        console.log("按钮输入:", custom);
        if (custom === "c") {
            this.curInput = "0";
            this.priceLabel.string = "0";
            return;
        }
        if (custom === "end") {
            const price = parseInt(this.curInput) || 0;
            this.hide();
            console.log("出价：", price);
            MessMgr.emit(GameEvent.PlayerBid, price);
            return;
        }
        if (this.curInput === "0") {
            if (custom === "0") return;
            this.curInput = custom;
        } else {
            this.curInput += custom;
        }
        this.priceLabel.string = this.curInput;
    }
}


