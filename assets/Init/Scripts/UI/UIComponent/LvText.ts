import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { BaseUIComponent } from './BaseUIComponent';
import { UIShowType } from '../../Enum/TypeEnum';

const { ccclass, property } = _decorator;

@ccclass('LvText')
export class LvText extends BaseUIComponent {
    @property(Label)
    public 等级文本:Label = null;
    public 血条UI:BaseUIComponent
    /** 显示UI */
    show(_跟随节点: Node, _同步位置节点: Node, _UIShowType: UIShowType, _显示时间?: number): void {
        super.show(_跟随节点, _同步位置节点, _UIShowType, _显示时间);
        console.log("显示UI：", this.node.name,
            " UIShowType: ", _UIShowType,
            " 显示时间: ", _显示时间,
            " 同步位置节点: ", _同步位置节点.name,
            " 跟随节点: ", _跟随节点.name,
        );
    }
    /** 更新组件内容 */
    upDataContent(str: string): void {
        this.等级文本.string = str;
    }
    /** 更新位置 */
    upDataPos(): void {
        if (this.同步位置节点 && this.node.parent) {
            // console.log("更新血条位置：", this.跟随节点.name);
            let pos = this.同步位置节点.worldPosition.clone();
            pos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(pos);
            if(this.血条UI && this.血条UI.node.active && this.血条UI.跟随节点 == this.跟随节点){
                pos.y += 16;
            }
            this.node.setPosition(pos);
        }
    }
}


