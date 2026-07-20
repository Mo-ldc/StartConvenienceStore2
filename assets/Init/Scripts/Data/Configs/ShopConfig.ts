import { ShopConfigData, ShopListConfigData } from "../Data/ConfigData";
import { Quality } from "../Enum/Enum";
import { GoodsType, PartType } from "../Type/ObjType";
export class ShopConfig{
    /** 零件列表 */

    //零件
    /** 后盖  */
    private static backCover: ShopConfigData[] = [
        { shopKey: "lowBackCover", quality: Quality.低,partType: PartType.后盖,shopName: "低端后盖",shopPrice: 160,isReal: true,isLock: false },
        { shopKey: "lowBackCoverFake", quality: Quality.低,partType: PartType.后盖,shopName: "低端后盖（假）",shopPrice: 80,isReal: false,isLock: false },
        { shopKey: "midBackCover", quality: Quality.中,partType: PartType.后盖,shopName: "中端后盖",shopPrice: 240,isReal: true,isLock: false },
        { shopKey: "midBackCoverFake", quality: Quality.中,partType: PartType.后盖,shopName: "中端后盖（假）",shopPrice: 120,isReal: false,isLock: false },
        { shopKey: "highBackCover", quality: Quality.高,partType: PartType.后盖,shopName: "高端后盖",shopPrice: 320,isReal: true,isLock: false },
        { shopKey: "highBackCoverFake", quality: Quality.高,partType: PartType.后盖,shopName: "高端后盖（假）",shopPrice: 160,isReal: false,isLock: false }
    ];
    /** 电池  */
    private static battery: ShopConfigData[] = [
        { shopKey: "lowBattery", quality: Quality.低,partType: PartType.电池,shopName: "低端电池",shopPrice: 180,isReal: true,isLock: false },
        { shopKey: "lowBatteryFake", quality: Quality.低,partType: PartType.电池,shopName: "低端电池（假）",shopPrice: 90,isReal: false,isLock: false },
        { shopKey: "midBattery", quality: Quality.中,partType: PartType.电池,shopName: "中端电池",shopPrice: 270,isReal: true,isLock: false },
        { shopKey: "midBatteryFake", quality: Quality.中,partType: PartType.电池,shopName: "中端电池（假）",shopPrice: 135,isReal: false,isLock: false },
        { shopKey: "highBattery", quality: Quality.高,partType: PartType.电池,shopName: "高端电池",shopPrice: 360,isReal: true,isLock: false },
        { shopKey: "highBatteryFake", quality: Quality.高,partType: PartType.电池,shopName: "高端电池（假）",shopPrice: 180,isReal: false,isLock: false }
    ];
    /** 镜头  */
    private static lens: ShopConfigData[] = [
        { shopKey: "lowLens", quality: Quality.低,partType: PartType.镜头,shopName: "低端镜头",shopPrice: 300,isReal: true,isLock: false },
        { shopKey: "lowLensFake", quality: Quality.低,partType: PartType.镜头,shopName: "低端镜头（假）",shopPrice: 150,isReal: false,isLock: false },
        { shopKey: "midLens", quality: Quality.中,partType: PartType.镜头,shopName: "中端镜头",shopPrice: 225,isReal: true,isLock: false },
        { shopKey: "midLensFake", quality: Quality.中,partType: PartType.镜头,shopName: "中端镜头（假）",shopPrice: 100,isReal: false,isLock: false },
        { shopKey: "highLens", quality: Quality.高,partType: PartType.镜头,shopName: "高端镜头",shopPrice: 600,isReal: true,isLock: false },
        { shopKey: "highLensFake", quality: Quality.高,partType: PartType.镜头,shopName: "高端镜头（假）",shopPrice: 300,isReal: false,isLock: false }
    ];
    /** 主板  */
    private static motherboard: ShopConfigData[] = [
        { shopKey: "lowMotherboard", quality: Quality.低,partType: PartType.主板,shopName: "低端主板",shopPrice: 550,isReal: true,isLock: false },
        { shopKey: "lowMotherboardFake", quality: Quality.低,partType: PartType.主板,shopName: "低端主板（假）",shopPrice: 275,isReal: false,isLock: false },
        { shopKey: "midMotherboard", quality: Quality.中,partType: PartType.主板,shopName: "中端主板",shopPrice: 825,isReal: true,isLock: false },
        { shopKey: "midMotherboardFake", quality: Quality.中,partType: PartType.主板,shopName: "中端主板（假）",shopPrice: 413,isReal: false,isLock: false },
        { shopKey: "highMotherboard", quality: Quality.高,partType: PartType.主板,shopName: "高端主板",shopPrice: 1100,isReal: true,isLock: false },
        { shopKey: "highMotherboardFake", quality: Quality.高,partType: PartType.主板,shopName: "高端主板（假）",shopPrice: 550,isReal: false,isLock: false }
    ];
    /** 屏幕  */
    private static screen: ShopConfigData[] = [
        { shopKey: "lowScreen", quality: Quality.低,partType: PartType.屏幕,shopName: "低端屏幕",shopPrice: 800,isReal: true,isLock: false },
        { shopKey: "lowScreenFake", quality: Quality.低,partType: PartType.屏幕,shopName: "低端屏幕（假）",shopPrice: 400,isReal: false,isLock: false },
        { shopKey: "midScreen", quality: Quality.中,partType: PartType.屏幕,shopName: "中端屏幕",shopPrice: 1200,isReal: true,isLock: false },
        { shopKey: "midScreenFake", quality: Quality.中,partType: PartType.屏幕,shopName: "中端屏幕（假）",shopPrice: 600,isReal: false,isLock: false },
        { shopKey: "highScreen", quality: Quality.高,partType: PartType.屏幕,shopName: "高端屏幕",shopPrice: 1600,isReal: true,isLock: false },
        { shopKey: "highScreenFake", quality: Quality.高,partType: PartType.屏幕,shopName: "高端屏幕（假）",shopPrice: 800,isReal: false,isLock: false }
    ];

