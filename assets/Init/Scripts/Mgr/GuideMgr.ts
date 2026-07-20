import { _decorator, Component, Node } from 'cc';
import { MessMgr } from './MessMgr';


import { GameVar } from '../Data/Store/GameVar';
import { GuideEvent } from '../Data/Enum/GuideEvent';
// import { UI_Guide } from '../UI/UI_Guide';

const { ccclass, property } = _decorator;

interface GuideStep {
    ID: number;
    提示内容: string;
    等待事件: string;
    完成事件: GuideEvent;
    操作类型: string;

    引导节点?: Node[];
    引导回调?: Function;
}

/**
 * 指导管理器 - 动态事件注册版本
 * @description 根据当前步骤动态注册/移除事件监听，逐步推进引导流程
 */
@ccclass('GuideManager')
export class GuideMgr extends Component {
    private static m_instance: GuideMgr = null;
    public static getInstance(): GuideMgr {
        if (!this.m_instance) {
            console.warn("GuideManager is not initialized!");
        }
        return this.m_instance;
    }
    private static Guide_Steps_Map: Map<number, GuideStep[]> = new Map();
    private static Play_Steps1: GuideStep[] = [
        // { ID: 1, 提示内容: "玩家进入游戏1 引导玩家连线合成文字", 等待事件: GuideEvent.连线玩法展示, 完成事件: GuideEvent.合成英雄, 操作类型: "滑动", 引导类型: 引导类型.Game2 },
        // { ID: 2, 提示内容: "引导玩家点击刷新", 等待事件: GuideEvent.引导点击刷新, 完成事件: GuideEvent.点击_刷新, 操作类型: "点击", 引导类型: 引导类型.Game2 },
        // { ID: 3, 提示内容: "结算，引导玩家点击回到主界面", 等待事件: GuideEvent.连线结算引导, 完成事件: GuideEvent.点击_返回主界面, 操作类型: "点击", 引导类型: 引导类型.Game2 },
    ];

    private static Play_Steps2: GuideStep[] = [
        // { ID: 1, 提示内容: "玩家进入游戏2 引导玩家选择正确文字", 等待事件: GuideEvent.选择玩法展示, 完成事件: GuideEvent.合成英雄, 操作类型: "点击", 引导类型: 引导类型.Game1 },
        // { ID: 2, 提示内容: "引导玩家点击刷新", 等待事件: GuideEvent.引导点击刷新, 完成事件: GuideEvent.点击_刷新, 操作类型: "点击", 引导类型: 引导类型.Game1 },
    ];
    // UI引导步骤配置
    private static UI_Steps: GuideStep[] = [
    //     { ID: 1, 提示内容: "引导玩家点击商店", 等待事件: GuideEvent.打开_开始界面, 完成事件: GuideEvent.打开_商店界面, 操作类型: "点击", 引导类型: 引导类型.UI正常流程1 },
    //     { ID: 2, 提示内容: "引导玩家点击单抽", 等待事件: GuideEvent.引导点击单抽, 完成事件: GuideEvent.点击_钻石单抽, 操作类型: "点击", 引导类型: 引导类型.UI正常流程1 },
    //     { ID: 4, 提示内容: "引导玩家点击角色界面", 等待事件: GuideEvent.关闭宝箱弹窗, 完成事件: GuideEvent.打开_英雄界面, 操作类型: "点击", 引导类型: 引导类型.UI正常流程1 },
    //     { ID: 5, 提示内容: "引导玩家点击角色", 等待事件: GuideEvent.引导点击英雄, 完成事件: GuideEvent.点击_英雄, 操作类型: "点击", 引导类型: 引导类型.UI正常流程1 },
    //     { ID: 6, 提示内容: "引导玩家点击升级碎片", 等待事件: GuideEvent.引导点击升级, 完成事件: GuideEvent.点击_升级, 操作类型: "点击", 引导类型: 引导类型.UI正常流程1 },
       
    //     { ID: 8, 提示内容: "引导玩家点击主界面", 等待事件: GuideEvent.关闭升星弹窗, 完成事件: GuideEvent.打开_开始界面, 操作类型: "点击", 引导类型: 引导类型.UI正常流程1 },
    //     { ID: 9, 提示内容: "引导玩家点击进入游戏", 等待事件: GuideEvent.引导点击战斗, 完成事件: GuideEvent.点击_开始游戏, 操作类型: "点击", 引导类型: 引导类型.UI正常流程1 },
    ];

