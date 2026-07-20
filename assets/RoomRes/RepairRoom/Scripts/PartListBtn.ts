import { _decorator, Component, Enum, EventTouch, Node, UITransform } from 'cc';
import { PartType } from 'db://assets/Init/Scripts/Data/Type/ObjType';
const { ccclass, property } = _decorator;
/** 配件列表按钮 */
@ccclass('PartListBtn')
export class PartListBtn extends Component {
   /** 零件类型 */
    @property({ type: Enum(PartType), tooltip: '零件类型' })
    public partType: PartType = PartType.无;
  /** 检测点击位置是否和自己相交 */
    public checkClickPosition(event: EventTouch): boolean {
        const position = event.getUILocation();
        // console.log('检测点击位置是否和自己相交');
        const uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            const rect = uiTransform.getBoundingBoxToWorld();
            return rect.contains(position);
        }
        return false;
    }
}