    /** sim卡  */
    private static simCard: ShopConfigData[] = [
        { shopKey: "lowSimCard", quality: Quality.低,partType: PartType.SIM卡,shopName: "低端sim卡",shopPrice: 70,isReal: true,isLock: false },
        { shopKey: "lowSimCardFake", quality: Quality.低,partType: PartType.SIM卡,shopName: "低端sim卡（假）",shopPrice: 35,isReal: false,isLock: false },
        { shopKey: "midSimCard", quality: Quality.中,partType: PartType.SIM卡,shopName: "中端sim卡",shopPrice: 105,isReal: true,isLock: false },
        { shopKey: "midSimCardFake", quality: Quality.中,partType: PartType.SIM卡,shopName: "中端sim卡（假）",shopPrice: 53,isReal: false,isLock: false },
        { shopKey: "highSimCard", quality: Quality.高,partType: PartType.SIM卡,shopName: "高端sim卡",shopPrice: 140,isReal: true,isLock: false },
        { shopKey: "highSimCardFake", quality: Quality.高,partType: PartType.SIM卡,shopName: "高端sim卡（假）",shopPrice: 70,isReal: false,isLock: false }
    ];
    /** 膜 */
    private static film: ShopConfigData[] = [
        { shopKey: "lowFilm", quality: Quality.低,partType: PartType.屏幕膜,shopName: "低端膜",shopPrice: 40,isReal: true,isLock: false },
        { shopKey: "lowFilmFake", quality: Quality.低,partType: PartType.屏幕膜,shopName: "低端手机膜（假）",shopPrice: 20,isReal: true,isLock: false },
        { shopKey: "midFilm", quality: Quality.中,partType: PartType.屏幕膜,shopName: "中端膜",shopPrice: 60,isReal: true,isLock: false },
        { shopKey: "midFilmFake", quality: Quality.中,partType: PartType.屏幕膜,shopName: "中端手机膜（假）",shopPrice: 30,isReal: true,isLock: false },
        { shopKey: "highFilm", quality: Quality.高,partType: PartType.屏幕膜,shopName: "高端膜",shopPrice: 80,isReal: true,isLock: false },
        { shopKey: "highFilmFake", quality: Quality.高,partType: PartType.屏幕膜,shopName: "高端手机膜（假）",shopPrice: 40,isReal: true,isLock: false }
    ];
    /** 零件商店列表 */
    public static shopPartList: ShopListConfigData[] = [
        { shopListName: "后盖", partType: PartType.后盖, shopListData: ShopConfig.backCover },
        { shopListName: "电池", partType: PartType.电池, shopListData: ShopConfig.battery },
        { shopListName: "镜头", partType: PartType.镜头, shopListData: ShopConfig.lens },
        { shopListName: "主板", partType: PartType.主板, shopListData: ShopConfig.motherboard },
        { shopListName: "屏幕", partType: PartType.屏幕, shopListData: ShopConfig.screen },
        { shopListName: "sim卡", partType: PartType.SIM卡, shopListData: ShopConfig.simCard },
        { shopListName: "膜", partType: PartType.屏幕膜, shopListData: ShopConfig.film }
    ];


