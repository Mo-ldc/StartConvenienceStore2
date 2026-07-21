import { _decorator, Component, Enum, EventTouch, Node, SpriteFrame, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { RepairToolType } from '../Data/Type/ObjType';
import { AudioMgr, AudioName } from '../Mgr/AudioMgr';
const { ccclass, property } = _decorator;
/**
 * 修复工具
 */
@ccclass('RepairTool')
export class RepairTool extends Component {
    /** 初始世界坐标位置 */
    private initPosition: Vec3 = new Vec3();

    @property({ type: Enum(RepairToolType), tooltip: '工具类型' })
    public toolType: RepairToolType = RepairToolType.无;

    /** 自身是否移动 */
    @property({ tooltip: '自身是否移动' })
    public isSelfMove: boolean = true;
    /** 拖拽的时候显示的图片 */
    @property({ type: SpriteFrame, tooltip: '拖拽的时候显示的图片'})
    public dragShowSpriteFrame: SpriteFrame = null;

    /** 动画节点 */
    @property({ type: Node, tooltip: '动画节点' })
    public animationNode: Node = null;

    /** 使用工具声音 */
    @property({ type: Enum(AudioName), tooltip: '使用工具声音' })
    public useToolSound: AudioName = AudioName.None;


    /** 是否与零件相交 */
    public isIntersectingPart: boolean = false;
    /** 当步骤是否完成 */
    public isStepComplete: boolean = false;

    /** 是否正在播放音效 */
    private isPlayingSound: boolean = false;

    protected onLoad(): void {
        this.initPosition = this.node.position.clone();
        console.log('初始化世界坐标位置', this.initPosition.toString());
        this.hideAnimation();
    }

    /** 拖拽的时候展示的 */
    public dragShow(){
        // console.log('拖拽的时候展示的');
        this.isIntersectingPart = false;
        this.isStepComplete = false;
        this.setOpacity(255);
        // AudioMgr.PlaySound(AudioName.PickPart)
        tween(this.node)
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'bounceOut' })
            .start();
    }

    /** 回归原位 */
    public backToInitPosition(){
        // console.log('回归原位');
        this.setOpacity(255);
        tween(this.node)
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start();
        tween(this.node)
            .to(0.2, { position: this.initPosition })
            .start();
    }
    /** 显示动画 */
    public showAnimation(worldPosition?: Vec3){
        if (this.animationNode) {
            this.setOpacity(0);
            this.animationNode.active = true;
            if (worldPosition) {
                this.animationNode.setWorldPosition(worldPosition);
            }
        }
    }
    public setOpacity(opacity: number){
        let uiOP = this.node.getComponent(UIOpacity);
        if(!uiOP){
            uiOP = this.node.addComponent(UIOpacity);
        }
        uiOP.opacity = opacity;
    }
    /** 隐藏动画 */
    public hideAnimation(){
        // console.log('隐藏动画');
        this.setOpacity(255);
        if (this.animationNode) {
            this.animationNode.active = false;
        }
    }

    /** 播放对应的声音 */
    public playSound(){
        if(!this.isPlayingSound && this.useToolSound != AudioName.None){
            AudioMgr.PlaySound(this.useToolSound, null,true);
            this.isPlayingSound = true;
        }
    }
    public stopSound(){
        if(this.useToolSound != AudioName.None){
            AudioMgr.StopOneSound(this.useToolSound);
        }
        this.isPlayingSound = false;
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


