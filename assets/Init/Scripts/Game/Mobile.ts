import { _decorator, Component, EventTouch, Node, UITransform, Vec3 } from 'cc';
import { PartBase } from './Part/PartBase';
import { PartSide } from '../Data/Enum/Enum';
import { MobileConfigData } from '../Data/Data/ConfigData';
import { PartType, RepairToolType } from '../Data/Type/ObjType';
import { MessMgr } from '../Mgr/MessMgr';
import { GameEvent } from '../Data/Enum/GameEvent';
import { AudioMgr, AudioName } from '../Mgr/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Mobile')
export class Mobile extends Component {
    @property({ type: Node, tooltip: '正面' })
    front: Node = null;
    @property({ type: Node, tooltip: '背面' })
    back: Node = null;
    workbench: Node = null;

    frontParts: PartBase[] = [];
    backParts: PartBase[] = [];

    /** PartType → 当前在手机上的零件（每种一个） */
    partSlotMap: Map<PartType, PartBase> = new Map();
    /** 损坏的零件类型集合 */
    damagedPartTypes: Set<PartType> = new Set();

    isFront: boolean = true;
    clickCount: number = 0;
    clickTime: number = 0;
    clickCountToFlip: number = 2;
    clickInterval: number = 0.2;

    private isHitMobile: boolean = false;
    public mobileInfo: MobileConfigData = null;
    
    /** 是否已经显示已经完成 */
    public isComplete: boolean = false;

    protected onLoad(): void {
        this.initParts();
    }
    protected onEnable(): void {
        this.registerEvent();
    }
    protected onDisable(): void {
        this.resetEvent();
    }
    /** 注册事件监听 */
    registerEvent(): void {
        console.warn("手机注册事件监听");
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        MessMgr.on(GameEvent.PartRemovedFromPhone, this.onPartRemoved, this);
        MessMgr.on(GameEvent.PartPlacedOnPhone, this.onPartPlaced, this);
    }

    resetEvent(): void {
        console.warn("手机取消事件监听");
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        MessMgr.off(GameEvent.PartRemovedFromPhone, this.onPartRemoved, this);
        MessMgr.off(GameEvent.PartPlacedOnPhone, this.onPartPlaced, this);
    }


    protected initParts() {
        this.frontParts = this._initParts(this.front.children, this.front, PartSide.正面);
        this.backParts = this._initParts(this.back.children, this.back, PartSide.背面);
        this.showMobile(true);
        this.isHitMobile = false;
    }

    private _initParts(arr: Node[], sideParent: Node, side: PartSide) {
        let parts: PartBase[] = [];
        for (let i = 0; i < arr.length; i++) {
            const part = arr[i].getComponent(PartBase);
            if (part) {
                part.init();
                part.partSide = side;
                part.setOriginalParent(sideParent);
                part.isCovered = false;
                part.layer = i;
                this.partSlotMap.set(part.partType, part);
                for (let j = i + 1; j < arr.length; j++) {
                    const upperPart = arr[j].getComponent(PartBase);
                    if (upperPart && part.checkOverlap(upperPart)) {
                        part.isCovered = true;
                        upperPart.addCoveredPart(part);
                    }
                }
                parts.push(part);
            }
        }
        return parts;
    }

    public refreshPartRefs(): void {
        for (const part of this.frontParts) {
            if (part && part.isValid) part.setMobileRef(this.node, this.workbench, this);
        }
        for (const part of this.backParts) {
            if (part && part.isValid) part.setMobileRef(this.node, this.workbench, this);
        }
    }

    public showMobile(isFront: boolean) {
        this.isFront = isFront;
        AudioMgr.PlaySound(AudioName.MobileFlip);
        this.front.active = this.isFront;
        this.back.active = !this.isFront;
        MessMgr.emit(GameEvent.MobileFlipped, this.node);
    }

    public setDamagedPart(partType: PartType): void {
        this.damagedPartTypes.add(partType);
        const allParts = [...this.frontParts, ...this.backParts];
        for (const part of allParts) {
            if (part && part.partType === partType) {
                part.setFault(true);
            }
        }
    }

