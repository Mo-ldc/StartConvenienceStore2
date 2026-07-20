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
        { orderKey: "order1", orderType: OrderType.修, orderPrice: 100, quality: Quality.低, partType: PartType.后盖, mobileKey: "Mobile_01" },
        { orderKey: "order2", orderType: OrderType.修, orderPrice: 200, quality: Quality.低, partType: PartType.屏幕, mobileKey: "Mobile_01" },
        { orderKey: "order3", orderType: OrderType.修, orderPrice: 300, quality: Quality.低, partType: PartType.电池, mobileKey: "Mobile_01" },
        { orderKey: "order4", orderType: OrderType.修, orderPrice: 400, quality: Quality.低, partType: PartType.主板, mobileKey: "Mobile_01" },
        { orderKey: "order5", orderType: OrderType.修, orderPrice: 500, quality: Quality.低, partType: PartType.后盖, mobileKey: "Mobile_01" },
        { orderKey: "order6", orderType: OrderType.修, orderPrice: 600, quality: Quality.低, partType: PartType.屏幕, mobileKey: "Mobile_01" },
        { orderKey: "order7", orderType: OrderType.修, orderPrice: 700, quality: Quality.低, partType: PartType.电池, mobileKey: "Mobile_01" },

        { orderKey: "order8", orderType: OrderType.修, orderPrice: 800, quality: Quality.低, partType: PartType.后盖, mobileKey: "Mobile_01" },
        { orderKey: "order9", orderType: OrderType.修, orderPrice: 900, quality: Quality.低, partType: PartType.屏幕, mobileKey: "Mobile_01" },
        { orderKey: "order10", orderType: OrderType.修, orderPrice: 1000, quality: Quality.低, partType: PartType.电池, mobileKey: "Mobile_01" },
        { orderKey: "order11", orderType: OrderType.修, orderPrice: 1100, quality: Quality.低, partType: PartType.主板, mobileKey: "Mobile_01" },
        { orderKey: "order12", orderType: OrderType.修, orderPrice: 1200, quality: Quality.低, partType: PartType.后盖, mobileKey: "Mobile_01" },
        { orderKey: "order13", orderType: OrderType.修, orderPrice: 1300, quality: Quality.低, partType: PartType.屏幕, mobileKey: "Mobile_01" },
        { orderKey: "order14", orderType: OrderType.修, orderPrice: 1400, quality: Quality.低, partType: PartType.电池, mobileKey: "Mobile_01" },
        { orderKey: "order15", orderType: OrderType.修, orderPrice: 1500, quality: Quality.低, partType: PartType.主板, mobileKey: "Mobile_01" },
        { orderKey: "order16", orderType: OrderType.修, orderPrice: 1600, quality: Quality.低, partType: PartType.后盖, mobileKey: "Mobile_01" },
    ]

    /** 随机获得一条数据 */
    public static random(): OrderConfigData {
        return this.data[Math.floor(Math.random() * this.data.length)];
    }
}