    private 当前步骤: GuideStep = null;

    // @property(UI_Guide)
    // private 引导界面: UI_Guide = null;

    protected onLoad(): void {
        GuideMgr.m_instance = this;
        // GuideMgr.Guide_Steps_Map.set(引导类型.Game2, GuideMgr.Play_Steps1);
        // GuideMgr.Guide_Steps_Map.set(引导类型.Game1, GuideMgr.Play_Steps2);
        // GuideMgr.Guide_Steps_Map.set(引导类型.UI正常流程1, GuideMgr.UI_Steps);
    }

    protected onEnable(): void {
        // 开始引导（从未开始状态启动）
        // this.引导界面.node.active = false;
    }

    protected onDisable(): void {
        // 清除所有动态监听
        this.clearCurrentListeners();
    }

    /**
     * 开始引导流程
     */
    public startGuide(guideType: number): void {
        console.log(`开始引导 ${guideType}`);
        this.当前步骤 = GuideMgr.Guide_Steps_Map.get(guideType)[0];
        if(this.当前步骤 == null){
            this.completeGuide();
            return;
        }
        console.log(`开始引导步骤 ${this.当前步骤.ID}: ${this.当前步骤.提示内容}`);
        this.registerWaitingEvent();
    }

    private 显示引导_节点() {
        // if (this.当前步骤 && this.引导界面) {
        //     this.引导界面.node.active = true;
        //     this.引导界面.guides = [];
        //     this.引导界面.guides.push(...this.当前步骤.引导节点);
        //     this.引导界面.useCustomGuide = false;
        //     this.引导界面.开始引导()
        // }else{
        //     console.warn("当前步骤无引导节点");
        //     this.引导界面.node.active = false;
        //     GameVar.游戏暂停 = false;
        // }
    }

    /**
     * 注册当前步骤的等待事件
     */
    private registerWaitingEvent(): void {
        MessMgr.on(this.当前步骤.等待事件, this.onWaitingEventTriggered, this);
        console.log(`注册等待事件: ${GuideEvent[this.当前步骤.等待事件]}`);
    }
    private removeWaitingEvent(): void {
        MessMgr.off(this.当前步骤.等待事件, this.onWaitingEventTriggered, this);
        console.log(`移除等待事件: ${GuideEvent[this.当前步骤.等待事件]}`);
    }

    /**
     * 等待事件触发时的处理
     */
    private onWaitingEventTriggered(guideNodeArr: Node[], 引导回调?: Function): void {
        GameVar.pause = true;
        console.log(`等待事件触发 ${this.当前步骤.ID}: ${GuideEvent[this.当前步骤.等待事件]}`);
        if(guideNodeArr && guideNodeArr.length > 0){
            console.log(`引导节点: ${guideNodeArr.length} 个`);
            this.当前步骤.引导节点 = guideNodeArr;
        }
        if(引导回调){
            this.当前步骤.引导回调 = 引导回调;
        }
        // PlatForm.getInstance().ReportGuide(this.当前步骤.ID, this.当前步骤.引导类型, "待触发");
        this.显示引导_节点();
        // 展示引导提示（可调用UI管理器显示提示内容）
        this.showGuideTip(this.当前步骤.提示内容, this.当前步骤.操作类型);

        // 等待事件触发后，移除等待事件监听
        this.removeWaitingEvent();

        // 注册完成事件监听（若完成事件与等待事件相同，需特殊处理防止立即触发）
        this.registerCompleteEvent();
    }

