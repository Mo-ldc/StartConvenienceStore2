import { _decorator, EventTouch, Node, Rect, Vec2 } from 'cc';
import { PartBase } from './PartBase';
import { PartScrew } from './PartScrew';
import { RepairToolType } from '../../Data/Type/ObjType';
import { MessMgr } from '../../Mgr/MessMgr';
import { GameEvent } from '../../Data/Enum/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('PartMotherboard')
export class PartMotherboard extends PartBase {

    @property({ type: PartScrew, tooltip: '螺丝列表' })
    screws: PartScrew[] = [];

    public init(...args: any[]): void {
        super.init(...args);
        this.needsFix = true;
        for (let i = 0; i < this.screws.length; i++) {
            const screw = this.screws[i];
            if (screw) {
                screw.init(true);
            }
        }
        this.isFixed = true;
    }
    public cloneInit(...args: any[]): void {
        super.cloneInit(...args);
        for (let i = 0; i < this.screws.length; i++) {
            const screw = this.screws[i];
            if (screw) {
                screw.init(false);
            }
        }
        this.isFixed = false;
    }
    

    /** 找到已拧紧的螺丝 */
    private findScrewedScrew(): PartScrew | null {
        return this.screws.find(s => s && s.isScrewed) || null;
    }

    /** 找到未拧紧的螺丝 */
    private findUnscrewedScrew(): PartScrew | null {
        return this.screws.find(s => s && !s.isScrewed) || null;
    }

    protected onTouchEnd(event: EventTouch): void {
        if(this.isCovered){
            return;
        }
        let screw = this.findScrewedScrew();
        if (screw) {
            screw.unscrew();
            let screw2 = this.findScrewedScrew();
            console.error("拧下螺丝", screw.node.name)
            if(!screw2){
                this.isFixed = false;
            }
            return;
        }
        super.onTouchEnd(event);
    }
     /** update */
    protected update(dt: number): void {
        if (!this.isIntersectingTool) return;
        if (!this.isOnPhone()) { this.isIntersectingTool = false; return; }
    }
    protected onCheckToolPartIntersection(data: { worldPosition: Vec2, worldRect: Rect, toolType: RepairToolType }): void {
        if (!this.isOnPhone() || this.isCovered) {
            this.isIntersectingTool = false;
            return;
        }
        this.isIntersectingTool = this.hitTest(data.worldPosition) || this.rectHitTest(data.worldRect);
        if (this.isIntersectingTool) {
            this.currentAppliedTool = data.toolType;
        }
        console.warn("主板", this.node.name, "工具类型:", RepairToolType[data.toolType], "是否相交:", this.isIntersectingTool)
    }
    // ── 工具交互：螺丝工具给主板上螺丝 ──

    protected onPickUpTool(toolType: RepairToolType): void {
        if (toolType === RepairToolType.螺丝 && this.isOnPhone() && !this.isCovered && this.findUnscrewedScrew()) {
            this.showGlowOut();
            return;
        }
        
        super.onPickUpTool(toolType);
    }

    protected onPutDownTool(toolType: RepairToolType): void {
        if(this.isIntersectingTool){
            console.log("主板相交")
        }else{
            console.log("主板不相交")
        }
        if(this.isOnPhone()){
            console.log("主板在手机上")
        }else{
            console.log("主板不在手机上")
        }
        if (toolType === RepairToolType.螺丝 && this.isIntersectingTool && this.isOnPhone()) {
            const screw = this.findUnscrewedScrew();
            if (screw) {
                console.error("拧上:", screw.node.name);
                screw.screw();
                let screw2 = this.findUnscrewedScrew();
                if (!screw2) {
                    this.isFixed = true;
                }
            }
        }
        console.warn("放下:", RepairToolType[toolType]);
        super.onPutDownTool(toolType);
    }

    /**  */

}
