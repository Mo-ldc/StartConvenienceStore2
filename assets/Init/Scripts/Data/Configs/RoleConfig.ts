import { RoleConfigData } from "../Data/ConfigData";
import { Gender } from "../Enum/Enum";


export class RoleConfig {
    private static _map: Map<string, RoleConfigData> = null;
    public static get(key: string): RoleConfigData | undefined {
        if (!this._map) {
            this._map = new Map();
            for (let i = 0; i < this.data.length; i++) {
                const d = this.data[i];
                this._map.set(d.roleKey, d);
            }
        }
        return this._map.get(key);
    }
    private static data: RoleConfigData[] = [
        { roleKey: "roleSpr_1", roleName: "角色1", sex: Gender.女 },
        { roleKey: "roleSpr_2", roleName: "角色2", sex: Gender.男 },
        { roleKey: "roleSpr_3", roleName: "角色3", sex: Gender.男 },
        // { roleKey: "roleSpr_4", roleName: "角色4", sex: Gender.男 },
        { roleKey: "roleSpr_5", roleName: "角色5", sex: Gender.女 },
    ];

    /** 随机一个角色 */
    public static random(): RoleConfigData {
        return this.data[Math.floor(Math.random() * this.data.length)];
    }
}