import { _decorator, Component, Node, tween, Vec3, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AniFloating')
export class AniFloating extends Component {
    @property({ tooltip: '浮动距离' })
    distance: number = 10;

    @property({ tooltip: '浮动时长(秒)' })
    duration: number = 1.0;

    @property({ tooltip: '是否自动播放' })
    playOnStart: boolean = true;

    private _originPos: Vec3 = new Vec3();
    private _floatingTween: Tween<Node> | null = null;
    private _playing: boolean = false;

    start() {
        this._originPos.set(this.node.position);
        if (this.playOnStart) {
            this.play();
        }
    }

    play() {
        if (this._playing) return;
        this._playing = true;
        this._applyFloating();
    }

    stop() {
        this._playing = false;
        if (this._floatingTween) {
            this._floatingTween.stop();
            this._floatingTween = null;
        }
        this.node.setPosition(this._originPos);
    }

    private _applyFloating() {
        const upPos = this._originPos.clone().add3f(0, this.distance, 0);
        const downPos = this._originPos.clone().add3f(0, -this.distance, 0);
        this._floatingTween = tween(this.node)
            .to(this.duration, { position: upPos })
            .to(this.duration, { position: downPos })
            .union()
            .repeatForever()
            .start();
    }

    onDestroy() {
        this.stop();
    }

    get isPlaying(): boolean {
        return this._playing;
    }
}
