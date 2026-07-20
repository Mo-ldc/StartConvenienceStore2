import { _decorator, Component, Label, Node, tween, UI, UIOpacity } from 'cc';

import { PoolMgr } from '../Mgr/PoolMgr';
import { BaseUI } from './Base/BaseUI';
const { ccclass, property } = _decorator;

@ccclass('UI_Tip')
export class UI_Tip extends BaseUI {
    tipLabel:Label = null;
    speed: number = 10;
    opacity: UIOpacity = null;
    onLoad() {
        this.tipLabel = this.node.getChildByName("tipLabel").getComponent(Label);
        this.opacity = this.node.getComponent(UIOpacity);
        if (!this.opacity) {
            this.opacity = this.node.addComponent(UIOpacity);
        }
        if (!this.tipLabel) {
            console.error("UI_Tip: 提示文本为空");
        }
    }
    /** 设置提示文本 */
    setTip(str:string) {
        this.tipLabel.string = str;
        this.node.y = -200;
        this.opacity = this.node.getComponent(UIOpacity);
        if (!this.opacity) {
            this.opacity = this.node.addComponent(UIOpacity);
        }
        this.opacity.opacity = 255;
        tween(this.opacity)
            .delay(0.4)
            .to(0.1, { opacity: 0 })
            .start();
        tween(this.node)
            .to(0.5, { y: 0 })
            .call(() => {
                this.reset();
            })
            .start();
    }s
    /** 回收提示 */
    private reset() {
        this.node.parent = null;
        PoolMgr.put(this.node.name, this.node);   
    }

}


