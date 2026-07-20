import { _decorator, Component, EventTouch, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 控制器基类
 * 所有游戏控制器继承此类，由 CtrMgr 统一驱动 update / lateUpdate
 */
@ccclass('CtrBase')
export class CtrBase extends Component {

    canUpDate: boolean = true;
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

    }

    /** 取消事件监听 */
    resetEvent() {

    }

    /**
     * 初始化
     * @param args 可变参数，由子类定义具体含义
     */
    init(...args: any[]) {

    }
    /**
     * 回收
     */
    dispose() {

    }

    /**
     * 每帧更新，由 CtrMgr.updateCtr 调用
     * @param dt 帧间隔（秒）
     */
    upDateCtr(dt: number) {

    }

    /**
     * 每帧晚更新，由 CtrMgr.lateUpdateCtr 调用
     * @param dt 帧间隔（秒）
     */
    lateUpdateCtr(dt: number) {

    }

    onTouchStart(event: EventTouch) {

    }
    onTouchMove(event: EventTouch) {

    }
    onTouchEnd(event: EventTouch) {

    }
}


