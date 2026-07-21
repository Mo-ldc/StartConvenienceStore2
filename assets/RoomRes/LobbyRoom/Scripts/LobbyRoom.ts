import { _decorator, Label, Node, tween, UIOpacity, Vec3 } from 'cc';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import { BaseRoom } from 'db://assets/Init/Scripts/Game/BaseRoom';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import { UIMgr, UIName } from 'db://assets/Init/Scripts/Mgr/UIMgr';
import { NumShow } from './NumShow';
import { Role } from 'db://assets/Init/Scripts/Game/Role';
import { OrderModel } from 'db://assets/Init/Scripts/Data/Model/OrderModel';
import { OrderType, PartType } from 'db://assets/Init/Scripts/Data/Type/ObjType';
import { WordAni } from 'db://assets/Init/Scripts/AniTool/WordAni';
import { Mobile } from 'db://assets/Init/Scripts/Game/Mobile';
import { ShopConfig } from 'db://assets/Init/Scripts/Data/Configs/ShopConfig';
import { Quality } from 'db://assets/Init/Scripts/Data/Enum/Enum';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
import { CtrMgr } from 'db://assets/Init/Scripts/Mgr/CtrMgr';
const { ccclass, property } = _decorator;

@ccclass('LobbyRoom')
export class LobbyRoom extends BaseRoom {
    /** 出价文本 */
    @property(Label)
    priceLabel: Label = null;

    /** 房租文本 */
    @property(Label)
    rentLabel: Label = null;

    /** 当前角色 */
    @property({type: Role, tooltip: '当前角色'})
    role: Role = null;

    @property({type: Node, tooltip: '订单节点'})
    orderNode: Node = null;
    @property(Label)
    roleName:Label = null;
    @property(Label)
    orderLabel:Label = null;
    /** 订单标签文本 */
    @property(Label)
    orderTag:Label = null;

    /** 出价节点 */
    @property({type: Node, tooltip: '出价节点'})
    priceNode: Node = null;

    /** 出价按钮 */
    @property({type: Node, tooltip: '出价按钮'})
    priceButton: Node = null;
    /** 接受按钮 */
    @property({type: Node, tooltip: '成交按钮'})
    acceptButton: Node = null;
    /** 拒绝按钮 */
    @property({type: Node, tooltip: '拒绝按钮'})
    rejectButton: Node = null;
    /** 成交按钮 */
    @property({type: Node, tooltip: '成交按钮'})
    dealButton: Node = null;

    /** 当前显示的订单 */
    // private currentOrder: OrderData = null;
    /** 数值面板 */
    @property({type: Node, tooltip: '数值面板'})
    numShow: Node = null;
    @property({type: NumShow, tooltip: '知识数值显示'})
    knowledgeShow: NumShow = null;
    /** 财富数值显示 */
    @property({type: NumShow, tooltip: '财富数值显示'})
    wealthShow: NumShow = null;
    @property({type: NumShow, tooltip: '耐心数值显示'})
    patienceShow: NumShow = null;

    /** 展示手机的动画节点 */
    @property({type: Node, tooltip: '展示手机的动画节点'})
    mobileAni: Node = null;
    

    /** 毁坏评估表 */
    @property({type: Node, tooltip: '毁坏评估表'})
    damageTable: Node = null;

    /** 利润文本 */
    @property(Label)
    profitLabel: Label = null;
    /** 成本文本 */
    @property(Label)
    contentLabel: Label = null;

    /** 订单数据 */
    private order: OrderModel = null;
    public getOrder(): OrderModel {return this.order;}
    registerEvent(): void {
        super.registerEvent();
        MessMgr.on(GameEvent.UpdatePriceLabel, this.updatePriceLabel, this);
        MessMgr.on(GameEvent.NpcBidResult, this.onNpcBidResult, this);
    }

