import { _decorator, Component, ProgressBar, UITransform, Vec3 , Node } from 'cc';
const { ccclass, property } = _decorator;

enum WhiteState {
    IDLE,
    DELAY,
    FOLLOW,
}

@ccclass('BaseHpBar')
export class BaseBar extends Component {
    public upBar: ProgressBar = null!;
    public downBar: ProgressBar = null!;
    public followDelay: number = 0.3;
    public followDuration: number = 0.4;

    private _whiteState: WhiteState = WhiteState.IDLE;
    private _whiteTimer: number = 0;
    private _whiteFrom: number = 0;
    private _whiteTo: number = 0;
    private _lastSetPercent: number = 1;

    // /** 血条显示计时器（受伤后开始计时，超时隐藏） */
    // private showTimer: number = 0;
    // /** 显示时长 */
    // @property({tooltip: '显示时长' })
    // public showDuration: number = 2;
    /** 池回收键 */
    public poolKey: string = "Bar";

    /** 位置与同步节点的偏移 */
    private offset: Vec3 = new Vec3(80, 80, 0);

    /** 上一帧值 */
    private lastVar: number = 0;

    onLoad() {
        if (!this.upBar) {
            this.upBar = this.node.getChildByName('upBar')?.getComponent(ProgressBar);
        }
        if (!this.downBar) {
            this.downBar = this.node.getChildByName('downBar')?.getComponent(ProgressBar);
        }
    }

    start() {
        this.setProgress(0);
    }

    /** 更新进度条数据 */
    upDateData(dt: number, curVar: number, maxVar: number): void {
        // if (curVar < this.lastVar) {
        //     this.showTimer = 0;
        // }
        // this.lastVar = curVar;
        // this.showTimer += dt;
        // if (curVar >= maxVar || this.showTimer > this.showDuration) {
        //     this.node.active = false;
        //     return;
        // }

        let percent = curVar / maxVar;
        this.setProgress(percent);
        this.upDateVar(dt);
    }
    /** 更新位置 */
    upDatePos(worldPos: Vec3): void {
        let pos = worldPos.add(this.offset);
        this.node.setWorldPosition(pos);
    }

    private upDateVar(dt: number) {
        if (!this.downBar) return;
        if (this._whiteState === WhiteState.IDLE) return;

        this._whiteTimer += dt;

        if (this._whiteState === WhiteState.DELAY) {
            if (this._whiteTimer >= this.followDelay) {
                this._whiteState = WhiteState.FOLLOW;
                this._whiteTimer = 0;
                this._whiteFrom = this.downBar.progress;
                this._whiteTo = this._lastSetPercent;
            }
            return;
        }

        if (this._whiteState === WhiteState.FOLLOW) {
            if (this._whiteTimer >= this.followDuration) {
                this.downBar.progress = this._whiteTo;
                this._whiteState = WhiteState.IDLE;
                return;
            }

            const t = this._whiteTimer / this.followDuration;
            const eased = 1 - (1 - t) * (1 - t);
            this.downBar.progress = this._whiteFrom + (this._whiteTo - this._whiteFrom) * eased;
        }
    }
    

    public setProgress(percent: number) {
        percent = Math.min(1, Math.max(0, percent));
        const dropped = percent < this._lastSetPercent;
        this._lastSetPercent = percent;
        if (!this.upBar) return;
        this.upBar.progress = percent;
        if (!this.downBar) return;
        if (this.downBar.progress > percent) {
            if (this._whiteState === WhiteState.IDLE || dropped) {
                this._whiteState = WhiteState.DELAY;
                this._whiteTimer = 0;
            }
        } else {
            this._whiteState = WhiteState.IDLE;
            this.downBar.progress = percent;
        }
    }
}


