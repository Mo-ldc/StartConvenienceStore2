import { _decorator, Component, Label, tween , Node} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WordAni')
export class WordAni extends Component {

    /** 是否自定义文本节点 */
    @property({ tooltip: '是否自定义文本节点' })
    isCustomLabel: boolean = false;
    @property({ type: Label, tooltip: '文本节点', visible: function (this: WordAni) { return this.isCustomLabel; } })
    label: Label = null!;

    @property({ tooltip: '动画持续时间（秒）' })
    duration: number = 1.0;

    @property({ tooltip: '小数位数，0 为整数' })
    decimalPlaces: number = 0;

    private _tween: any = null;
    onLoad(): void {
        if (!this.label) {
            this.label = this.node.getComponent(Label);
        }
    }
    /**
     * 播放动画
     * @param toValue  目标值
     * @param time  动画持续时间（秒）
     * @param fromValue  起始值
     */
    playTo(toValue: number, time?: number, fromValue?: number): void {
        this.stop();

        const startValue = fromValue !== undefined ? fromValue : this._getCurrentNumber();
        const t = time !== undefined ? time : this.duration;

        const data = { value: startValue };
        this._tween = tween(data)
            .to(t, { value: toValue }, {
                onUpdate: () => {
                    if (this.label) {
                        this.label.string = this._formatValue(data.value);
                    }
                }
            })
            .call(() => {
                if (this.label) {
                    this.label.string = this._formatValue(toValue);
                }
            })
            .start();
    }

    stop(): void {
        if (this._tween) {
            this._tween.stop();
            this._tween = null;
        }
    }

    private _getCurrentNumber(): number {
        if (this.label && this.label.string) {
            const num = parseFloat(this.label.string);
            return isNaN(num) ? 0 : num;
        }
        return 0;
    }

    private _formatValue(value: number): string {
        if (this.decimalPlaces > 0) {
            return value.toFixed(this.decimalPlaces);
        }
        return Math.round(value).toString();
    }

    onDestroy(): void {
        this.stop();
    }
    
    /** 公共动画播放 */
    static PlayWordAni(target:Node|Label, toValue: number, time?: number, fromValue?: number): void {
        const wordAni = target.getComponent(WordAni);
        const label = target.getComponent(Label);
        if (wordAni) {
            wordAni.playTo(toValue, time, fromValue);
        }else{
            // console.log("未找到WordAni组件:", target.name);
            if (label) {
                label.string = toValue.toString();
            }
        }
    }
}


