import { _decorator, Node, Prefab, ScrollView } from 'cc';
import { BaseRoom } from 'db://assets/Init/Scripts/Game/BaseRoom';
import { ShopConfig } from 'db://assets/Init/Scripts/Data/Configs/ShopConfig';
import { ShopListConfigData } from 'db://assets/Init/Scripts/Data/Data/ConfigData';
import { PoolMgr } from 'db://assets/Init/Scripts/Mgr/PoolMgr';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { ShopItem } from './ShopItem';
import { ShopItemBtn } from './ShopItemBtn';
const { ccclass, property } = _decorator;

/** 配件商店 */
@ccclass('PartsRoom')
export class PartsRoom extends BaseRoom {
    /** 商品列表（滚动视图，商品对象生成到其 content 下） */
    @property({ type: ScrollView, tooltip: '商品列表' })
    shopList: ScrollView = null;
    /** 商品对象预制体（ShopItem） */
    @property({ type: Prefab, tooltip: '商品预制体' })
    shopPrefab: Prefab = null;

    /** 种类按钮根节点（生成的种类按钮挂到此节点下） */
    @property({ type: Node, tooltip: '种类按钮根节点' })
    buttonRoot: Node = null;
    /** 种类按钮预制体（ShopItemBtn） */
    @property({ type: Prefab, tooltip: '按钮预制体' })
    buttonPrefab: Prefab = null;

    /** 配件（碎片）按钮 */
    @property({ type: Node, tooltip: '配件按钮' })
    partButton: Node = null;
    /** 商品按钮 */
    @property({ type: Node, tooltip: '商品按钮' })
    shopButton: Node = null;

    /** 当前选中的商品种类名称 */
    curShopType: string = "";

    /** 当前显示的种类按钮（用于回收复用） */
    private curBtnList: Node[] = [];
    /** 当前显示的商品对象（用于回收复用） */
    private curItemList: Node[] = [];

    /** 初始化：默认显示零件(配件)种类及其第一个种类的商品 */
    init(...args: any[]): void {
        super.init(...args);
        this.showTypeList(ShopConfig.shopPartList);
    }

    /** 注册事件监听：顶部两个切换按钮 */
    registerEvent(): void {
        super.registerEvent();
        this.partButton?.on(Node.EventType.TOUCH_END, this.onClickPartButton, this);
        this.shopButton?.on(Node.EventType.TOUCH_END, this.onClickShopButton, this);
    }

    /** 取消事件监听 */
    resetEvent(): void {
        super.resetEvent();
        this.partButton?.off(Node.EventType.TOUCH_END, this.onClickPartButton, this);
        this.shopButton?.off(Node.EventType.TOUCH_END, this.onClickShopButton, this);
        this.recycleButtons();
        this.recycleItems();
    }

    /** 点击「配件（碎片）」按钮：显示配件种类 */
    private onClickPartButton(): void {
        AudioMgr.PlaySound(AudioName.BtnClick);
        this.showTypeList(ShopConfig.shopPartList);
    }

    /** 点击「商品」按钮：显示商品种类 */
    private onClickShopButton(): void {
        AudioMgr.PlaySound(AudioName.BtnClick);
        this.showTypeList(ShopConfig.shopGoodsList);
    }

    /**
     * 生成种类按钮列表
     * @param list 种类配置列表（配件或商品）
     * @param selectName 默认选中并展示的种类名称（不传则展示第一个）
     */
    private showTypeList(list: ShopListConfigData[], selectName?: string): void {
        if (!this.buttonRoot || !this.buttonPrefab) {
            console.warn("PartsRoom: buttonRoot 或 buttonPrefab 未配置");
            return;
        }
        this.recycleButtons();
        this.recycleItems();
        this.curShopType = "";

        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const node = PoolMgr.get(this.buttonPrefab.name, this.buttonPrefab);
            if (!node) continue;
            node.parent = this.buttonRoot;
            node.getComponent(ShopItemBtn)?.init(data);
            node.off(Node.EventType.TOUCH_END);
            node.on(Node.EventType.TOUCH_END, this.onClickTypeBtn.bind(this, data), this);
            this.curBtnList.push(node);
        }