    resetEvent(): void {
        super.resetEvent();
        MessMgr.off(GameEvent.UpdatePriceLabel, this.updatePriceLabel, this);
        MessMgr.off(GameEvent.NpcBidResult, this.onNpcBidResult, this);
    }

    init(...args: any[]): void {
        super.init(...args);
        AudioMgr.OnlyPlayMusic(AudioName.Main);
        this.numShow.active = false;
        this.priceNode.active = false;
        this.orderNode.scale = new Vec3(0, 0, 1);
        this.role.initRole();
        this.damageTable.scale = new Vec3(0, 0, 1);
        this.profitLabel.string = "0";
        this.priceLabel.string = "0";
        this.dealButton && (this.dealButton.active = false);
        this.hideBut();
    }

    /** 初始化订单 */
    initOrder(order: OrderModel, roleKey?: string): void {
        if(!order){
            console.warn("订单数据为空");
            return;
        }
        if(!roleKey){
            console.warn("角色键为空");
            return;
        }

        this.order = order;
        this.role.setRoleSpr(roleKey);
        this.initOrderInfo(order, order.guestName);
        this.initNumShow(order);
        // console.log("初始化订单:", order);

        WordAni.PlayWordAni(this.rentLabel, GameData.PayRent);

        this.role.showRole(() => {
            this.orderNode.active = true;
            tween(this.orderNode)
                .to(0.3, { scale: new Vec3(1, 1, 1) })
                .call(() => {
                    if (order.demandDialogue.talkKey){
                        AudioMgr.PlaySound(order.demandDialogue.talkKey);
                    }
                    this.scheduleOnce(() => {
                        MessMgr.emit(GameEvent.RoomCreateMobile, order.mobileKey, this);
                    }, 2);
                    if (this.priceLabel) {
                        this.priceNode && (this.priceNode.active = true);
                        WordAni.PlayWordAni(this.priceLabel, order.orderPriceReference);
                    }
                    if (this.profitLabel) {
                        let profit = order.orderPriceReference;
                        WordAni.PlayWordAni(this.profitLabel, profit);
                    }
                    this.showBut();
                    this.updateDamageTable(order.partType, order.quality);
                    let partPrice =  ShopConfig.getRealPartPrice(order.partType, order.quality);
                    WordAni.PlayWordAni(this.contentLabel, partPrice);
                })
                .start();
                this.showNumShow();
        });
    }

    /** 跟新毁坏评估表 */
    private updateDamageTable(part: PartType, quality: Quality): void {
        /** 零件商品价格 */
        let partPrice =  ShopConfig.getRealPartPrice(part, quality);

        this.damageTable.active = true;
        const arr = this.damageTable.children;
        let arrSort = arr.sort((a, b) => {
            return b.y - a.y;
        });
        for (let i = 0; i < arrSort.length; i++) {
            const element = arrSort[i];
            const 故障成本 = element.getChildByName("故障成本").getComponent(Label);
            const 无故障成本 = element.getChildByName("无故障");
            element.active = true;
            element.scale = new Vec3(0, 0, 1);
            故障成本.node.active = false;
            无故障成本.active = false;
            if(element.name == PartType[part]){
                WordAni.PlayWordAni(故障成本, partPrice);
                故障成本.node.active = true;
            }else{
                无故障成本.active = true;
            }
            tween(element)
                .delay(0.1 * i + 0.3)
                .to(0.3, { scale: new Vec3(1.2, 1.2, 1) })
                .to(0.2, { scale: new Vec3(0.9, 0.9, 1) })
                .to(0.2, { scale: new Vec3(1, 1, 1) })
                .start();
        }

        tween(this.damageTable)
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .call(() => {

            })
            .start();
    }
    /** 显示完成的手机 */
    public showCompleteMobile(mobile: Node): void {
        this.addMobile(mobile, false);
        this.dealButton && (this.dealButton.active = true);
    }

