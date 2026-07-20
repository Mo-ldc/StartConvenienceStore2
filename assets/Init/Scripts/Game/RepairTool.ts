import { _decorator, Component, Enum, EventTouch, Node, SpriteFrame, tween, UITransform, Vec3 } from 'cc';
import { RepairToolType } from '../Data/Type/ObjType';
const { ccclass, property } = _decorator;
/**
 * 修复工具
 */
@ccclass('RepairTool')
export class RepairTool extends Component {
    /** 初始世界坐标位置 */
    private initWorldPosition: Vec3 = new Vec3();

    @property({ type: Enum(RepairToolType), tooltip: '工具类型' })
    public toolType: RepairToolType = RepairToolType.无;

    /** 自身是否移动 */
    @property({ tooltip: '自身是否移动' })
    public isSelfMove: boolean = true;
    /** 拖拽的时候显示的图片 */
    @property({ type: SpriteFrame, tooltip: '拖拽的时候显示的图片'})
    public dragShowSpriteFrame: SpriteFrame = null;


    protected onLoad(): void {
        this.initWorldPosition = this.node.worldPosition.clone();
    }

    /** 拖拽的时候展示的 */
    public dragShow(){
        // console.log('拖拽的时候展示的');
    }

    /** 回归原位 */
    public backToInitPosition(){
        // console.log('回归原位');
        tween(this.node)
            .to(0.2, { worldPosition: this.initWorldPosition })
            .start();
    }

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


