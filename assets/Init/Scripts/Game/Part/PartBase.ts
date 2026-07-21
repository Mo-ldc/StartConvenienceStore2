import { _decorator, Collider2D, Color, Component, Enum, EventTouch, Intersection2D, Node, PolygonCollider2D, Rect, sp, Sprite, SpriteFrame, tween, UIOpacity, UITransform, Vec2, Vec3 } from 'cc';
import { PartType, RepairToolType } from '../../Data/Type/ObjType';
import { PartSide } from '../../Data/Enum/Enum';
import { MessMgr } from '../../Mgr/MessMgr';
import { GameEvent } from '../../Data/Enum/GameEvent';
import { Mobile } from '../Mobile';
import { GlowOutline } from '../../../Shader/GlowOutline/GlowOutline';
import { AudioMgr, AudioName } from '../../Mgr/AudioMgr';
const { ccclass, property } = _decorator;
/** 工具作用配置 */
@ccclass('PartToolSet')
class PartToolSet{  
    /** 使用工具 */
    @property({ type: Enum(RepairToolType), tooltip: '使用工具' })
    useTool: RepairToolType = RepairToolType.无;
    
    /** 作用时间 */
    @property({ tooltip: '作用时间' })
    useTime: number = 0;
}

/** 配置图设置 */
@ccclass('PartSpriteSet')
class PartSpriteSet {
    @property({ type: SpriteFrame, displayName: '完好正版图' })
    normalRealSpr: SpriteFrame = null;
    @property({ type: SpriteFrame, displayName: '完好盗版图' })
    dirtyFakeSpr: SpriteFrame = null;

    @property({ type: SpriteFrame, displayName: '故障图' })
    faultSprite: SpriteFrame = null;

}

@ccclass('PartBase')
export class PartBase extends Component {
    /** 初始本地位置 */
    private initLocalPos: Vec3 = new Vec3();
    public getStartLocalPos(): Vec3 {
        return this.initLocalPos.clone();
    }
    public setStartLocalPos(pos: Vec3): void {
        this.initLocalPos = pos.clone();
    }
    /** 所在层级 */
    public layer: number = 0;
    /** 配件类型 */
    @property({ type: Enum(PartType), tooltip: '配件类型' })
    public partType: PartType = PartType.无;

    /** 配件是否故障 */
    public isFault: boolean = false;
    /** 图片精灵组件 */
    public sprite: Sprite = null;

    @property({ type: Node, tooltip: '图片节点' })
    public ani: Node = null;

    @property({ type: PartSpriteSet, tooltip: '图集' })
    public partSpriteSet: PartSpriteSet = null;

    /** 零件真假 */
    public isReal: boolean = true;

    /** 原来的父节点（手机正面/背面），归位时用 */
    public originalParent: Node = null;

    /** 零件所在面 */
    public partSide: PartSide = PartSide.无;

    /** 当前相交的工具类型 */
    protected usingToolType: RepairToolType = RepairToolType.无;
    /** 是否在被操作 */
    public isBeingOperated: boolean = false;

    /** 手机节点引用 */
    public mobileNode: Node = null;
    /** 工作台节点引用 */
    public workbenchNode: Node = null;
    /** Mobile 组件引用 */
    public mobileComp: Mobile = null;
    /** 是否正在被拖拽 */
    protected _isDragging: boolean = false;
    /** 拖拽时的世界坐标偏移 */
    private _dragOffset: Vec3 = new Vec3();

    protected onLoad(): void {
        this.initLocalPos = this.node.position.clone();
        this.sprite = this.ani.getComponent(Sprite);
        this.polygon = this.node.getComponent(PolygonCollider2D);
        this.glowOut = this.ani.getComponent(GlowOutline);
        this.initShader();
        this.registerEvent();
    }

    protected onDestroy(): void {
        this.resetEvent();

    }

    protected update(dt: number): void {
        if (!this.isBeingOperated) return;
        if (!this.isOnPhone()) { return; }
        if (this.getCurrentRequiredTool() !== this.usingToolType) { this.isBeingOperated = false; return; }
        this.addToolTime(dt);
    }

