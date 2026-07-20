import { _decorator, Color, Component, Node, Sprite, tween, v3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PartScrew')
export class PartScrew extends Component {
    @property(Sprite)
    backSprite: Sprite = null;
    @property(Node)
    screwAni: Node = null;

    isScrewed: boolean = false;
    isPlayingAni: boolean = false;

    backColorOn: string = "#05ff3bff";
    backColorOff: string = "#ff0000ff";

    onChanged: (() => void) | null = null;

    init(isScrewed: boolean) {
        this.isScrewed = isScrewed;
        this.isPlayingAni = false;
        const color = isScrewed ? this.backColorOn : this.backColorOff;
        this.backSprite.color = this.ChangeBackColor(color);
        this.screwAni.active = isScrewed;
    }

    public unscrew(aniTime: number = 0.4): void {
        if (!this.isScrewed) {
            return;
        }
        this.isScrewed = false;
        this.playAni(aniTime, () => {
            this.screwAni.active = false;
            this.backSprite.color = this.ChangeBackColor(this.backColorOff);
            this.onChanged?.();
        });
    }

    public screw(aniTime: number = 0.4): void {
        if (this.isScrewed) {
            return;
        }
        this.isScrewed = true;

        this.playAni(aniTime, () => {
            this.screwAni.active = true;
            this.backSprite.color = this.ChangeBackColor(this.backColorOn);
            this.onChanged?.();
        });
    }

    private playAni(aniTime: number, cb: () => void) {
        if (this.isPlayingAni) return;
        this.isPlayingAni = true;

        this.screwAni.active = true;
        this.screwAni.angle = 0;

        const start = v3(1, 1, 1);
        const big = v3(1.5, 1.5, 1);
        const targetAngle = 360 * 5;
        const isUnscrewing = !this.isScrewed;

        const from = isUnscrewing ? start : big;
        const to = isUnscrewing ? big : start;

        this.screwAni.scale = from;
        tween(this.screwAni)
            .to(aniTime, { angle: targetAngle, scale: to })
            .call(() => {
                this.isPlayingAni = false;
                cb();
            })
            .start();
    }

    ChangeBackColor(colorStr: string): Color {
        let color = new Color();
        Color.fromHEX(color, colorStr);
        return color;
    }
}