    /** 获取损坏零件类型 */
    public getDamagedPartType(): PartType | null {
        for (const pt of this.damagedPartTypes) return pt;
        return null;
    }

    /** 获取损坏零件实例（全量搜索，不限于手机上） */
    public getDamagedPart(): PartBase | null {
        for (const pt of this.damagedPartTypes) {
            const part = this.getPartByTypeAll(pt);
            if (part && part.isValid && part.isFault) return part;
        }
        return null;
    }

    /** 翻到损坏零件所在面 */
    public flipToDamagedSide(): void {
        const damaged = this.getDamagedPart();
        if (!damaged) return;
        if (damaged.partSide === PartSide.背面) {
            this.showMobile(false);
        }
    }

    /** 同类型零件不能重复放入手机 */
    public canPlacePart(part: PartBase): boolean {
        if (this.partSlotMap.has(part.partType)) {
            const existing = this.partSlotMap.get(part.partType);
            if (existing && existing !== part && existing.isValid && existing.isOnPhone()) {
                return false;
            }
        }
        return true;
    }

    protected update(dt: number): void {
        this.clickTime -= dt;
        if (this.clickTime <= 0) {
            if (this.clickCount === 1) {
                MessMgr.emit(GameEvent.MobileClicked, this.node);
            }
            this.clickTime = 0;
            this.clickCount = 0;
        }
    }

    private onTouchStart(event: EventTouch) {
        console.warn("点击手机");
        this.isHitMobile = false;
        const touchPos = event.getUILocation();
        const uiTransform = this.node.getComponent(UITransform);
        if(uiTransform && uiTransform.getBoundingBoxToWorld().contains(touchPos)){
            this.isHitMobile = true;
            this.clickTime = this.clickInterval;
            this.clickCount++;
        } else {
            this.clickCount = 0;
        }
    }

    private onTouchMove(event: EventTouch) {
        if (!this.isHitMobile) return;
        const delta = event.getUIDelta();
        this.node.setPosition(
            this.node.position.x + delta.x,
            this.node.position.y + delta.y
        );
    }

    private onTouchEnd(event: EventTouch) {
        if (this.clickCount >= this.clickCountToFlip) {
            this.clickCount = 0;
            this.clickTime = 0;
            this.showMobile(!this.isFront);
        }
        this.isHitMobile = false;
    }

    private onPartRemoved(part: PartBase): void {
        const sideNode = part.originalParent;
        if (sideNode && sideNode.isValid) {
            this.recalculateCovers(sideNode);
        }
        this.partSlotMap.delete(part.partType);
    }

    private onPartPlaced(part: PartBase): void {
        const sideNode = part.originalParent;
        if (sideNode && sideNode.isValid) {
            this.recalculateCovers(sideNode);
        }
        this.partSlotMap.set(part.partType, part);
        // 动态生成的新零件需要加入对应面的数组
        if (part.partSide === PartSide.正面) {
            if (this.frontParts.indexOf(part) < 0) this.frontParts.push(part);
        } else {
            if (this.backParts.indexOf(part) < 0) this.backParts.push(part);
        }
    }

    private recalculateCovers(sideNode: Node): void {
        const children = sideNode.children;
        const allParts: PartBase[] = [];
        for (let i = 0; i < children.length; i++) {
            const p = children[i].getComponent(PartBase);
            if (p) {
                p.isCovered = false;
                p.coveredParts.length = 0;
                allParts.push(p);
            }
        }
        for (let i = 0; i < allParts.length; i++) {
            const lower = allParts[i];
            for (let j = i + 1; j < allParts.length; j++) {
                const upper = allParts[j];
                if (lower.checkOverlap(upper)) {
                    lower.isCovered = true;
                    upper.coveredParts.push(lower);
                }
            }
        }
    }

    /** 在所有零件中按类型查找（不管是否在手机上） */
    public getPartByTypeAll(partType: PartType): PartBase | null {
        for (const part of this.frontParts) {
            if (part && part.isValid && part.partType === partType) return part;
        }
        for (const part of this.backParts) {
            if (part && part.isValid && part.partType === partType) return part;
        }
        return null;
    }

