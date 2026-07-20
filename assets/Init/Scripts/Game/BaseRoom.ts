import { _decorator, Component, Enum, EventTouch, Label, Node, tween, Vec3 } from 'cc';
import { RoomEnum } from '../Data/Enum/RoomEnum';
import { GameData } from '../Data/Data/GameData';
import { MessMgr } from '../Mgr/MessMgr';
import { GameEvent } from '../Data/Enum/GameEvent';
import { AudioMgr, AudioName } from '../Mgr/AudioMgr';
import { UIMgr, UIName } from '../Mgr/UIMgr';
import { WordAni } from '../AniTool/WordAni';
const { ccclass, property } = _decorator;
/**
 * 房间基类
 */
@ccclass('BaseRoom')
export class BaseRoom extends Component {
    /** 房间类型 */
    @property({type: Enum(RoomEnum), tooltip: '房间类型' })
    roomType: RoomEnum = RoomEnum.LobbyRoom;

    /** 初始位置 */
    @property({ tooltip: '初始位置' })
    private initPosition: Vec3 = new Vec3(0, 0, 0);
    /** 显示位置 */
    @property({ tooltip: '显示位置' })
    private showPosition: Vec3 = new Vec3(0, 0, 0);
    /** 隐藏位置 */
    @property({ tooltip: '隐藏位置' })
    private hidePosition: Vec3 = new Vec3(0, 0, 0);

    private switchRoomTime: number = 0.2;

    /** 金币文本 */
    @property({ type: Label, tooltip: '金币文本' })
    goldLabel: Label = null;
    /** 金币汇聚位置节点 */
    @property({ type: Node, tooltip: '金币汇聚位置节点' })
    goldConvergePosition: Node = null;

    mobile: Node = null;

    /** 组件激活时自动注册事件 */
    protected onEnable(): void {
        this.registerEvent();
    }

    /** 组件禁用时自动注销事件 */
    protected onDisable(): void {
        this.resetEvent();
    }

    /** 注册事件监听 */
    registerEvent() {
        MessMgr.on(GameEvent.UpdateGold, this.updateGoldLabel, this);
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    /** 取消事件监听 */
    resetEvent() {
        MessMgr.off(GameEvent.UpdateGold, this.updateGoldLabel, this);
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }


    /**
     * 初始化
     * @param args 可变参数，由子类定义具体含义
     */
    init(...args: any[]) {
        this.node.setPosition(this.initPosition);
        // console.warn("初始化房间:", this.roomType, " ", this.node.name, " ", this.initPosition.toString());
        this.updateGoldLabel();
    }
    /** 显示房间 */
    showRoom(){
        tween(this.node)
            .to(this.switchRoomTime, { position: this.showPosition })
            .start();
    }
    /** 隐藏房间 */
    hideRoom(){
        tween(this.node)
            .to(this.switchRoomTime, { position: this.hidePosition })
            .start();
    }
    protected onTouchStart(event: EventTouch) {
        // console.log("触摸开始:", this.node.name)
    }
    protected onTouchMove(event: EventTouch) {
        // console.log("触摸移动:", this.node.name)
    }
    protected onTouchEnd(event: EventTouch) {
        // console.log("触摸结束:", this.node.name)
        // const startPos = event.getUILocation();
        // this.generateGold(new Vec3(startPos.x, startPos.y, 0), 20);
    }

    /** 在某个位置生成特定金币飞向 */
    generateGold(startPos: Vec3, amount: number): void {
        if(!this.goldConvergePosition){
            console.warn("金币汇聚位置节点不存在:", this.node.name);
            return;
        }
        console.log("生成金币:", startPos, amount);
        const targetPos = this.goldConvergePosition.worldPosition.clone();
        MessMgr.emit(GameEvent.GoldFly, startPos, targetPos, amount);
    }
    /** 增加手机对象 */
    addMobile(...args: any[]) {

    }
    /** 更新金币文本 */
    protected  updateGoldLabel() {
        let gold = GameData.PlayerCoin;
        if (this.goldLabel) {
            const wordAni = this.goldLabel.getComponent(WordAni);
            if (wordAni) {
                wordAni.playTo(gold);
            } else {
                this.goldLabel.string = gold.toString();
            }
        }
    }

    /** 点击增加钱 */
    private onClickAddGold(): void {
        AudioMgr.PlaySound(AudioName.BtnClick);
        // MessMgr.emit(GameEvent.UpdateGold);
        UIMgr.getInstance().showDialog(UIName.uiLoan)
    }
}


