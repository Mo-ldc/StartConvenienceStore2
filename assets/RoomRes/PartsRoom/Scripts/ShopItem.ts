import { _decorator, Color, Component, Enum, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ShopConfigData } from 'db://assets/Init/Scripts/Data/Data/ConfigData';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
import { Quality } from 'db://assets/Init/Scripts/Data/Enum/Enum';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import { PartType } from 'db://assets/Init/Scripts/Data/Type/ObjType';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import { UIMgr } from 'db://assets/Init/Scripts/Mgr/UIMgr';
const { ccclass, property } = _decorator;
@ccclass('ShopItemSprSet')
class ShopItemSprSet{
    /** 零件类型 */
    @property({ type: Enum(PartType), tooltip: '零件类型' })
    partType: PartType = PartType.无;
    /** 低端真货图片 */
    @property({ type: SpriteFrame, tooltip: '低端真货图片' })
    lowSpr:SpriteFrame = null;
    /** 低假货 */
    @property({ type: SpriteFrame, tooltip: '低假货图片' })
    lowFakeSpr:SpriteFrame = null;
    /**中 */
    @property({ type: SpriteFrame, tooltip: '中端真货图片' })
    middleSpr:SpriteFrame = null;
    /** 中假货 */
    @property({ type: SpriteFrame, tooltip: '中假货图片' })
    middleFakeSpr:SpriteFrame = null;
    /** 高端真货图片 */
    @property({ type: SpriteFrame, tooltip: '高端真货图片' })
    highSpr:SpriteFrame = null;
    /** 高假货 */
    @property({ type: SpriteFrame, tooltip: '高假货图片' })
    highFakeSpr:SpriteFrame = null;
}
@ccclass('ShopItem')
export class ShopItem extends Component {
    /** 普通背景色 */
    private static readonly NORMAL_COLOR: string = "#ffffffff";
    /** 目标背景色 */
    private static readonly TARGET_COLOR: string = "#ff6565ff";

    @property({ type: ShopItemSprSet, tooltip: '零件图片设置' })
    sprSetArr: ShopItemSprSet[] = [];

    @property({ type: Sprite, tooltip: '背景' })
    bg:Sprite = null;
    @property({ type: Sprite, tooltip: '商品图片' })
    shopSpr:Sprite = null;
    @property({ type: Node, tooltip: '购买按钮' })
    buy:Node = null;
    @property({ type: Label, tooltip: '价格文本' })
    priceLabel:Label = null;

    @property({ type: Label, tooltip: '商品名称文本' })
    shopNameLabel:Label = null;

    /** 数量文本 */
    @property({ type: Label, tooltip: '数量文本' })
    countLabel:Label = null;

    @property({ type: Node, tooltip: '锁节点' })
    lock:Node = null;

    /** 波动节点 */
    @property({ type: Node, tooltip: '波动节点' })
    wave:Node = null;
    /** 波动文本 */
    @property({ type: Label, tooltip: '波动文本' })
    waveLabel:Label = null;

    /** 对象键值 */
    objKey:string = "";
    protected onEnable(): void {
        MessMgr.on(GameEvent.UpdateObjectCount, this.updateCount, this);
    }
    protected onDisable(): void {
        MessMgr.off(GameEvent.UpdateObjectCount, this.updateCount, this);
    }

    /** 商品数据 */
    shopData:ShopConfigData = null;
    init(shopData:ShopConfigData): void {
        this.shopData = shopData;
        this.shopNameLabel.string = shopData.shopName;
        this.priceLabel.string = shopData.shopPrice.toString();
        this.objKey = shopData.shopKey;
        // this.shopSpr.spriteFrame = shopData.shopSprite;
        const data = this.sprSetArr.find(spr => spr.partType === shopData.partType);
        if (data) {
            switch(shopData.quality) {
                case Quality.低: this.shopSpr.spriteFrame = shopData.isReal ? data.lowSpr : data.lowFakeSpr; break;
                case Quality.中: this.shopSpr.spriteFrame = shopData.isReal ? data.middleSpr : data.middleFakeSpr; break;
                case Quality.高: this.shopSpr.spriteFrame = shopData.isReal ? data.highSpr : data.highFakeSpr; break;
            }
        }
        const saveData = GameData.getObjectStorageData(shopData.shopKey);
        this.lock.active = false;
        if(shopData && saveData){
            this.lock.active = shopData.isLock && !saveData.isUnlocked;
        }
        this.updateCount();
        this.setTarget(false);
    }

    /** 设置是否为目标商品：目标显示红色背景，否则显示普通色 */
    setTarget(isTarget: boolean): void {
        if (!this.bg) return;
        const color = new Color();
        Color.fromHEX(color, isTarget ? ShopItem.TARGET_COLOR : ShopItem.NORMAL_COLOR);
        this.bg.color = color;
    }


    /** 跟新数量文本 */
    private updateCount(): void {
        const saveData = GameData.getObjectStorageData(this.objKey);
        if(!saveData){
            return;
        }
        this.countLabel.string = saveData.count.toString();
    }

    /** 点击购买 */
    private onClickBuy(): void {
        if(!this.shopData){
            return;
        }
        const saveData = GameData.getObjectStorageData(this.objKey);
        if(!saveData){

            return;
        }
        if(this.shopData.isLock && !saveData.isUnlocked){
            UIMgr.getInstance().showTip("请先解锁");
            return;
        }

        if(GameData.PlayerCoin < this.shopData.shopPrice){
            UIMgr.getInstance().showTip("金币不足");
            return;
        }
        GameData.PlayerCoin -= this.shopData.shopPrice;
        AudioMgr.PlaySound(AudioName.PayCoin);

        console.log("购买成功:", this.shopData.shopName);
        GameData.setObjectStorageData(this.objKey, { count: saveData.count + 1, isUnlocked: true });
        MessMgr.emit(GameEvent.UpdateObjectCount, this.objKey);
        MessMgr.emit(GameEvent.UpdateGold);
    }

    /** 点击解锁 */
    private onClickUnlock(): void {
        const saveData = GameData.getObjectStorageData(this.objKey);
        if(!saveData || saveData.isUnlocked){
            return;
        }
        GameData.setObjectStorageData(this.objKey, { count: saveData.count, isUnlocked: true });
        MessMgr.emit(GameEvent.UpdateObjectCount, this.objKey);
    }
}


