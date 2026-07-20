import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 数值显示
 */
@ccclass('NumShow')
export class NumShow extends Component {
    /** 显示图片 */
    @property({ type: SpriteFrame , tooltip: '显示图片' })
    public showImg: SpriteFrame = null;
    /** 隐藏图片 */
    @property({ type: SpriteFrame , tooltip: '隐藏图片' })
    public hideImg: SpriteFrame = null;


    init() {
        this.showNum(0);
    }

    showNum(num: number) {
        const arr = this.node.children;
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            const show = element.getComponent(Sprite);
            if(!show) continue;
            show.spriteFrame = i < num ? this.showImg : this.hideImg;
        }
    }
}


