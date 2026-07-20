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
        { resKey: "Mobile_01", resType: ResType.Prefab, bundleName: "Mobile_01", path: "Prefabs/Mobile_01" }
    ];

}


