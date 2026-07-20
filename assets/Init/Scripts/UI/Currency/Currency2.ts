import { _decorator, Component, Node, Vec3, lerp } from 'cc';
import { PoolMgr } from '../../Mgr/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('Currency2')
export class Currency2 extends Component {
    /**
     * 动画状态
     * 0 = 出现阶段：缩放弹入
     * 1 = 等待阶段：停在原地等待飞行信号
     * 2 = 飞行阶段：直线飞向目标
     */
    private _state = 0;

    @property({ tooltip: "货币Key" })
    Key: string = "";

    /** 起始位置（世界坐标） */
    private _startPos: Vec3 = null;
    /** 目标位置（世界坐标） */
    private _targetPos: Vec3 = null;
    /** 出场淡入持续时间 */
    private _scaleInDuration: number = 0.15;
    /** 飞行前的等待时间 */
    private _flyDelay: number = 0;
    /** 飞行持续时间 */
    private _flyDuration: number = 0.5;
    /** 累计时间 */
    private _elapsed: number = 0;
    /** 完成回调 */
    private _callback: Function = null;

    /**
     * 播放金币出现动画（纯视觉，数值已通过事件更新）
     * @param startPos 出生位置（世界坐标）
     * @param targetPos 目标位置（世界坐标）
     * @param flyDelay 飞行前额外的等待时间（秒），用于多枚金币逐个飞
     * @param callback 到达目标后的回调
     */
    playShow(startPos: Vec3, targetPos: Vec3, flyDelay: number = 0, callback?: Function) {
        this._startPos = startPos;
        this._targetPos = targetPos;
        this._flyDelay = flyDelay;
        this._callback = callback;
        this._elapsed = 0;
        this._state = 0;

        this.node.setWorldPosition(startPos);
        this.node.setScale(0, 0, 1);
    }

    update(dt: number): void {
        switch (this._state) {
            case 0:
                this._updateScaleIn(dt);
                break;
            case 1:
                this._updateWait(dt);
                break;
            case 2:
                this._updateFly(dt);
                break;
        }
    }

    /** 出现阶段：缩放弹入 */
    private _updateScaleIn(dt: number) {
        this._elapsed += dt;
        const progress = Math.min(this._elapsed / this._scaleInDuration, 1);
        const s = this._easeOutBack(progress);
        this.node.setScale(s, s, 1);

        if (progress >= 1) {
            this._state = 1;
            this._elapsed = 0;
        }
    }

    /** 等待阶段：停在原地，等飞行延迟结束 */
    private _updateWait(dt: number) {
        this._elapsed += dt;
        if (this._elapsed >= this._flyDelay) {
            this._state = 2;
            this._elapsed = 0;
        }
    }

    /** 飞行阶段：直线飞向目标位置 */
    private _updateFly(dt: number) {
        this._elapsed += dt;
        const progress = Math.min(this._elapsed / this._flyDuration, 1);
        const t = this._easeOutCubic(progress);

        const pos = new Vec3();
        pos.x = lerp(this._startPos.x, this._targetPos.x, t);
        pos.y = lerp(this._startPos.y, this._targetPos.y, t);
        pos.z = 0;
        this.node.setWorldPosition(pos);

        if (progress >= 1) {
            this._callback && this._callback();
            this.dispose();
        }
    }

    /** 缓动函数：三次方缓出 */
    private _easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    /** 缓动函数：回弹缓出 */
    private _easeOutBack(t: number): number {
        const s = 1.70158;
        return (t = t - 1) * t * ((s + 1) * t + s) + 1;
    }

    /** 回收货币到对象池 */
    dispose() {
        this._state = 0;
        this._elapsed = 0;
        this._callback = null;
        this.node.parent = null;
        PoolMgr.put(this.Key, this.node);
    }
}