    addMobile(mobile: Node, markDamaged: boolean = false): void {
        this.mobile = mobile;
        mobile.parent = this.mobileAni;
        mobile.scale = new Vec3(0.8, 0.8, 1);
        let op = mobile.getComponent(UIOpacity);
        if (!op) op = mobile.addComponent(UIOpacity);
        op.opacity = 0;
        let mobileComp = mobile.getComponent(Mobile);
        if (mobileComp && this.order && markDamaged) {
            console.log("设置手机损毁零件:", PartType[this.order.partType]);
            mobileComp.setDamagedPart(this.order.partType);
        }
        this.mobileAni.setPosition(0, 200, 0);
        tween(this.mobileAni)
            .to(0.5, { position: new Vec3(0, 0, 0) })
            .start();
        tween(op)
            .to(0.5, { opacity: 255 })
            .start();
    }



    /** 初始化订单信息 */
    private initOrderInfo(order: OrderModel,roleName:string): void {
        this.roleName.string = roleName;
        this.orderLabel.string = order.demandDialogue.talkContent;
        this.orderTag.string = OrderType[order.orderType];
    }
    /** 初始化属性面板 */
    private initNumShow(order: OrderModel): void {
        this.knowledgeShow.showNum(order.knowledge);
        this.wealthShow.showNum(order.wealth);
        this.patienceShow.showNum(order.patience);
    }
    /** 显示面板属性 */
    private showNumShow(callback?: Function): void {
        let op = this.numShow.getComponent(UIOpacity);
        if(!op) op = this.numShow.addComponent(UIOpacity);
        op.opacity = 0;
        this.numShow.active = true;
        tween(op)
            .to(0.5, { opacity: 255 })
            .call(() => {
                callback && callback();
            })
            .start();
    }

    private showOrderInfo(string:string): void {
        this.orderLabel.string = string;
    }
    /** 改变出价显示 */
    private updatePriceLabel(price: number): void {
        if (this.priceLabel){
            WordAni.PlayWordAni(this.priceLabel, price);
        }
    }

    /** NPC 对出价的回应 */
    private onNpcBidResult(data: { result: 'accept' | 'reject' | 'final_reject', price: number, message?: string }): void {
        switch (data.result) {
            case 'accept':
                // NPC 接受 → 走订单接受流程
                this.hideBut();
                if (this.order && this.order.acceptDialogue) {
                    this.showOrderInfo(this.order.acceptDialogue.talkContent);
                }
                this.scheduleOnce(() => {
                    this.priceNode && (this.priceNode.active = false);
                    MessMgr.emit(GameEvent.MobileMoveToRepairRoom, this.order?.mobileKey);
                }, 1.5);
                break;
            case 'reject':
                // NPC 拒绝但可重新出价 → 按钮保持显示
                // 还价
                this.showOrderInfo(this.order.bargainDialogue.talkContent);
                console.warn("NPC 还价：",data.price);
                MessMgr.emit(GameEvent.UpdatePriceLabel, data.price);
                break;
            case 'final_reject':
                // NPC 拒绝且离开 → 走订单拒绝流程
                this.hideBut();
                this.priceNode && (this.priceNode.active = false);
                this.numShow.active = false;
                this.mobileAni.destroyAllChildren();
                WordAni.PlayWordAni(this.profitLabel, 0);
                tween(this.damageTable)
                    .to(0.3, { scale: new Vec3(0, 0, 1) })
                    .start();
                if (this.order && this.order.rejectDialogue) {
                    this.showOrderInfo(this.order.rejectDialogue.talkContent);
                }
                this.scheduleOnce(() => {
                    tween(this.orderNode)
                        .to(0.3, { scale: new Vec3(0, 0, 1) })
                        .start();
                    this.role.hideRole(() => {
                        MessMgr.emit(GameEvent.SettlementJudge);
                    });
                }, 1);
                break;
        }
    }

    /** 显示订单信息及操作按钮 */
    showBut(): void {
        this.priceButton && (this.priceButton.active = true);
        this.acceptButton && (this.acceptButton.active = true);
        this.rejectButton && (this.rejectButton.active = true);
    }

