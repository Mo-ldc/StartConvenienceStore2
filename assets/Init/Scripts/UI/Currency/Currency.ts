import { _decorator, Component, Node, Vec3, lerp } from 'cc';
import { PoolMgr } from '../../Mgr/PoolMgr';
const { ccclass, property } = _decorator;

@ccclass('Currency')
export class Currency extends Component {
    num: number = 0;
    /**
     * 金币动画状态
     * 0 = 爆炸阶段：从中心点向外抛物线爆发
     * 1 = 跃动阶段：在散落位置轻微跳动
     * 2 = 飞向目标阶段：从散落位置飞向目标
     * 3 = 回收阶段
     */
    aniState = 0;

    @property({ tooltip: "货币Key" })
    Key: string = "";

    /** 爆发中心点（世界坐标） */
    private _centerPos: Vec3 = null;
    /** 最终目标位置（世界坐标） */
    private _targetPos: Vec3 = null;
    /** 散落位置（世界坐标） */
    private _scatterPos: Vec3 = null;
    /** 飞行阶段起始位置（世界坐标） */
    private _flyStartPos: Vec3 = null;
    /** 抛物线控制点（贝塞尔顶点） */
    private _parabolaControlPoint: Vec3 = null;
    /** 爆炸动画持续时间 */
    private _scatterDuration: number = 0.4;
    /** 跃动阶段等待延迟 */
    private _bounceDelay: number = 0.3;
    /** 跃动动画持续时间 */
    private _bounceDuration: number = 0.2;
    /** 飞向目标持续时间 */
    private _flyDuration: number = 0.8;
    /** 累计时间 */
    private _elapsedTime: number = 0;
    /** 动画完成回调 */
    private _callback: Function = null;
    /** 是否已完成落地跃动 */
    private _isBounceDone: boolean = false;

    /**
     * 播放金币出现动画
     * @param centerPos 金币爆发中心点（世界坐标）
     * @param targetPos 金币最终目标位置（世界坐标）
     * @param callback 到达目标后的回调
     */
    playShow(centerPos: Vec3, targetPos: Vec3, callback?: Function) {
        this._centerPos = centerPos;
        this._targetPos = targetPos;
        this._callback = callback;

        this.node.setWorldPosition(centerPos);

        const scatterRadius = 80 + Math.random() * 40;
        const scatterAngle = Math.random() * Math.PI * 2;

        this._scatterPos = new Vec3(
            centerPos.x + Math.cos(scatterAngle) * scatterRadius,
            centerPos.y + Math.sin(scatterAngle) * scatterRadius,
            0
        );

        const controlPointHeight = 200 + Math.random() * 50;
        const midX = (centerPos.x + this._scatterPos.x) / 2;
        const midY = (centerPos.y + this._scatterPos.y) / 2;
        this._parabolaControlPoint = new Vec3(midX, midY + controlPointHeight, 0);

        this._flyStartPos = null;
        this._isBounceDone = false;

        this.aniState = 0;
        this._elapsedTime = 0;
    }

    update(dt: number): void {
        switch (this.aniState) {
            case 0:
                this._updateScatter(dt);
                break;
            case 1:
                this._updateBounce(dt);
                break;
            case 2:
                this._updateFly(dt);
                break;
        }
    }

    /** 爆炸散落：二次贝塞尔曲线从中心飞到散落位置 */
    private _updateScatter(dt: number) {
        this._elapsedTime += dt;
        const progress = Math.min(this._elapsedTime / this._scatterDuration, 1);

        const t = progress;
        const oneMinusT = 1 - t;

        const pos = new Vec3();
        pos.x = oneMinusT * oneMinusT * this._centerPos.x +
                2 * oneMinusT * t * this._parabolaControlPoint.x +
                t * t * this._scatterPos.x;
        pos.y = oneMinusT * oneMinusT * this._centerPos.y +
                2 * oneMinusT * t * this._parabolaControlPoint.y +
                t * t * this._scatterPos.y;
        pos.z = 0;

        this.node.setWorldPosition(pos);

        if (progress >= 1) {
            this._flyStartPos = this.node.worldPosition.clone();
            this.aniState = 1;
            this._elapsedTime = 0;
        }
    }

    /** 落地跃动：在散落位置上下轻微弹跳 */
    private _updateBounce(dt: number) {
        this._elapsedTime += dt;
        const progress = Math.min(this._elapsedTime / this._bounceDuration, 1);

        if (!this._isBounceDone) {
            const bounceHeight = 15;
            let verticalOffset = 0;

            if (progress < 0.5) {
                const riseProgress = progress / 0.5;
                verticalOffset = bounceHeight * Math.sin(riseProgress * Math.PI / 2);
            } else {
                const fallProgress = (progress - 0.5) / 0.5;
                verticalOffset = bounceHeight * Math.cos(fallProgress * Math.PI / 2);
            }

            const bouncePos = new Vec3(
                this._scatterPos.x,
                this._scatterPos.y + verticalOffset,
                0
            );
            this.node.setWorldPosition(bouncePos);
        } else {
            this.node.setWorldPosition(this._scatterPos);
        }

        if (progress >= 1 && !this._isBounceDone) {
            this._isBounceDone = true;
            this._elapsedTime = 0;
            setTimeout(() => {
                if (this.aniState === 1) {
                    this._flyStartPos = this.node.worldPosition.clone();
                    this.aniState = 2;
                    this._elapsedTime = 0;
                }
            }, 100);
        }
    }

    /** 飞向目标：从散落位置线性插值到目标位置 */
    private _updateFly(dt: number) {
        this._elapsedTime += dt;
        const progress = Math.min(this._elapsedTime / this._flyDuration, 1);

        const easeT = this._easeOutCubic(progress);

        const newPos = new Vec3();
        newPos.x = lerp(this._flyStartPos.x, this._targetPos.x, easeT);
        newPos.y = lerp(this._flyStartPos.y, this._targetPos.y, easeT);
        newPos.z = 0;

        this.node.setWorldPosition(newPos);

        if (progress >= 1) {
            this._callback && this._callback();
            this.dispose();
        }
    }

    /** 缓动函数：三次方缓出 */
    private _easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    /** 回收货币到对象池 */
    dispose() {
        this.aniState = 0;
        this._elapsedTime = 0;
        this._callback = null;
        this.node.parent = null;
        PoolMgr.put(this.Key, this.node);
    }
}
