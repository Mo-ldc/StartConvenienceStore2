import { _decorator, Color, Label, Node, Prefab, tween, Tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { CtrBase } from './CtrBase';
import { PoolMgr } from '../Mgr/PoolMgr';
import { CtrMgr } from '../Mgr/CtrMgr';
import { BaseUIComponent } from '../UI/UIComponent/BaseUIComponent';
import { UIMgr } from '../Mgr/UIMgr';
import { BaseBar } from '../UI/UIComponent/BaseBar';
import { Currency } from '../UI/Currency/Currency';
import { Currency2 } from '../UI/Currency/Currency2';
import { GameData } from '../Data/Data/GameData';
import { GameEvent } from '../Data/Enum/GameEvent';
import { MessMgr } from '../Mgr/MessMgr';

const { ccclass, property } = _decorator;

interface DamageFlyData {
    /** 文本节点 */
    node: Node;
    /** 起始X */
    startX: number;
    /** 起始Y */
    startY: number;
    /** 目标X */
    endX: number;
    /** 目标Y */
    endY: number;
    /** 飞行时间 */
    elapsed: number;
    /** 预制体名称 */
    prefabName: string;

    /** 飞行持续时间 */
    damageFlyDuration: number;
    /** 抛物线高度 */
    damageArcHeight: number;
    /** 淡出延迟 */
    damageFadeDelay: number;
    /** 淡出持续时间 */
    damageFadeDuration: number;
}

/**
 * UI 控制器
 * 
 * 职责：
 * - 监听 MessMgr 事件，自动生成伤害飘字
 * - 监听货币变化事件，更新玩法 UI 的货币显示
 * - 管理货币动画效果
 */
@ccclass('CtrUI')
export class CtrUI extends CtrBase {
    /** 伤害文本挂载根节点 */
    @property({ type: Node, tooltip: '文本根节点' })
    labelRoot: Node = null;
    /** 货币动画挂载根节点 */
    @property({ type: Node, tooltip: '货币根节点' })
    currencyRoot: Node = null;
    /** 血条挂载根节点 */
    @property({ type: Node, tooltip: '血条根节点' })
    bloodRoot: Node = null;

    金币名称 = "Gold";
    银币名称 = "Silver";

    /** 伤害数字Key */
    damageNumberKey = "Label_Damage";

    /** 伤害飘字飞行数据列表 */
    private damageFlyList: DamageFlyData[] = [];

    /** 事件回调引用 */


    /** 初始化：设置默认根节点 */
    init(...args: any[]): void {
        if (!this.labelRoot) {
            this.labelRoot = this.node;
        }
        if (!this.currencyRoot) {
            this.currencyRoot = this.node;
        }
    }

    /** 注册事件监听 */
    registerEvent(): void {
        MessMgr.on(GameEvent.GoldFly, this.playGoldFly2, this);
    }

    resetEvent(): void {
        MessMgr.off(GameEvent.GoldFly, this.playGoldFly2, this);
    }


    /** 创建血条 */
    createBloodBar(hpPreKey?: string){
        let preKey = hpPreKey || "Hp";
        const ctrRes = CtrMgr.getInstance().ctrRes;
        let pre = ctrRes.getPrefab(preKey);
        if (pre) {
            let bloodBar = PoolMgr.get(preKey, pre);
            if (bloodBar) {
                bloodBar.parent = this.bloodRoot;
                // console.log("血条预制体获取成功:", preKey)
                return bloodBar.getComponent(BaseBar);
            }else{
                // console.warn("血条预制体获取失败:", preKey)
            }
        }else{
            ctrRes.GetHpPrefab(preKey);
            // console.error("血条预制体不存在:", preKey);
        }
    }

    /**
     * 
     * 
     */
    /**
     * 响应角色受伤事件：生成伤害飘字
     * @param data 
     */
    private _handleDamaged(data: { 
        damage: number; // 伤害值
        isCrit: boolean; // 是否暴击
        stunned: number;//克制状态 -1 被对方克制，0 正常，1 克制对方
        worldPos: Vec3; // 世界坐标
        damageFlyDuration: number; // 飞行持续时间
        damageArcHeight: number; // 抛物线高度
        damageFadeDelay: number; // 淡出延迟
        damageFadeDuration: number; // 淡出持续时间
    }) {
        if (data.damage == null || isNaN(data.damage)) return;
        let color ="#ffffff";
        switch (data.stunned) {
            case -1:
                color = "#4444ff";
                break;
            case 1:
                color = "#ff4444";
                break;
            default:
                color = "#ffffff";
                break;
        }
        let prefix = "";
        if (data.stunned === 1) {
            prefix += "克制";
        }
        if (data.isCrit) {
            prefix += "暴击";
        }
        let displayStr = prefix ? `${prefix}:${data.damage}` : data.damage.toString();

        let labelSet = {
            str: displayStr,
            color: color,
            worldPos: data.worldPos,
        }
        this.createDamageNumber(
            labelSet,
            data.damageFlyDuration, 
            data.damageArcHeight, 
            data.damageFadeDelay, 
            data.damageFadeDuration
        );
    }

    /**
     * 响应货币变化事件：更新 UI 显示
     */
    private _handleCurrencyChanged(data: { current: number; delta: number }) {

    }

    /** 响应货币不足事件：通过 UIMgr 显示提示 */
    private _handleCurrencyNotEnough(data: { required: number; current: number }) {
        UIMgr.getInstance().showTip("粮食不足");
    }

    /**
     * 获取文本预制体
     * @param name 预制体键名
     */
    public getLabelPre(name: string): Promise<Prefab | null> {
        const ctrRes = CtrMgr.getInstance().ctrRes;
        return ctrRes.GetLabelPrefab(name);
    }

    /**
     * 生成伤害飘字动画
     * 从对象池获取文本节点 → 设置数字和颜色 → 随机起始X → 抛物线飞到目标位置 → 回收
     * 飞行 & 淡出由 upDateCtr 驱动，缩放弹出由 tween 驱动
     * @param damage 伤害数值
     * @param wopPos 飘字目标世界坐标
     * @param color 十六进制颜色字符串
     * @param damageFlyDuration 飞行持续时间
     * @param damageArcHeight 抛物线高度
     * @param damageFadeDelay 淡出延迟
     * @param damageFadeDuration 淡出持续时间
     */
    public createDamageNumber(
        labelSet: { str: string; color: string; worldPos: Vec3 },
        damageFlyDuration: number = 0.8,
        damageArcHeight: number = 80,
        damageFadeDelay: number = 0.8,
        damageFadeDuration: number = 0.4
    ) {
        const ctrRes = CtrMgr.getInstance().ctrRes;
        const worldPreKey = "Label_Damage";
        let prefab: Prefab = ctrRes.getPrefab(worldPreKey);
        if(!prefab){
            this.getLabelPre(worldPreKey).then(prefab => {
                this._createNumber(prefab, labelSet, damageFlyDuration, damageArcHeight, damageFadeDelay, damageFadeDuration);
            });
        }else{
            this._createNumber(prefab, labelSet, damageFlyDuration, damageArcHeight, damageFadeDelay, damageFadeDuration);
        }
       
    }
    /**
     *  创建伤害数字动画
     * @param prefab 伤害数字预制体
     * @param damage 伤害数值
     * @param worldPos 世界坐标
     * @param colorStr 颜色字符串
     * @param damageFlyDuration 飞行持续时间
     * @param damageArcHeight 抛物线高度
     * @param damageFadeDelay 淡出延迟
     * @param damageFadeDuration 淡出持续时间
     * @returns 
     */
    private _createNumber(
        prefab: Prefab, 
        labelSet:{str: string; color: string; worldPos: Vec3},
        damageFlyDuration: number = 0.5,
        damageArcHeight: number = 80,
        damageFadeDelay: number = 0.3,
        damageFadeDuration: number = 0.2
    ) {
        if(!prefab){
            console.warn(" 伤害文本预制体不存在");
            return;
        }
        let damageText = PoolMgr.get(prefab.name, prefab);
        Tween.stopAllByTarget(damageText);
        const uiTransform = this.labelRoot.getComponent(UITransform);
        if (!uiTransform) {
            return;
        }
        let targetPos = uiTransform.convertToNodeSpaceAR(labelSet.worldPos);
        let endX = targetPos.x + this._getRandomXOffset(10, 50);
        let endY = targetPos.y;

        let color = new Color();
        Color.fromHEX(color, labelSet.color);
        damageText.getComponent(Label).string = labelSet.str;
        this.labelRoot.addChild(damageText);
        damageText.getComponent(Label).color = color;
        damageText.setPosition(targetPos.x, targetPos.y);
        damageText.setScale(0, 0);
        let op = damageText.getComponent(UIOpacity);
        op.opacity = 255;
        tween(damageText)
            .to(0.1, { scale: new Vec3(1, 1, 1) }, { easing: "backOut" })
            .to(0.1, { scale: new Vec3(0.7, 0.7, 1) }, { easing: "backOut" })
            .start();

        this.damageFlyList.push({
            node: damageText,
            startX: targetPos.x,
            startY: targetPos.y,
            endX: endX,
            endY: endY,
            elapsed: 0,
            prefabName: prefab.name,
            damageFlyDuration: damageFlyDuration,
            damageArcHeight: damageArcHeight,
            damageFadeDelay: damageFadeDelay,
            damageFadeDuration: damageFadeDuration,
        });
    }

    private _getRandomXOffset(rangeMin: number, rangeMax: number): number {
        let x = rangeMin + Math.random() * (rangeMax * 2)
        x = Math.random() < 0.5 ? x : -x;
        return x;
    }

    /**
     * 播放批量金币飞行动画（纯视觉，数值已通过事件更新）
     * N 枚金币在 from 周围均匀环状生成，错开延迟后依次飞向 to
     * @param from 金币生成中心点（世界坐标）
     * @param to 金币目标位置（世界坐标）
     * @param count 金币数量
     * @param prefabKey 预制体Key，默认 "Gold"
     * @param onComplete 全部完成后回调
     */
    public playGoldFly2(
        from: Vec3,
        to: Vec3,
        count: number,
        prefabKey: string = "Gold2",
        onComplete?: Function
    ): void {
        console.log("播放金币飞行动画");
        const ctrRes = CtrMgr.getInstance().ctrRes;
        let prefab: Prefab = ctrRes.getPrefab(prefabKey);
        if (!prefab) {
            ctrRes.GetCurrencyPrefab(prefabKey).then(prefab => {
                this._createGoldCluster(prefab, from, to, count, onComplete);
            });
        } else {
            this._createGoldCluster(prefab, from, to, count, onComplete);
        }
    }

    /** 批量创建环状金币并启动飞行 */
    private _createGoldCluster(prefab: Prefab, from: Vec3, to: Vec3, count: number, onComplete?: Function): void {
        if (!prefab) {
            console.warn("金币预制体不存在");
            onComplete?.();
            return;
        }
        console.warn("创建金币集群:", count);
        let completedCount = 0;
        const staggerDelay = 0.04; // 每枚金币间隔延迟
        const spawnRadius = 50; // 环状生成半径

        const onSingleComplete = () => {
            completedCount++;
            if (completedCount >= count) {
                onComplete?.();
            }
        };

        for (let i = 0; i < count; i++) {
            const gold = PoolMgr.get(prefab.name, prefab);
            if (!gold) {
                onSingleComplete();
                continue;
            }

            gold.parent = this.currencyRoot;
            const currency2 = gold.getComponent(Currency2);
            if (!currency2) {
                PoolMgr.put(prefab.name, gold);
                onSingleComplete();
                continue;
            }

            const angle = Math.random() * Math.PI * 2;
            const radius = Math.sqrt(Math.random()) * spawnRadius; // sqrt保证圆内均匀分布
            const startPos = new Vec3(
                from.x + Math.cos(angle) * radius,
                from.y + Math.sin(angle) * radius,
                0
            );

            currency2.playShow(startPos, to, i * staggerDelay, onSingleComplete);
        }
    }



    private upDateDamageFly(dt: number): void {
          for (let i = this.damageFlyList.length - 1; i >= 0; i--) {
            const data = this.damageFlyList[i];
            data.elapsed += dt;
            const t = Math.min(data.elapsed / data.damageFlyDuration, 1);
            const x = data.startX + (data.endX - data.startX) * t;
            const arc = data.damageArcHeight * 4 * t * (1 - t);
            const y = data.startY + (data.endY - data.startY) * t + arc;
            data.node.setPosition(x, y);

            if (data.elapsed > data.damageFadeDelay) {
                const fadeT = Math.min((data.elapsed - data.damageFadeDelay) / data.damageFadeDuration, 1);
                const op = data.node.getComponent(UIOpacity);
                if (op) {
                    op.opacity = Math.floor(255 * (1 - fadeT));
                }
            }

            if (t >= 1 && data.elapsed >= data.damageFadeDelay + data.damageFadeDuration) {
                Tween.stopAllByTarget(data.node);
                data.node.parent = null;
                PoolMgr.put(data.prefabName, data.node);
                this.damageFlyList.splice(i, 1);
            }
        }
    }
    /** 每帧更新：驱动货币飞行动画 & 伤害飘字动画 */
    upDateCtr(dt: number): void {
        this.upDateDamageFly(dt);
    }
    dispose(): void {
        
    }
}