    protected registerEvent() {
        console.log("registerEvent:", this.node.name);
        MessMgr.on(GameEvent.PickUpTool, this.onPickUpTool, this);
        MessMgr.on(GameEvent.PutDownTool, this.onPutDownTool, this);
        MessMgr.on(GameEvent.CheckToolPartIntersection, this.onCheckToolPartIntersection, this);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    protected resetEvent() {
        console.log("resetEvent:", this.node.name);
        MessMgr.off(GameEvent.PickUpTool, this.onPickUpTool, this);
        MessMgr.off(GameEvent.PutDownTool, this.onPutDownTool, this);
        MessMgr.off(GameEvent.CheckToolPartIntersection, this.onCheckToolPartIntersection, this);
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    protected initShader() {
        if (this.glowOut) {
            this.glowOut.outlineWidth = this.outlineWidth;
            this.glowOut.innerWidth = this.innerWidth;
            // this.glowOut.outlineColor = this.outlineColor.clone();

            this.hideGlowOut();
        }else{
            console.log("GlowOutline component not found on node:", this.node.name);
        }
    }

    /** 被盖住的配件 */
    coveredParts: PartBase[] = [];
    public getCoveredParts(): PartBase[] {
        return this.coveredParts.slice();
    }
    public addCoveredPart(part: PartBase) {
        if (this.coveredParts.indexOf(part) === -1) {
            this.coveredParts.push(part);
        }
    }
    /** 是否被盖住 */
    public isCovered: boolean = true;

    /** 是否固定 */
    public isFixed: boolean = false;

    /** 解除固定需要的步骤*/
    @property({type:PartToolSet, tooltip: '解除固定需要的步骤'})
    public unfixToolArr: PartToolSet[] = [];
    /** 固定需要的工具类型 */
    @property({type:PartToolSet, tooltip: '固定需要的工具类型'})
    public fixToolArr: PartToolSet[] = [];

    /** 0=拆卸阶段, 1=装配阶段 */
    public phaseIndex: number = 0;
    /** 当前执行的步骤索引 */
    public currentToolIndex: number = 0;
    /** 工具使用计时 */
    public useTime: number = 0;

    /** 是否离开了手机 */
    public isMobileOpen: boolean = false;
    /** 是否为正品（非假货） */
    public isGenuine: boolean = true;
    /** 是否需要固定操作（有 fixToolArr 开启时自动为 true） */
    @property({ tooltip: '是否需要固定操作' })
    public needsFix: boolean = false;
    /** 多边形碰撞组件  */
    private polygon: PolygonCollider2D = null; // 多边形碰撞组件  */

    // @property({ displayName: '描边颜色' })
    outlineColor: Color = new Color(255, 0, 0, 255);
    // @property({ displayName: '外描边宽度', slide: true, range: [0.0, 0.1, 0.001], tooltip: '向透明区域扩展(UV单位)' })
    outlineWidth: number = 0.0;
    // @property({ displayName: '内描边宽度', slide: true, range: [0.0, 0.1, 0.001], tooltip: '向像素内部侵蚀(UV单位)' })
    innerWidth: number = 0.006;
    /** 外发光组件 */
    private glowOut:GlowOutline = null;

    /** 当前阶段的工具数组 */
    public get currentToolArr(): PartToolSet[] {
        return this.phaseIndex === 0 ? this.unfixToolArr : this.fixToolArr;
    }

    /**
     * 初始化
     * @param args 可变参数，由子类定义具体含义
     */
    public init(...args: any[]) {
        this.phaseIndex = 0;
        this.currentToolIndex = 0;
        this.useTime = 0;
        if (this.fixToolArr.length > 0 && this.fixToolArr[0].useTool !== RepairToolType.无) {
            this.needsFix = true;
        }
        if (this.unfixToolArr.length > 0 && this.unfixToolArr[0].useTool !== RepairToolType.无 && this.needsFix) {
            this.isFixed = true;
        } else {
            this.isFixed = false;
            this.currentToolIndex = this.unfixToolArr.length;
        }
        this.isBeingOperated = false;
    }

    /** 复制后的初始化 */
    public cloneInit(...args: any[]){

    }

    /** 设置原来的父节点（归位时用于换回） */
    public setOriginalParent(parent: Node): void {
        this.originalParent = parent;
    }
    

    /** 检测对方是否和自己重叠（优先多边形碰撞，回退矩形） */
    public checkOverlap(other: PartBase) {
        if (!other || !other.node) return false;

        const selfPoints = this.getPolygonWorldPoints();
        const otherPoints = other.getPolygonWorldPoints();

        if (selfPoints.length > 0 && otherPoints.length > 0) {
            return Intersection2D.polygonPolygon(selfPoints, otherPoints);
        }

        const nodeTrans = this.node.getComponent(UITransform);
        const otherTrans = other.node.getComponent(UITransform);
        if (!nodeTrans || !otherTrans) return false;
        return nodeTrans.getBoundingBoxToWorld().intersects(otherTrans.getBoundingBoxToWorld());
    }

    /** 检测触摸是否命中此配件（供 Mobile 统一遍历使用）
     * @returns 可拖则返回自身，否则 null
     */
    public checkTouchEvent(event: EventTouch): PartBase | null {
        if (this.isFixed || this.isCovered) return null;
        if (this.hitTest(event.getUILocation())) return this;
        return null;
    }

    /** 检测配件是否与手机包围盒相交（即触碰到了手机） */
    public isTouchMobile(mobileNode: Node): boolean {
        const partTransform = this.node.getComponent(UITransform);
        const mobileTransform = mobileNode.getComponent(UITransform);
        if(!partTransform || !mobileTransform){
            return false;
        }
        return mobileTransform.getBoundingBoxToWorld()
            .intersects(partTransform.getBoundingBoxToWorld());
    }

    /** 检测配件是否完全离开了手机 */
    public isLeaveMobile(mobileNode: Node): boolean {
        return !this.isTouchMobile(mobileNode);
    }

    /** 设置配件故障状态，自动切换故障图/完好图 */
    public setFault(fault: boolean): void {
        this.isFault = fault;
        if(!this.sprite){
            if(!this.ani){
                this.node.getChildByName("ani");  
            }
            this.sprite = this.ani?.getComponent(Sprite);
            if(!this.sprite){
                console.log("图片组件未找到：", this.node.name)
                this.sprite = this.node.getComponent(Sprite);
            }
        }
        if (this.sprite) {
            let data = this.partSpriteSet;
            let spr = fault ? data.faultSprite : this.isReal ? data.normalRealSpr : data.dirtyFakeSpr;
            this.sprite.spriteFrame = spr;
            // console.log("setFault:", this.node.name, "fault:", fault, " spriteFrame:", spriteFrame.name);
        }else{
            console.warn("图片组件未找到：", this.node.name)
        }

    }

    /** 当前步骤需要的总时间（秒），无步骤返回 0 */
    public getCurrentStepTime(): number {
        const arr = this.currentToolArr;
        if (this.currentToolIndex >= arr.length) return 0;
        return arr[this.currentToolIndex].useTime;
    }

    /** 获取当前步骤需要的工具类型（无步骤返回无） */
    public getCurrentRequiredTool(): RepairToolType {
        const arr = this.currentToolArr;
        if (this.currentToolIndex >= arr.length) return RepairToolType.无;
        return arr[this.currentToolIndex].useTool;
    }

    /** 当前阶段是否所有步骤已完成 */
    public isCurrentPhaseDone(): boolean {
        return this.currentToolIndex >= this.currentToolArr.length;
    }

    /** 切换到装配阶段 */
    public startFixPhase(): void {
        this.phaseIndex = 1;
        this.currentToolIndex = 0;
        this.useTime = 0;
    }

    /**
     * 累计工具作用时间
     * @returns 本帧是否有步骤推进
     */
    public addToolTime(dt: number): boolean {
        // console.log("addToolTime:", this.node.name);
        const arr = this.currentToolArr;
        if (this.currentToolIndex >= arr.length) return false;
        const step = arr[this.currentToolIndex];
        if (step.useTime <= 0) {
            this.currentToolIndex++;
            this.onStepComplete();
            return true;
        }
        this.useTime += dt;
        if (this.useTime >= step.useTime) {
            this.useTime = 0;
            this.currentToolIndex++;
            this.onStepComplete();
            return true;
        }
        return false;
    }

    /** 单步完成后的处理 */
    private onStepComplete(): void {
        MessMgr.emit(GameEvent.PartStepChanged, this);
        if (this.isCurrentPhaseDone()) {
            if (this.phaseIndex === 0) {
                this.isFixed = false;
            } else {
                this.isFixed = true;
                this.phaseIndex = 0;
                this.currentToolIndex = 0;
                this.useTime = 0;
            }
            AudioMgr.PlaySound(AudioName.StepComplete);
            this.usingToolType = RepairToolType.无;
            this.isBeingOperated = false;
        }
    }


    /** 命中测试：优先多边形，回退矩形 */
    protected hitTest(worldPos: Vec2): boolean {
        if (this.polygon) {
            const points = this.getPolygonWorldPoints();
            return Intersection2D.pointInPolygon(worldPos, points);
        }
        const ui = this.node.getComponent(UITransform);
        return ui ? ui.getBoundingBoxToWorld().contains(worldPos) : false;
    }

    /** 获取多边形世界坐标顶点 */
    private getPolygonWorldPoints(): Vec2[] {
        if (!this.polygon) return [];
        const mat = this.node.worldMatrix;
        const result: Vec2[] = [];
        for (const lp of this.polygon.points) {
            const v = new Vec3(lp.x, lp.y, 0);
            Vec3.transformMat4(v, v, mat);
            result.push(new Vec2(v.x, v.y));
        }
        return result;
    }

    /** 隐藏外发光 */
    public hideGlowOut(): void {
        if (this.glowOut) {
            this.glowOut.outlineWidth = 0;
            this.glowOut.innerWidth = 0;
        }else{
            // console.error("glowOut is null:", this.node.name);
        }
    }
    public showGlowOut(): void {
        if (this.glowOut) {
            this.glowOut.innerWidth = this.innerWidth;
            this.glowOut.outlineWidth = this.outlineWidth;
        }
    }

    public setOpacity(opacity: number, setNode?: Node): void {
        let opNode = setNode || this.node;
        let op = opNode.getComponent(UIOpacity);
        if (!op) {
            op = opNode.addComponent(UIOpacity);
        }
        op.opacity = opacity;
    }
    /** 按下零件 */
    public onPress(): void {
        // console.warn("onPress:", this.node.name);
        this.setOpacity(128);
    }

    /** 松开零件 */
    public onRelease(): void {
        // console.error("onRelease:", this.node.name);
        this.setOpacity(255);
    }
    /** 拾起工具 */
    protected onPickUpTool(toolType: RepairToolType): void {
        if (!this.isOnPhone() || this.isCovered) return;
        if (this.getCurrentRequiredTool() === toolType) {
            this.showGlowOut();
        }
    }
    /** 放下工具 */
    protected onPutDownTool(): void {
        this.hideGlowOut();
        this.isBeingOperated = false;
        this.usingToolType = RepairToolType.无;
    }
    /** 检测工具与零件是否相交 */
    protected onCheckToolPartIntersection(data: { worldPosition: Vec2, worldRect: Rect, toolType: RepairToolType }): void {

        if (!this.isOnPhone() || this.isCovered) {
            this.isBeingOperated = false;
            return;
        }
        if (this.getCurrentRequiredTool() !== data.toolType) {
            this.isBeingOperated = false;
            return;
        }
        let isIntersecting = this.hitTest(data.worldPosition) || this.rectHitTest(data.worldRect);
        if (isIntersecting) {
            this.isBeingOperated = true;
            this.usingToolType = data.toolType;
        }else{
            this.isBeingOperated = false;
            this.usingToolType = RepairToolType.无;
        }
    }

    /** 矩形命中测试：polygon vs rect */
    protected rectHitTest(worldRect: Rect): boolean {
        if (this.polygon) {
            const partPoly = this.getPolygonWorldPoints();
            const rectPoly = [
                new Vec2(worldRect.x, worldRect.y),
                new Vec2(worldRect.x + worldRect.width, worldRect.y),
                new Vec2(worldRect.x + worldRect.width, worldRect.y + worldRect.height),
                new Vec2(worldRect.x, worldRect.y + worldRect.height),
            ];
            return Intersection2D.polygonPolygon(rectPoly, partPoly);
        }
        const ui = this.node.getComponent(UITransform);
        if (!ui) return false;
        return ui.getBoundingBoxToWorld().intersects(worldRect);
    }

    /** 零件是否在手机上（非工作台） */
    public isOnPhone(): boolean {
        return this.originalParent && this.node.parent === this.originalParent;
    }

    /** 设置手机和工作台引用（Mobile 初始化时调用） */
    public setMobileRef(mobile: Node, workbench: Node, mobileComp?: Mobile): void {
        this.mobileNode = mobile;
        this.workbenchNode = workbench;
        if (mobileComp) this.mobileComp = mobileComp;
    }

    // ── 内部拖拽 ──

    protected onTouchStart(event: EventTouch): void {
        if (this.isCovered){
            console.warn(this.node.name, " 被覆盖")
            return;
        };
        if (this.isFixed){
            console.warn(this.node.name, " 被固定")
            return;
        }
        if (!this.isOnPhone() && !this.isMobileOpen){
            console.warn(this.node.name, " 不在手机上")
            return;
        }
        if (!this.hitTest(event.getUILocation())){
            console.warn(this.node.name, " 不在触摸范围内")
            return;
        }

        this._isDragging = true;
        event.propagationStopped = true;
        this.onPress();

        this.node.getPosition(this._dragOffset);
        const worldPos = this.node.worldPosition.clone();
        const wasOnPhone = this.isOnPhone();

        if (this.workbenchNode) {
            this.node.parent = this.workbenchNode;
            this.node.worldPosition = worldPos;
            this.bringSelfToTop();
        }
        this.isMobileOpen = true;

        if (wasOnPhone) {
            MessMgr.emit(GameEvent.PartRemovedFromPhone, this);
        }
    }

    protected onTouchMove(event: EventTouch): void {
        if (!this._isDragging) return;
        event.propagationStopped = true;
        const delta = event.getUIDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
    }

    protected onTouchEnd(event: EventTouch): void {
        if (!this._isDragging) return;
        this._isDragging = false;
        this.onRelease();

        if (this.mobileNode && this.isTouchMobile(this.mobileNode)) {
            if (this.mobileComp && !this.mobileComp.canPlacePart(this)) {
                console.warn(this.node.name, " 同类型零件已在手机上，无法放入");
                return;
            }
            const worldPos = this.node.worldPosition.clone();
            if (this.originalParent && this.originalParent.isValid) {
                this.node.parent = this.originalParent;
                this.node.worldPosition = worldPos;
                const sibCount = this.originalParent.children.length;
                const targetIdx = Math.min(this.layer, sibCount);
                this.node.setSiblingIndex(targetIdx);
            }
            this.isMobileOpen = false;
            MessMgr.emit(GameEvent.PartPlacedOnPhone, this);
            if (this.needsFix) {
                this.startFixPhase();
            }
            tween(this.node)
                .to(0.1, { position: this.initLocalPos })
                .start();
        }
    }

    protected onTouchCancel(event: EventTouch): void {
        if (!this._isDragging) return;
        this._isDragging = false;
        this.onRelease();
    }

    /** 将自己置于父节点最上层 */
    private bringSelfToTop(): void {
        const parent = this.node.parent;
        if (!parent) return;
        this.node.setSiblingIndex(parent.children.length - 1);
    }

    
}
