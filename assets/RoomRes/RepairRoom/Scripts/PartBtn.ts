import { _decorator, Component, EventTouch, Label, Node, Sprite, UITransform } from 'cc';
import { Quality } from 'db://assets/Init/Scripts/Data/Enum/Enum';
import { PartType } from 'db://assets/Init/Scripts/Data/Type/ObjType';
const { ccclass, property } = _decorator;

@ccclass('PartBtn')
export class PartBtn extends Component {

    @property({ type: Sprite, tooltip: '零件图片' })
    spr: Sprite = null;
    /** 零件商品信息文本 */
    @property({ type: Label, tooltip: '零件商品信息文本' })
    public partInfoLabel: Label = null;
    /** 数量文本 */
    @property({ type: Label, tooltip: '数量文本' })
    public numLabel: Label = null;
    /** 零件键值 */
    partKey: string = '';
    /** 零件品质 */
    partQuality: Quality = Quality.低;
    /** 零件类型 */
    partType: PartType = PartType.无;

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


