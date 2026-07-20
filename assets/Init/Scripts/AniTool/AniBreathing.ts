import { _decorator, Component, Node, tween, Vec3, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AniBreathing')
export class AniBreathing extends Component {
    @property({ tooltip: '缩放比例' })
    scaleRatio: number = 1.05;

    @property({ tooltip: '单次缩放时长(秒)' })
    duration: number = 0.6;

    @property({ tooltip: '是否自动播放' })
    playOnStart: boolean = true;

    private _originalScale: Vec3 = new Vec3();
    private _breathingTween: Tween<Node> | null = null;
    private _playing: boolean = false;

    start() {
        this._originalScale.set(this.node.scale);
        if (this.playOnStart) {
            this.play();
        }
    }

    play() {
        if (this._playing) return;
        this._playing = true;
        this._applyBreathing();
    }

    stop() {
        this._playing = false;
        if (this._breathingTween) {
            this._breathingTween.stop();
            this._breathingTween = null;
        }
        this.node.setScale(this._originalScale);
    }

    private _applyBreathing() {
        const targetScale = this._originalScale.clone().multiplyScalar(this.scaleRatio);
        this._breathingTween = tween(this.node)
            .to(this.duration, { scale: targetScale })
            .to(this.duration, { scale: this._originalScale })
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
