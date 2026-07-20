import { AudioName } from "../../Mgr/AudioMgr";
import { ObjAudioConfigData } from "../Data/ConfigData";

export class AudioConfig {

    private static data: ObjAudioConfigData[] = [];

    private static _map: Map<string, ObjAudioConfigData> = null;

    public static get(key: string): ObjAudioConfigData | undefined {
        if (!this._map) {
            this._map = new Map();
            for (let i = 0; i < this.data.length; i++) {
                const d = this.data[i];
                this._map.set(d.objKey, d);
            }
        }
        return this._map.get(key);
    }
}
