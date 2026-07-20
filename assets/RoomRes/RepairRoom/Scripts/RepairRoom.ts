import { _decorator, Component, Enum, EventTouch, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Tween, tween, UITransform, Vec3 } from 'cc';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import { BaseRoom } from 'db://assets/Init/Scripts/Game/BaseRoom';
import { Mobile } from 'db://assets/Init/Scripts/Game/Mobile';
import { RepairTool } from 'db://assets/Init/Scripts/Game/RepairTool';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import { PartListBtn } from './PartListBtn';
import { ShopConfig } from 'db://assets/Init/Scripts/Data/Configs/ShopConfig';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
import { PartBtn } from './PartBtn';
import { MobileConfig } from 'db://assets/Init/Scripts/Data/Configs/MobileConfig';
import { UIMgr } from 'db://assets/Init/Scripts/Mgr/UIMgr';
import { BaseBar } from 'db://assets/Init/Scripts/UI/UIComponent/BaseBar';
import { Quality } from 'db://assets/Init/Scripts/Data/Enum/Enum';
import { PartType, RepairToolType } from 'db://assets/Init/Scripts/Data/Type/ObjType';
import { PartBase } from 'db://assets/Init/Scripts/Game/Part/PartBase';

const { ccclass, property } = _decorator;
@ccclass('ItemSprSet')
class ItemSprSet{
    /** 零件类型 */
    @property({ type: Enum(PartType), tooltip: '零件类型' })
    partType: PartType = PartType.无;
    /** 列表背景 */
    @property({ type: SpriteFrame, tooltip: '列表背景图片' })
    listBgSpr:SpriteFrame = null;
    /** 格子背景 */
    @property({ type: SpriteFrame, tooltip: '格子背景图片' })
    gridBgSpr:SpriteFrame = null;

    /** 低端真货图片 */
    @property({ type: SpriteFrame, tooltip: '低端真货图片' })
    lowSpr:SpriteFrame = null;
    /** 低假货 */
    @property({ type: SpriteFrame, tooltip: '低假货图片' })
    lowFakeSpr:SpriteFrame = null;
    /**中 */
    @property({ type: SpriteFrame, tooltip: '中端真货图片' })
    middleSpr:SpriteFrame = null;
    /** 中假货 */
    @property({ type: SpriteFrame, tooltip: '中假货图片' })
    middleFakeSpr:SpriteFrame = null;
    /** 高端真货图片 */
    @property({ type: SpriteFrame, tooltip: '高端真货图片' })
    highSpr:SpriteFrame = null;
    /** 高假货 */
    @property({ type: SpriteFrame, tooltip: '高假货图片' })
    highFakeSpr:SpriteFrame = null;
}

/**
 * 修复房间
 */
@ccclass('RepairRoom')
export class RepairRoom extends BaseRoom {

    @property({ type: ItemSprSet, tooltip: '零件图片设置' })
    sprSetArr: ItemSprSet[] = [];
    /** 工作台 */
    @property({ type: Node, tooltip: '工作台' })
    public  workbench: Node = null;

    /** 工具父节点 */
    @property({ type: Node, tooltip: '工具父节点' })
    public  toolParent: Node = null;
    
    @property({ type: Sprite, tooltip: '拖拽显示' })
    public  dragShow: Sprite = null;

    /** 工具进度条 */
    @property({ type: BaseBar, tooltip: '工具进度条' })
    public  toolProgressBar: BaseBar = null;

    @property({ type: Label, tooltip: '步骤标签' })
    public  stepLabel : Label = null;

    @property({ type: Sprite, tooltip: '提示使用工具图片' })
    public toolSpr: Sprite = null;

    /** 故障标签 */
    @property({ type: Label, tooltip: '故障标签' })
    public  faultLabel : Label = null;

    /** 当前在修的手机 */
    public  repairMobile: Mobile = null;

    /** 工具队列 */
    public  toolQueue: RepairTool[] = [];
    /** 当前选择的工具 */
    public  usingTool: RepairTool = null;


    /** 零件种类列表 */
    @property({ type: Node, tooltip: '零件种类列表' })
    public  partTypeList: Node = null;
    /** 列表初始X */
    public  listInitX: number = 1200;
    /** 显示X */
    public  showX: number = 375;

    private partBtnTypeList: PartListBtn[] = [];

