import { ResData } from "../Data/ResData";
import { ResType } from "../Type/ResType";

export class RoleResConfig {
    private static _map: Map<string, ResData> = null;
    public static get(key: string): ResData | undefined {
        if (!this._map) {
            this._map = new Map();
            for (let i = 0; i < this.data.length; i++) {
                const d = this.data[i];
                this._map.set(d.resKey, d);
            }
        }
        return this._map.get(key);
    }
    private static data: ResData[] = [
        { resKey: "roleSpr_1", resType: ResType.Prefab, bundleName: "roleSpr_1" },
        { resKey: "roleSpr_2", resType: ResType.Prefab, bundleName: "roleSpr_2" },
    ];
}