    /**
     * 注册当前步骤的完成事件
     */
    private registerCompleteEvent(): void {
        // MessMgr.AddListener(this.当前步骤.完成事件, this, this.onCompleteEventTriggered);
        console.log(`注册完成事件: ${GuideEvent[this.当前步骤.完成事件]}`);
    }
    private removeCompleteEvent(): void {
        // MessMgr.RemoveListener(this.当前步骤.完成事件, this, this.onCompleteEventTriggered);
        // console.log(`移除完成事件: ${GuideEvent[this.当前步骤.完成事件]}`);
    }

    /**
     * 完成事件触发时的处理
     */
    private onCompleteEventTriggered(): void {
        GameVar.pause = false;
        console.log(`完成事件触发 ${this.当前步骤.ID}: ${GuideEvent[this.当前步骤.完成事件]}`);

        // 移除完成事件监听
        this.removeCompleteEvent();

        // if(this.引导界面){
        //     this.引导界面.node.active = false;
        // }
        if(this.当前步骤.引导回调){
            this.当前步骤.引导回调();
        }
        // PlatForm.getInstance().ReportGuide(this.当前步骤.ID, this.当前步骤.引导类型, "已完成");
        // 隐藏引导提示
        this.hideGuideTip();
        this.获得下一个引导步骤();
        if(this.当前步骤 == null){
            console.log("所有引导步骤完成");
            this.completeGuide();
            return;
        }
        console.log(`下一个引导步骤 ${this.当前步骤.ID}: ${this.当前步骤.提示内容}`);
        this.registerWaitingEvent();
    }

    /**
     * 清除当前所有动态监听
     */
    private clearCurrentListeners(): void {
        if(this.当前步骤 && this.当前步骤.等待事件){
            MessMgr.off(this.当前步骤.等待事件, this.onWaitingEventTriggered, this);
        }
        if(this.当前步骤 && this.当前步骤.完成事件){
            // MessMgr.RemoveListener(this.当前步骤.完成事件, this, this.onCompleteEventTriggered);
        }
        this.当前步骤 = null;
    }

    /**
     * 展示引导提示UI
     * @param content 提示内容
     * @param actionType 操作类型（点击/滑动等）
     */
    private showGuideTip(content: string, actionType: string): void {
        // TODO: 调用实际的UI管理器显示引导提示
        // console.log(`[Guide Tip] ${content} (操作: ${actionType})`);
        // 示例：如果存在UIManager，可调用 UIManager.showGuide(content);
    }

    /**
     * 隐藏引导提示UI
     */
    private hideGuideTip(): void {
        // console.log(`[Guide Tip] Hidden`);
        // TODO: 调用实际的UI管理器隐藏引导提示
    }

    /**
     * 完成所有引导
     */
    private completeGuide(): void {
        // console.log("Guide completed!");
        this.clearCurrentListeners();
        // 可保存引导完成标记到本地存储
        // cc.sys.localStorage.setItem("guide_completed", "true");
        // this.引导界面.node.active = false;
    }

    private 获得下一个引导步骤(): GuideStep | null {
        // let steps = GuideMgr.Guide_Steps_Map.get(this.当前步骤.引导类型);
        // let index = steps.indexOf(this.当前步骤);
        // let nextStep = index + 1;
        // if(nextStep >= 0 && nextStep < steps.length){
        //     this.当前步骤 = steps[nextStep];
        // } else {
        //     this.当前步骤 = null;
        // }
        // return this.当前步骤;
        return null;
    }

    /**
     * 
     * @param guideNodeArr 引导节点数组
     * @param 引导回调 
     */
    public 设置引导(guideNodeArr: Node[], 引导回调?: Function) {
        if(this.当前步骤){
            this.当前步骤.引导节点 = guideNodeArr;
            this.当前步骤.引导回调 = 引导回调;
            // console.log(`设置引导 ${this.当前步骤.ID} 完成`);
        }
    }
   
    /**
     * 获取当前引导步骤（供外部查询）
     */
    public getCurrentStep(): GuideStep | null {
        return this.当前步骤;
    }

    // public getSteps(guideType: 引导类型): GuideStep[] {
    //     return GuideMgr.Guide_Steps_Map.get(guideType);
    // }
}