    /**零件种类父节点 */
    @property({ type: Node, tooltip: '零件按钮父节点' })
    public  partBtnRoot: Node = null;
    /** 零件按钮列表 */
    private partBtnList: PartBtn[] = [];
    /** 零件按钮预制体 */
    @property({ type: Prefab, tooltip: '零件按钮预制体' })
    public  partBtnPrefab: Prefab = null;

    init(...args: any[]): void {
        super.init(...args);
        this.initToolQueue();
        this.initPartTypeList();
        this.partBtnRoot.active = false;
    }

    registerEvent(): void {
        super.registerEvent();
        MessMgr.on(GameEvent.OrderCompleted, this.onOrderCompleted, this);
        MessMgr.on(GameEvent.PartStepChanged, this.onPartStepChanged, this);
    }

    resetEvent(): void {
        super.resetEvent();
        MessMgr.off(GameEvent.OrderCompleted, this.onOrderCompleted, this);
        MessMgr.off(GameEvent.PartStepChanged, this.onPartStepChanged, this);
    }

    private onPartStepChanged(part: PartBase): void {
        if (!this.usingTool) return;
        if (part.isCurrentPhaseDone()) {
            this.usingTool.isStepComplete = true;
        }
    }
    /** 初始化工具队列 */
    private initToolQueue() {
        // console.log("初始化工具队列")
        const tools = this.toolParent.children;
        for (let i = 0; i < tools.length; i++) {
            const tool = tools[i].getComponent(RepairTool);
            if (tool) {
                this.toolQueue.push(tool);
            }
        }
        this.toolProgressBar.setProgress(0);
        this.toolProgressBar.node.active = true;
    }
    /** 初始化零件按钮 */
    private initPartTypeList() {
        const arr = this.partTypeList.children;
        this.partBtnTypeList = [];
        for (let i = 0; i < arr.length; i++) {
            const btn = arr[i];
            const btnSrc = btn.getComponent(PartListBtn);
            if (!btnSrc) continue;
            this.partBtnTypeList.push(btnSrc);
        }

        this.partBtnList = [];
        for (let i = 0; i < 6; i++) {
            const btn = instantiate(this.partBtnPrefab);
            const btnSrc = btn.getComponent(PartBtn);
            if (!btnSrc) continue;
            this.partBtnList.push(btnSrc);
            btn.parent = this.partBtnRoot;
            btn.active = false;
        }
        // console.log("初始化零件按钮列表:", this.partBtnList.length, this.partBtnTypeList.length);
    }
    /** 点击材料按钮 */
    private onClickPartTypeBtn(btn:PartListBtn, event: EventTouch) {
        AudioMgr.PlaySound(AudioName.BtnClick);
        const uiTouch = event.getUILocation();
        console.log("点击材料按钮", btn.node.name);
        Tween.stopAllByTarget(this.partBtnRoot);
        // this.partBtnRoot.x = this.listInitX;
        this.partBtnRoot.worldPositionY = uiTouch.y;
        this.partBtnRoot.active = true;
        tween(this.partBtnRoot)
            .to(0.1, { x: this.listInitX })
            .to(0.3, { x: this.showX })
            .start();
        let data = ShopConfig.shopPartList.find((item) => item.partType == btn.partType);
        if(!data){
            console.log("没有这个零件 数据：", btn.partType);
        }
        let itemDataArr = [
            {quality: Quality.低, isReal: true},
            {quality: Quality.低, isReal: false},
            {quality: Quality.中, isReal: true},
            {quality: Quality.中, isReal: false},
            {quality: Quality.高, isReal: true},
            {quality: Quality.高, isReal: false}
        ]
        const sprData = this.sprSetArr.find((item) => item.partType == btn.partType );
        if(sprData){
            this.partBtnRoot.getComponent(Sprite).spriteFrame = sprData.listBgSpr;
        }
        for (let i = 0; i < data.shopListData.length; i++) {
            const item = data.shopListData[i];
            const saveData = GameData.getObjectStorageData(item.shopKey);
            const btnSrc = this.partBtnList[i];
            if(!btnSrc) continue;
            btnSrc.partInfoLabel.string = item.shopName;
            btnSrc.numLabel.string = saveData ? saveData.count.toString() : "0";
            btnSrc.partKey = item.shopKey;
            btnSrc.partQuality = item.quality;
            btnSrc.node.active = true;
            btnSrc.partType = item.partType;
            btnSrc.getComponent(Sprite).spriteFrame = sprData.gridBgSpr;
            let itemData  = itemDataArr[i];
            
            if(itemData && sprData){
                switch (itemData.quality) {
                    case Quality.低:
                        btnSrc.spr.spriteFrame = itemData.isReal ? sprData.lowSpr : sprData.lowFakeSpr;
                        break;
                    case Quality.中:
                        btnSrc.spr.spriteFrame = itemData.isReal ? sprData.middleSpr : sprData.middleFakeSpr;
                        break;
                    case Quality.高:
                        btnSrc.spr.spriteFrame = itemData.isReal ? sprData.highSpr : sprData.highFakeSpr;
                        break;
                }
            }
        }
    }
    /** 点击材料列表按钮 */
    private onClickPartListBtn(btn:PartBtn,event: EventTouch) {
        AudioMgr.PlaySound(AudioName.BtnClick);

        if(this.repairMobile && this.repairMobile.mobileInfo.quality != btn.partQuality){
            UIMgr.getInstance().showTip("品质不同，不能生成");
            return;
        }

        const saveData = GameData.getObjectStorageData(btn.partKey);
        if(!saveData){
            console.warn("没有这个零件 数据：", btn.partKey);
            return;
        }
        if( saveData.count > 0){
            const shopData = ShopConfig.shopPartList
                .find(s => s.partType === btn.partType)?.shopListData
                ?.find(d => d.shopKey === btn.partKey);

            this.spawnPart(btn.partType, shopData?.isReal ?? true);

            saveData.count--;
            btn.numLabel.string = saveData.count.toString();
            GameData.setObjectStorageData(btn.partKey, saveData);
        }else{
            this.partBtnRoot.active = false;
            MessMgr.emit(GameEvent.JumpToPartShop, btn.partKey);
        }
    }

