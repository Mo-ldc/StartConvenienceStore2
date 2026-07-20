import { ResData } from "../Data/ResData";
import { ResType } from "../Type/ResType";




// #endregion
export class ResConfig {
    //#region 游戏资源部分
    public static readonly 优先加载资源: string[] = [
        "Game", "Audio",
    ]

    public static readonly SceneResKey: string = "Game";
    public static readonly StartRes: ResData[] = [
        // { resKey: "UI", resType: ResType.Prefab, bundleName: "Game"},
        { resKey: "Game", resType: ResType.Scene, bundleName: "Game", path: "Game" },
        { resKey: "Audio", resType: ResType.AudioClip, bundleName: "Audio" },
        
    ]

    /**公共货币预制体资源 */
    public static CurrencyPreResArr: ResData[] = [

        //金币预制体
        { resKey: "Gold", resType: ResType.Prefab, bundleName: "Game", path: "Prefabs/Currency/Gold" },
        { resKey: "Gold2", resType: ResType.Prefab, bundleName: "Game", path: "Prefabs/Currency/Gold2" },
        
        //银币 预制体
        // { resKey: "Silver", resType: ResType.Prefab, bundleName: "Game", path: "Prefabs/Currency/Silver" },
    ]

    /** 公共特效资源 */
    public static EffectResArr: ResData[] = [
        { resKey: "EffectAni_01", resType: ResType.Prefab, bundleName: "EffectAni_01", path: "EffectAni_01" },//死亡特效
        { resKey: "EntryEffect_01", resType: ResType.Prefab, bundleName: "EntryEffect_01", path: "EntryEffect_01" },//登场特效
        { resKey: "HitEffect_1", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/DamageEffect/HitEffect_1" },//死亡特效
    ]
    public static UIResArr: ResData[] = [
        { resKey: "uiRoot", resType: ResType.Prefab, bundleName: "Game", path: "Prefabs/UI/uiRoot" },
        { resKey: "Tip", resType: ResType.Prefab, bundleName: "Game", path: "Prefabs/Tip/Tip" },
        { resKey: "uiMain", resType: ResType.Prefab, bundleName: "uiMain", path: "Prefabs/uiMain" },
        { resKey: "uiLoan", resType: ResType.Prefab, bundleName: "uiLoan", path: "Prefabs/uiLoan" },
        { resKey: "uiBid", resType: ResType.Prefab, bundleName: "uiBid", path: "Prefabs/uiBid" },
        { resKey: "uiPayRent", resType: ResType.Prefab, bundleName: "uiPayRent", path: "Prefabs/uiPayRent" },
        { resKey: "uiSetting", resType: ResType.Prefab, bundleName: "uiSetting", path: "Prefabs/uiSetting" },
        { resKey: "uiNews", resType: ResType.Prefab, bundleName: "uiNews", path: "Prefabs/uiNews" },
        { resKey: "uiTutorial", resType: ResType.Prefab, bundleName: "uiTutorial", path: "Prefabs/uiTutorial" },
        { resKey: "uiResult", resType: ResType.Prefab, bundleName: "uiResult", path: "Prefabs/uiResult" },
        { resKey: "uiFail", resType: ResType.Prefab, bundleName: "uiFail", path: "Prefabs/uiFail" },
    ]
    public static RoomResArr: ResData[] = [
        { resKey: "LobbyRoom", resType: ResType.Prefab, bundleName: "LobbyRoom", path: "Prefabs/LobbyRoom" },
        { resKey: "PartsRoom", resType: ResType.Prefab, bundleName: "PartsRoom", path: "Prefabs/PartsRoom" },
        { resKey: "RepairRoom", resType: ResType.Prefab, bundleName: "RepairRoom", path: "Prefabs/RepairRoom" },
    ]

    /** 文本资源 */
    public static LabelResArr: ResData[] = [
        { resKey: "Label_Damage", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Label/Label_Damage" },
        { resKey: "Label_Lv", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Label/Label_Lv" },
    ]
    /** Hp资源 */
    public static HpResArr: ResData[] = [
        { resKey: "Hp", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Hp/Hp" },
        { resKey: "Hp2", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Hp/Hp2" },
        { resKey: "Hp3", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Hp/Hp3" },
        { resKey: "Hp4", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Hp/Hp4" },
        { resKey: "Hp_Hero", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Hp/Hp_Hero" },
        { resKey: "Hp_Boss", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Hp/Hp_Boss" },
        { resKey: "Hp_Role", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Hp/Hp_Role" },
        
    ]
    /** 公共范围资源 */
    public static CommonResArr: ResData[] = [
        /** 攻击范围 */
        { resKey: "attackRange", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Range/attackRange" },
        /** 检测范围 */
        { resKey: "detectRange", resType: ResType.Prefab, bundleName: "WordWar", path: "Prefabs/Range/detectRange" },
    ]

    /** 公共子弹资源 */
    public static BulletResArr: ResData[] = [
        // { key: "Bullet_1", resType: ResType.Prefab, bundleName: "TowerDefense", path: "Prefabs/Bullet/Bullet_1" },
        // { key: "Bullet_2", resType: ResType.Prefab, bundleName: "TowerDefense", path: "Prefabs/Bullet/Bullet_2" },
    ]

}




