import { MobileConfigData } from "../Data/ConfigData";
import { Quality } from "../Enum/Enum";

export class MobileConfig {
    private static _map: Map<string, MobileConfigData> = null;
    public static get(key: string): MobileConfigData | undefined {
        if (!this._map) {
            this._map = new Map();
            for (let i = 0; i < this.data.length; i++) {
                const d = this.data[i];
                this._map.set(d.mobileKey   , d);
            }
        }
        return this._map.get(key);
    }
    private static data: MobileConfigData[] = [
        { mobileKey: "Mobile_01", mobileName: "诺基亚", mobileResKey: "Mobile_01", quality: Quality.低 },
        { mobileKey: "Mobile_02", mobileName: "苹果8", mobileResKey: "Mobile_02", quality: Quality.中 },
        { mobileKey: "Mobile_03", mobileName: "小米17", mobileResKey: "Mobile_03", quality: Quality.高 },
        { mobileKey: "Mobile_04", mobileName: "荣耀600", mobileResKey: "Mobile_04", quality: Quality.中 },
        { mobileKey: "Mobile_05", mobileName: "三折叠", mobileResKey: "Mobile_05", quality: Quality.高 },
    ];
}