        // 展示指定种类，默认展示第一个种类的商品
        let target = list[0];
        if (selectName) {
            const match = list.find(d => d.shopListName === selectName);
            if (match) target = match;
        }
        if (target) {
            this.showShopList(target);
        }
    }

    /**
     * 点击某个种类按钮：显示该种类下的商品对象
     * @param data 种类配置数据
     */
    private onClickTypeBtn(data: ShopListConfigData): void {
        AudioMgr.PlaySound(AudioName.BtnClick3);
        this.showShopList(data);
    }

    /**
     * 生成某种类的商品对象列表到 shopList.content 下
     * @param data 种类配置数据
     */
    private showShopList(data: ShopListConfigData): void {
        if (this.curShopType === data.shopListName) return;
        const content = this.shopList?.content;
        if (!content || !this.shopPrefab) {
            console.warn("PartsRoom: shopList 或 shopPrefab 未配置");
            return;
        }
        this.recycleItems();
        this.curShopType = data.shopListName;
        // 种类按钮单选：选中当前种类，其它取消选中
        this.updateBtnSelect(data.shopListName);

        for (let i = 0; i < data.shopListData.length; i++) {
            const shopData = data.shopListData[i];
            const node = PoolMgr.get(this.shopPrefab.name, this.shopPrefab);
            if (!node) continue;
            node.parent = content;
            node.getComponent(ShopItem)?.init(shopData);
            this.curItemList.push(node);
        }
    }

    /** 更新种类按钮的选中状态（单选：只有 selectName 对应的按钮为选中） */
    private updateBtnSelect(selectName: string): void {
        for (let i = 0; i < this.curBtnList.length; i++) {
            const btn = this.curBtnList[i].getComponent(ShopItemBtn);
            if (!btn) continue;
            if (btn.shopListData?.shopListName === selectName) {
                btn.select();
            } else {
                btn.unselect();
            }
        }
    }

    /** 回收所有种类按钮到对象池 */
    private recycleButtons(): void {
        for (let i = 0; i < this.curBtnList.length; i++) {
            const node = this.curBtnList[i];
            node.off(Node.EventType.TOUCH_END);
            PoolMgr.put(this.buttonPrefab.name, node);
        }
        this.curBtnList.length = 0;
    }

    /** 回收所有商品对象到对象池 */
    private recycleItems(): void {
        for (let i = 0; i < this.curItemList.length; i++) {
            PoolMgr.put(this.shopPrefab.name, this.curItemList[i]);
        }
        this.curItemList.length = 0;
        this.curShopType = "";
    }

    /**
     * 根据商品Key跳转到对应的类型与种类，并高亮显示目标商品
     * （切换到本场景时用于展示玩家的目标对象）
     * @param shopKey 目标商品Key
     * @returns 目标商品对象(ShopItem)，未找到返回 null
     */
    public showTargetShop(shopKey: string): ShopItem | null {
        const found = this.findCategoryByShopKey(shopKey);
        if (!found) {
            console.warn("PartsRoom: 未找到目标商品 " + shopKey);
            return null;
        }
        // 切到目标所在类型，并选中目标所在种类
        this.showTypeList(found.list, found.category.shopListName);
        // 高亮目标商品，其它商品恢复正常色
        return this.highlightTargetItem(shopKey);
    }

    /** 把对应的类型显示为选中状态 */
    public showPartType(partType: string): void {
        this.updateBtnSelect(partType);
    }

    /** 根据零件类型查找对应的配置列表 */
    private findListByPartType(partType: string): ShopListConfigData[] | null {
        const groups = [ShopConfig.shopPartList, ShopConfig.shopGoodsList];
        for (let g = 0; g < groups.length; g++) {
            const list = groups[g];
            for (let i = 0; i < list.length; i++) {
                const category = list[i];
                if (category.shopListName === partType) {
                    return list;
                }
            }
        }
        return null;
    }

    /** 在配件和商品配置中查找商品Key所属的类型列表与种类 */
    private findCategoryByShopKey(shopKey: string): { list: ShopListConfigData[]; category: ShopListConfigData } | null {
        const groups = [ShopConfig.shopPartList, ShopConfig.shopGoodsList];
        for (let g = 0; g < groups.length; g++) {
            const list = groups[g];
            for (let i = 0; i < list.length; i++) {
                const category = list[i];
                if (category.shopListData.some(d => d.shopKey === shopKey)) {
                    return { list, category };
                }
            }
        }
        return null;
    }

    /** 高亮目标商品背景(红色)，其它商品显示正常色，返回目标商品对象 */
    private highlightTargetItem(shopKey: string): ShopItem | null {
        let target: ShopItem = null;
        for (let i = 0; i < this.curItemList.length; i++) {
            const item = this.curItemList[i].getComponent(ShopItem);
            if (!item) continue;
            const isTarget = item.shopData?.shopKey === shopKey;
            item.setTarget(isTarget);
            if (isTarget) target = item;
        }
        return target;
    }

}
