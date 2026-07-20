import { OrderConfigData } from "../Data/ConfigData";
import { Quality } from "../Enum/Enum";
import { OrderType, PartType } from "../Type/ObjType";
export class OrderConfig {
    private static _map: Map<string, OrderConfigData> = null;
    public static get(key: string): OrderConfigData | undefined {
        if (!this._map) {
            this._map = new Map();
            for (let i = 0; i < this.data.length; i++) {
                const d = this.data[i];
                this._map.set(d.orderKey, d);
            }
        }
        return this._map.get(key);
    }
    private static data: OrderConfigData[] = [
        { orderKey: "order1", orderType: OrderType.修, orderPrice: 420, quality: Quality.低, partType: PartType.电池, mobileKey: "Mobile_01" },
        { orderKey: "order2", orderType: OrderType.修, orderPrice: 1289, quality: Quality.低, partType: PartType.主板, mobileKey: "Mobile_01" },
        { orderKey: "order3", orderType: OrderType.修, orderPrice: 1278, quality: Quality.低, partType: PartType.屏幕, mobileKey: "Mobile_01" },
        { orderKey: "order4", orderType: OrderType.修, orderPrice: 653, quality: Quality.低, partType: PartType.镜头, mobileKey: "Mobile_01" },
        { orderKey: "order5", orderType: OrderType.修, orderPrice: 113, quality: Quality.低, partType: PartType.屏幕膜, mobileKey: "Mobile_01" },
        { orderKey: "order6", orderType: OrderType.修, orderPrice: 180, quality: Quality.低, partType: PartType.SIM卡, mobileKey: "Mobile_01" },
        { orderKey: "order7", orderType: OrderType.修, orderPrice: 328, quality: Quality.低, partType: PartType.后盖, mobileKey: "Mobile_01" },

        // { orderKey: "order8", orderType: OrderType.修, orderPrice: 420, quality: Quality.低, partType: PartType.电池, mobileKey: "Mobile_02" },
        // { orderKey: "order9", orderType: OrderType.修, orderPrice: 1289, quality: Quality.低, partType: PartType.主板, mobileKey: "Mobile_02" },
        // { orderKey: "order10", orderType: OrderType.修, orderPrice: 1278, quality: Quality.低, partType: PartType.屏幕, mobileKey: "Mobile_02" },
        // { orderKey: "order11", orderType: OrderType.修, orderPrice: 653, quality: Quality.低, partType: PartType.镜头, mobileKey: "Mobile_02" },
        // { orderKey: "order12", orderType: OrderType.修, orderPrice: 113, quality: Quality.低, partType: PartType.屏幕膜, mobileKey: "Mobile_02" },
        // { orderKey: "order13", orderType: OrderType.修, orderPrice: 180, quality: Quality.低, partType: PartType.SIM卡, mobileKey: "Mobile_02" },
        // { orderKey: "order14", orderType: OrderType.修, orderPrice: 328, quality: Quality.低, partType: PartType.后盖, mobileKey: "Mobile_02" },

        // { orderKey: "order15", orderType: OrderType.修, orderPrice: 599, quality: Quality.中, partType: PartType.电池, mobileKey: "Mobile_03" },
        // { orderKey: "order16", orderType: OrderType.修, orderPrice: 1836, quality: Quality.中, partType: PartType.主板, mobileKey: "Mobile_03" },
        // { orderKey: "order17", orderType: OrderType.修, orderPrice: 1974, quality: Quality.中, partType: PartType.屏幕, mobileKey: "Mobile_03" },
        // { orderKey: "order18", orderType: OrderType.修, orderPrice: 942, quality: Quality.中, partType: PartType.镜头, mobileKey: "Mobile_03" },
        // { orderKey: "order19", orderType: OrderType.修, orderPrice: 156, quality: Quality.中, partType: PartType.屏幕膜, mobileKey: "Mobile_03" },
        // { orderKey: "order20", orderType: OrderType.修, orderPrice: 253, quality: Quality.中, partType: PartType.SIM卡, mobileKey: "Mobile_03" },
        // { orderKey: "order21", orderType: OrderType.修, orderPrice: 479, quality: Quality.中, partType: PartType.后盖, mobileKey: "Mobile_03" },

        // { orderKey: "order22", orderType: OrderType.修, orderPrice: 599, quality: Quality.中, partType: PartType.电池, mobileKey: "Mobile_04" },
        // { orderKey: "order23", orderType: OrderType.修, orderPrice: 1836, quality: Quality.中, partType: PartType.主板, mobileKey: "Mobile_04" },
        // { orderKey: "order24", orderType: OrderType.修, orderPrice: 1974, quality: Quality.中, partType: PartType.屏幕, mobileKey: "Mobile_04" },
        // { orderKey: "order25", orderType: OrderType.修, orderPrice: 942, quality: Quality.中, partType: PartType.镜头, mobileKey: "Mobile_04" },
        // { orderKey: "order26", orderType: OrderType.修, orderPrice: 156, quality: Quality.中, partType: PartType.屏幕膜, mobileKey: "Mobile_04" },
        // { orderKey: "order27", orderType: OrderType.修, orderPrice: 253, quality: Quality.中, partType: PartType.SIM卡, mobileKey: "Mobile_04" },
        // { orderKey: "order28", orderType: OrderType.修, orderPrice: 479, quality: Quality.中, partType: PartType.后盖, mobileKey: "Mobile_04" },

        // { orderKey: "order29", orderType: OrderType.修, orderPrice: 822, quality: Quality.高, partType: PartType.电池, mobileKey: "Mobile_05" },
        // { orderKey: "order30", orderType: OrderType.修, orderPrice: 2519, quality: Quality.高, partType: PartType.主板, mobileKey: "Mobile_05" },
        // { orderKey: "order31", orderType: OrderType.修, orderPrice: 2855, quality: Quality.高, partType: PartType.屏幕, mobileKey: "Mobile_05" },
        // { orderKey: "order32", orderType: OrderType.修, orderPrice: 1305, quality: Quality.高, partType: PartType.镜头, mobileKey: "Mobile_05" },
        // { orderKey: "order33", orderType: OrderType.修, orderPrice: 210, quality: Quality.高, partType: PartType.屏幕膜, mobileKey: "Mobile_05" },
        // { orderKey: "order34", orderType: OrderType.修, orderPrice: 343, quality: Quality.高, partType: PartType.SIM卡, mobileKey: "Mobile_05" },
        // { orderKey: "order35", orderType: OrderType.修, orderPrice: 669, quality: Quality.高, partType: PartType.后盖, mobileKey: "Mobile_05" },

        // { orderKey: "order36", orderType: OrderType.修, orderPrice: 822, quality: Quality.高, partType: PartType.电池, mobileKey: "Mobile_06" },
        // { orderKey: "order37", orderType: OrderType.修, orderPrice: 2519, quality: Quality.高, partType: PartType.主板, mobileKey: "Mobile_06" },
        // { orderKey: "order38", orderType: OrderType.修, orderPrice: 2855, quality: Quality.高, partType: PartType.屏幕, mobileKey: "Mobile_06" },
        // { orderKey: "order39", orderType: OrderType.修, orderPrice: 1305, quality: Quality.高, partType: PartType.镜头, mobileKey: "Mobile_06" },
        // { orderKey: "order40", orderType: OrderType.修, orderPrice: 210, quality: Quality.高, partType: PartType.屏幕膜, mobileKey: "Mobile_06" },
        // { orderKey: "order41", orderType: OrderType.修, orderPrice: 343, quality: Quality.高, partType: PartType.SIM卡, mobileKey: "Mobile_06" },
        // { orderKey: "order42", orderType: OrderType.修, orderPrice: 669, quality: Quality.高, partType: PartType.后盖, mobileKey: "Mobile_06" },
    ]

    /** 随机获得一条数据 */
    public static random(): OrderConfigData {
        return this.data[Math.floor(Math.random() * this.data.length)];
    }
}