    //商品
    /** 手机套  */
    private static phoneCase: ShopConfigData[] = [
        { shopKey: "phoneCase1", shopType: GoodsType.手机套,shopName: "棕色手机套",shopPrice: 100,isReal: true,isLock: false },
        { shopKey: "phoneCase2", shopType: GoodsType.手机套,shopName: "蓝色手机套",shopPrice: 150,isReal: true,isLock: false },
        { shopKey: "phoneCase3", shopType: GoodsType.手机套,shopName: "绿色手机套",shopPrice: 200,isReal: true,isLock: false },
        { shopKey: "phoneCase4", shopType: GoodsType.手机套,shopName: "粉色手机套",shopPrice: 250,isReal: true,isLock: false }
    ];
    /** 充电宝  */
    private static powerBank: ShopConfigData[] = [
        { shopKey: "powerBank1", shopType: GoodsType.充电宝,shopName: "黑色充电宝",shopPrice: 100,isReal: true,isLock: false },
        { shopKey: "powerBank2", shopType: GoodsType.充电宝,shopName: "白色充电宝",shopPrice: 200,isReal: true,isLock: false },
        { shopKey: "powerBank3", shopType: GoodsType.充电宝,shopName: "红色充电宝",shopPrice: 300,isReal: true,isLock: false }
    ];
    /** 充电器  */
    private static charger: ShopConfigData[] = [
        { shopKey: "charger1", shopType: GoodsType.充电器,shopName: "黑色充电器",shopPrice: 100,isReal: true,isLock: false },
        { shopKey: "charger2", shopType: GoodsType.充电器,shopName: "白色充电器",shopPrice: 200,isReal: true,isLock: false },
        { shopKey: "charger3", shopType: GoodsType.充电器,shopName: "红色充电器",shopPrice: 300,isReal: true,isLock: false }
    ];
    /** 耳机  */
    private static headphone: ShopConfigData[] = [
        { shopKey: "headphone1", shopType: GoodsType.耳机,shopName: "黑色耳机",shopPrice: 100,isReal: true,isLock: false },
        { shopKey: "headphone2", shopType: GoodsType.耳机,shopName: "白色耳机",shopPrice: 200,isReal: true,isLock: false },
        { shopKey: "headphone3", shopType: GoodsType.耳机,shopName: "红色耳机",shopPrice: 300,isReal: true,isLock: false }
    ];
    /** 手机袋  */
    private static mobileBag: ShopConfigData[] = [
        { shopKey: "mobileBag1", shopType: GoodsType.手机袋,shopName: "黑色手机袋",shopPrice: 100,isReal: true,isLock: false },
        { shopKey: "mobileBag2", shopType: GoodsType.手机袋,shopName: "白色手机袋",shopPrice: 200,isReal: true,isLock: false },
        { shopKey: "mobileBag3", shopType: GoodsType.手机袋,shopName: "红色手机袋",shopPrice: 300,isReal: true,isLock: false }
    ];
    /** 音响  */
    private static speaker: ShopConfigData[] = [
        { shopKey: "speaker1", shopType: GoodsType.音响,shopName: "黑色音响",shopPrice: 100,isReal: true,isLock: false },
        { shopKey: "speaker2", shopType: GoodsType.音响,shopName: "白色音响",shopPrice: 200,isReal: true,isLock: false },
        { shopKey: "speaker3", shopType: GoodsType.音响,shopName: "红色音响",shopPrice: 300,isReal: true,isLock: false }
    ];
    /** 其他  */
    private static other: ShopConfigData[] = [
        { shopKey: "other1", shopType: GoodsType.其他,shopName: "黑色其他",shopPrice: 100,isReal: true,isLock: false },
        { shopKey: "other2", shopType: GoodsType.其他,shopName: "白色其他",shopPrice: 200,isReal: true,isLock: false },
        { shopKey: "other3", shopType: GoodsType.其他,shopName: "红色其他",shopPrice: 300,isReal: true,isLock: false }
    ];

    /** 商品商店列表  */
    public static shopGoodsList: ShopListConfigData[] = [
        { shopListName: "手机套", shopListData: ShopConfig.phoneCase },
        { shopListName: "充电宝", shopListData: ShopConfig.powerBank },
        { shopListName: "充电器", shopListData: ShopConfig.charger },
        { shopListName: "耳机", shopListData: ShopConfig.headphone },
        { shopListName: "手机袋", shopListData: ShopConfig.mobileBag },
        { shopListName: "音响", shopListData: ShopConfig.speaker },
        { shopListName: "其他", shopListData: ShopConfig.other }
    ];
    /** 获取零件价格
     * 
      */
    public static getPartPrice(part: PartType, quality: Quality): number {
        let price = 0;
        this.shopPartList.forEach(element => {
            if (element.partType == part) {
                element.shopListData.forEach(element2 => {
                    if (element2.quality == quality) {
                        price = element2.shopPrice;
                    }
                });
            }
        });
        return price;
    }

}