    /** 生成零件到工作台：复制手机上对应类型零件，标记为完好 */
    public spawnPart(partType: PartType, isGenuine: boolean): void {
        const sourcePart = this.repairMobile?.getPartByTypeAll(partType);
        if (!sourcePart) {
            console.warn("手机上无此类型零件:", PartType[partType]);
            return;
        }

        const newNode = instantiate(sourcePart.node);
        const newPart = newNode.getComponent(PartBase);
        if (!newPart) return;

        newNode.parent = this.workbench;
        newPart.init();
        newPart.cloneInit();
        newPart.setOriginalParent(sourcePart.originalParent);
        newPart.layer = sourcePart.layer;
        newPart.partSide = sourcePart.partSide;

        newPart.isFault = false;
        newPart.setFault(false);
        newPart.setStartLocalPos(sourcePart.getStartLocalPos());
        newPart.isCovered = false;
        newPart.isFixed = false;
        newPart.isGenuine = isGenuine;
        newPart.isMobileOpen = true;
        newPart.setMobileRef(this.repairMobile.node, this.workbench, this.repairMobile);

     
        newNode.name = "new_" + newNode.name;
        newNode.active = true;
        newPart.node.setPosition(-170, 0, 0);
        console.log("生成零件:", newNode.name, "type:", PartType[partType], "isGenuine:", isGenuine);
    }

    /** 更新步骤和故障提示标签 */
    private updateHintLabels(): void {
        if (!this.repairMobile) return;
        const hint = this.repairMobile.getRepairHint();
        if(!hint){
            return;
        }
        if (this.stepLabel) {
            this.stepLabel.string = hint.message;
            
        }
        if(this.toolSpr){
            let tool = this.toolQueue.find(t => t.toolType === hint.toolType);
            if(tool){
                this.toolSpr.spriteFrame = tool.dragShowSpriteFrame;
            }else{
                this.toolSpr.spriteFrame = null;
            }
        }
        if (this.faultLabel) {
            const damaged = this.repairMobile.getDamagedPartType();
            if (damaged) {
                this.faultLabel.string = `故障:${PartType[damaged]}`;
            }
        }
    }

    protected update(dt: number): void {
        this.updateHintLabels();
        if (!this.usingTool || !this.usingTool.isIntersectingPart || this.usingTool.isStepComplete) {
            if (this.toolProgressBar.node.active) {
                this.toolProgressBar.node.active = false;
            }
            if (this.usingTool) {
                this.usingTool.hideAnimation();
                this.usingTool.stopSound();
                this.dragShow.getComponent(Sprite).enabled = true;
            }
            return;
        }
        if(this.usingTool.toolType === RepairToolType.无 || this.usingTool.toolType == RepairToolType.螺丝){
            return;
        }
        this.toolProgressBar.upDatePos(this.usingTool.node.worldPosition.clone());

        const part = this.repairMobile?.getActiveTooledPart();
        if (!part) return;

        if (!this.toolProgressBar.node.active) {
            this.toolProgressBar.node.active = true;
        }
        this.toolProgressBar.upDateData(dt, part.useTime, part.getCurrentStepTime());
    }