    /** 隐藏订单相关 UI */
    private hideBut(): void {
        this.priceButton && (this.priceButton.active = false);
        this.acceptButton && (this.acceptButton.active = false);
        this.rejectButton && (this.rejectButton.active = false);
    }

    /** 点击出价按钮 */
    onClickPrice(): void {
        AudioMgr.PlaySound(AudioName.BtnClick2);
        UIMgr.getInstance().showDialog(UIName.uiBid);
    }



    /** 点击接受按钮 */
    onClickAccept(): void {
        AudioMgr.PlaySound(AudioName.BtnClick2);
        console.log("点击接受订单");
        this.hideBut();
        this.showOrderInfo(this.order.acceptDialogue.talkContent);
        this.scheduleOnce(() => {
            MessMgr.emit(GameEvent.MobileMoveToRepairRoom, this.order.mobileKey);
        }, 1);
        // 手机转移到维修房间
    }


    
    /** 点击成交按钮 */
    onClickDeal(): void {
        AudioMgr.PlaySound(AudioName.BtnClick2);
        if (!this.order) return;
        GameData.PlayerOrderNum = GameData.PlayerOrderNum + 1;

        // 1. 播放金币飞行动画
       
        GameData.PlayerCoin += this.order.orderPriceDecided;
        CtrMgr.getInstance().ctrLv?.addIncome(this.order.orderPriceDecided);
        AudioMgr.PlaySound(AudioName.ReceiveCoin);
        MessMgr.emit(GameEvent.UpdateGold);
        this.generateGold(this.role.node.worldPosition.clone(),20);

        // 3. 隐藏成交按钮
        this.dealButton && (this.dealButton.active = false);

        // 4. 移除手机，通知维修室清空工作台
        this.mobileAni.destroyAllChildren();
        MessMgr.emit(GameEvent.OrderCompleted);

        // 5. 显示完成对话
        if (this.order.completeDialogue) {
            this.showOrderInfo(this.order.completeDialogue.talkContent);
        }

        // 6. 1s后客人离开，刷新
        tween(this.orderNode)
            .delay(1)
            .to(0.3, { scale: new Vec3(0, 0, 1) })
            .start();
        this.role.hideRoleDelay(1, () => {
            MessMgr.emit(GameEvent.SettlementJudge);
        });
    }

    /** 点击拒绝按钮 */
    onClickReject(): void {
        AudioMgr.PlaySound(AudioName.BtnClick2);
        GameData.PlayerOrderNum = GameData.PlayerOrderNum + 1;
        // CtrMgr.getInstance().ctrLv?.rejectOrder();
        console.log("点击拒绝");
        this.hideBut();
        this.priceNode && (this.priceNode.active = false);
        this.numShow.active = false;
        this.mobileAni.destroyAllChildren();
        WordAni.PlayWordAni(this.profitLabel, 0);
        tween(this.damageTable)
            .to(0.3, { scale: new Vec3(0, 0, 1) })
            .start();
        if(this.order && this.order.rejectDialogue){
            this.showOrderInfo(this.order.rejectDialogue.talkContent);
            this.scheduleOnce(()=>{
                tween(this.orderNode)
                    .to(0.3, { scale: new Vec3(0, 0, 1) })
                    .start();
                this.role.hideRole(()=>{
                    // 发送消息让订单刷新 
                    MessMgr.emit(GameEvent.SettlementJudge);
                });
            }, 1)
        }
    }
    /** 点击设置按钮 */
    onClickSetting(): void {
        AudioMgr.PlaySound(AudioName.BtnClick);
        UIMgr.getInstance().showDialog(UIName.uiSetting);
    }

    /** 点击教程按钮 */
    onClickTutorial(): void {
        AudioMgr.PlaySound(AudioName.BtnClick);
        UIMgr.getInstance().showDialog(UIName.uiTutorial);
    }
}
