import { _decorator, Color, Component, Enum, Label, Sprite, SpriteFrame, tween, Tween, Vec3 } from 'cc';
import { ShopListConfigData } from 'db://assets/Init/Scripts/Data/Data/ConfigData';
import { PartType } from 'db://assets/Init/Scripts/Data/Type/ObjType';
const { ccclass, property } = _decorator;
@ccclass('ShopItemBtnSprSet')
class ShopItemBtnSprSet {
    /** 零件类型 */
    @property({ type: Enum(PartType), tooltip: '零件类型' })
    partType: PartType = PartType.无;
    /** 零件图片 */
    @property({ type: SpriteFrame, tooltip: '零件图片' })
    partSpr: SpriteFrame = null;
}

@ccclass('ShopItemBtn')
export class ShopItemBtn extends Component {
    @property(Label)
    shopTypeName: Label = null;
    @property(ShopItemBtnSprSet)
    sprSetArr: ShopItemBtnSprSet[] = [];
    @property({ type: Sprite, tooltip: '背景图片' })
    bgSprite: Sprite = null;
    /** 选中图片 */
    @property({ type: SpriteFrame, tooltip: '选中图片' })
    selectSprite: SpriteFrame = null;
    /** 未选中图片 */
    @property({ type: SpriteFrame, tooltip: '未选中图片' })
    unselectSprite: SpriteFrame = null;

    /** 选中放大倍数 */
    @property({ tooltip: '选中放大倍数' })
    selectScale: number = 1.1;

    /** 背景精灵 */
    private sprite: Sprite = null;

    /** 该按钮对应的种类数据 */
    shopListData: ShopListConfigData = null;
    @property(Label)
    private nameLabel: Label = null;

    /** 选种颜色 */
    private selectColor: string = "#ffffff";

    /** 未选中颜色 */
    private unselectColor: string = "#402504";

    /** 初始化：绑定种类数据并显示种类名称 */
    init(data: ShopListConfigData): void {
        this.shopListData = data;
        if (this.shopTypeName) {
            this.shopTypeName.string = data.shopListName;
        }
        const sprData = this.sprSetArr.find(spr => spr.partType === data.partType);
        if (sprData && sprData.partSpr) {
            this.bgSprite.spriteFrame = sprData.partSpr;
        }
    }

    /** 选中状态：切换选中图并放大 */
    select(): void {
        const spr = this.getSprite();
        if (spr && this.selectSprite) {
            spr.spriteFrame = this.selectSprite;
        }
        this.setScale(this.selectScale);
    }

    /** 未选中状态：切换未选中图并恢复正常大小 */
    unselect(): void {
        const spr = this.getSprite();
        if (spr && this.unselectSprite) {
            spr.spriteFrame = this.unselectSprite;
        }
        this.setScale(1);
       
        let labelColor = new Color(255, 255, 255);
        Color.fromHEX(labelColor, this.unselectColor);
        if (this.nameLabel) {
            this.nameLabel.color = labelColor;
            this.nameLabel.enableOutline = false;
        }
    }

    private setScale(scale: number): void {
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(0.1, { scale: new Vec3(scale, scale, 1) })
            .start();
        let labelColor = new Color(255, 255, 255);
        Color.fromHEX(labelColor, this.selectColor);
        if (this.nameLabel) {
            this.nameLabel.color = labelColor;
            this.nameLabel.enableOutline = true;
            this.nameLabel.outlineColor = new Color(0, 0, 0);
            this.nameLabel.outlineWidth = 2;
        }
    }

    private getSprite(): Sprite {
        if (!this.sprite) {
            this.sprite = this.node.getComponent(Sprite);
        }
        return this.sprite;
    }
}