    protected onTouchStart(event: EventTouch) {
        for (let i = 0; i < this.toolQueue.length; i++) {
            const tool = this.toolQueue[i];
            if (tool.checkClickPosition(event)) {
                this.usingTool = tool;
                tool.dragShow();
                tween(this.dragShow.node)
                    .to(0.1, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'bounceOut' })
                    .start();
                this.dragShow.spriteFrame = tool.dragShowSpriteFrame;
                this.dragShow.getComponent(Sprite).enabled = true;
                this.dragShow.node.setWorldPosition(tool.node.worldPosition);
                MessMgr.emit(GameEvent.PickUpTool, tool.toolType);
                return;
            }
        }
        /** 是否点击了零件按钮 */
        for (let i = 0; i < this.partBtnList.length; i++) {
            const btn = this.partBtnList[i];
            if (btn && btn.node.active && btn.checkClickPosition(event)) {
                this.onClickPartListBtn(btn, event);
                return;
            }
        }

        /** 是否点击了零件种类按钮 */
        for (let i = 0; i < this.partBtnTypeList.length; i++) {
            const btn = this.partBtnTypeList[i];
            if (btn.checkClickPosition(event)) {
                this.onClickPartTypeBtn(btn, event);
                return;
            }
        }

        tween(this.partBtnRoot)
            .to(0.3, { x: this.listInitX })
            .start();
    }
    public onTouchMove(event: EventTouch) {
        if (!this.usingTool) return;
        const delta = event.getUIDelta();
        if (this.usingTool.isSelfMove) {
            this.usingTool.node.x += delta.x;
            this.usingTool.node.y += delta.y;
        }
        this.dragShow.node.x += delta.x;
        this.dragShow.node.y += delta.y;
        const worldPos = this.dragShow.node.worldPosition;
        const dragRect = this.dragShow.node.getComponent(UITransform)?.getBoundingBoxToWorld();
        MessMgr.emit(GameEvent.CheckToolPartIntersection, {
            worldPosition: worldPos,
            worldRect: dragRect,
            toolType: this.usingTool.toolType,
        });

        const activePart = this.repairMobile?.getActiveTooledPart();
        this.usingTool.isIntersectingPart = activePart != null;

        if (this.usingTool.isIntersectingPart) {
            if (this.usingTool.isStepComplete) {
                this.usingTool.hideAnimation();
                this.usingTool.stopSound();
                this.dragShow.getComponent(Sprite).enabled = true;
            } else {
                this.usingTool.showAnimation(activePart.node.worldPosition);
                this.usingTool.playSound();
                this.dragShow.getComponent(Sprite).enabled = false;
            }
        } else {
            this.usingTool.hideAnimation();
            this.usingTool.stopSound();
            this.dragShow.getComponent(Sprite).enabled = true;
        }
    }
    public onTouchEnd(event: EventTouch) {
        const tool = this.usingTool;
        if(tool){
            tool.hideAnimation();
            tool.stopSound();
            
            tool.backToInitPosition();
            this.dragShow.spriteFrame = null;
            this.usingTool = null;
            this.toolProgressBar.node.active = false;
            MessMgr.emit(GameEvent.PutDownTool, tool.toolType);
        }
    }
    public addMobile(mobile: Node, mobileKey: string): void {
        if(!mobile){
            console.error("手机为空:", mobileKey);
            return;
        }
        this.mobile = mobile;
        mobile.scale = new Vec3(1, 1, 1);
        mobile.parent = this.workbench;
        mobile.active = false;
        mobile.active = true;
        mobile.setPosition(0, 0, 0);
        let mobileComp = mobile.getComponent(Mobile);
        if(mobileComp){
            mobileComp.mobileInfo = MobileConfig.get(mobileKey);
            this.repairMobile = mobileComp;
            mobileComp.workbench = this.workbench;
            mobileComp.refreshPartRefs();
            mobileComp.flipToDamagedSide();
            console.log("获得 当前在修的手机")
        }else{
            console.error("无法获得手机")
        }
    }

    /** 订单完成 → 清空工作台 */
    private onOrderCompleted(): void {
        this.workbench.destroyAllChildren();
        this.repairMobile = null;
        this.mobile = null;
        if (this.stepLabel) this.stepLabel.string = '';
        if (this.faultLabel) this.faultLabel.string = '';
    }
}