    public showPartGlowOut(partType: PartType): void {
        const part = this.getPartByTypeAll(partType);
        if (part && part.isValid) {
            part.showGlowOut();
        }
    }

    public getActiveTooledPart(): PartBase | null {
        const parts = this.isFront ? this.frontParts : this.backParts;
        for(let i = 0; i < parts.length; i++){
            const part = parts[i];
            if (part && part.isValid && part.isBeingOperated) return part;
        }
        return null;
    }

    // ── 诊断 ──

    public getRepairHint(): {
        action: string, partType: PartType, toolType: RepairToolType, message: string
    } {
        const damagedType = this.getDamagedPartType();
        const damagedPart = this.getDamagedPart();
        if (!damagedType || !damagedPart) {
            return { action: 'none', partType: PartType.无, toolType: RepairToolType.无, message: '等待订单' };
        }

        const side = damagedPart.partSide;
        const allParts = side === PartSide.正面 ? [...this.frontParts] : [...this.backParts];
        const damagedLayer = damagedPart.layer;
        const newPart = this.partSlotMap.get(damagedType);
        const damagedRemoved = !damagedPart.isOnPhone();
        const newPlaced = newPart && newPart !== damagedPart && newPart.isOnPhone();

        const hintPart = (part: PartBase, verb: string): { action: string, partType: PartType, toolType: RepairToolType, message: string } => {
            // 主板特例：螺丝而非工具
            if (part.partType === PartType.主板) {
                if (verb === '拆卸') {
                    return { action: 'click', partType: part.partType, toolType: RepairToolType.螺丝, message: `点击主板拧下螺丝` };
                }
                return { action: 'click', partType: part.partType, toolType: RepairToolType.螺丝, message: `点击主板拧上螺丝` };
            }
            const tool = part.getCurrentRequiredTool();
            if (tool !== RepairToolType.无) {
                return { action: 'useTool', partType: part.partType, toolType: tool, message: `${verb}${PartType[part.partType]}(${RepairToolType[tool]})` };
            }
            return { action: 'remove', partType: part.partType, toolType: RepairToolType.无, message: `${verb}${PartType[part.partType]}` };
        };

        // ── 阶段1：拆卸 ──
        if (!damagedRemoved) {
            const topDown = [...allParts].sort((a, b) => b.layer - a.layer);
            for (const part of topDown) {
                if (part.layer <= damagedLayer) break;
                if (!part || !part.isValid || !part.isOnPhone()) continue;
                if (part.isFixed) return hintPart(part, '拆卸');
                return { action: 'remove', partType: part.partType, toolType: RepairToolType.无, message: `取下${PartType[part.partType]}` };
            }
            if (damagedPart.isFixed) return hintPart(damagedPart, '拆卸');
            return { action: 'remove', partType: damagedPart.partType, toolType: RepairToolType.无, message: `取下坏${PartType[damagedPart.partType]}` };
        }

        // ── 阶段2：换新 ──
        if (!newPlaced) {
            return { action: 'place', partType: damagedType, toolType: RepairToolType.无, message: `放入新${PartType[damagedType]}` };
        }

        // ── 阶段3：装载 ──
        const bottomUp = [...allParts].sort((a, b) => a.layer - b.layer);
        for (const part of bottomUp) {
            if (!part || !part.isValid) continue;
            if (part === damagedPart) continue;

            if (!part.isOnPhone()) {
                return { action: 'place', partType: part.partType, toolType: RepairToolType.无, message: `放入${PartType[part.partType]}` };
            }
            // 在手机上但不需要固定 → 跳过
            if (part.isFixed || !part.needsFix) continue;
            return hintPart(part, '固定');
        }
        if(!this.isComplete){
            this.isComplete = true;
            AudioMgr.PlaySound(AudioName.RepairComplete);
        }
        return { action: 'complete', partType: damagedType, toolType: RepairToolType.无, message: '修理完成' };
    }
}
