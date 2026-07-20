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
        { mobileKey: "Mobile_01", mobileName: "Mobile 1", mobileResKey: "Mobile_01", quality: Quality.低 },
        { mobileKey: "Mobile_02", mobileName: "Mobile 2", mobileResKey: "Mobile_02", quality: Quality.中 },
    ];
}


