import { ResData } from "../Data/ResData";
import { ResType } from "../Type/ResType";

export class MobileResConfig{
    private static map: Map<string, ResData> = null;
    public static get(key: string): ResData {
        if (!this.map){
            this.map = new Map();
            for (let i = 0; i < this.data.length; i++) {
                const d = this.data[i];
                this.map.set(d.resKey, d);
            }
        }
        return this.map.get(key);
    }
    private static data:ResData[] = [
        { resKey: "Mobile_01", resType: ResType.Prefab, bundleName: "Mobile_01", path: "Prefabs/Mobile_01" },
        { resKey: "Mobile_02", resType: ResType.Prefab, bundleName: "Mobile_02", path: "Prefabs/Mobile_02" },
        
        { resKey: "Mobile_03", resType: ResType.Prefab, bundleName: "Mobile_03", path: "Prefabs/Mobile_03" },
        { resKey: "Mobile_04", resType: ResType.Prefab, bundleName: "Mobile_04", path: "Prefabs/Mobile_04" },
        { resKey: "Mobile_05", resType: ResType.Prefab, bundleName: "Mobile_05", path: "Prefabs/Mobile_05" },
        { resKey: "Mobile_06", resType: ResType.Prefab, bundleName: "Mobile_06", path: "Prefabs/Mobile_06" },
    ];

}


