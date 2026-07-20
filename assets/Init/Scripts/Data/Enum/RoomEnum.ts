import { Enum } from "cc";

export enum RoomEnum{
    None = "None",
    /** 接待室 */
    LobbyRoom = "LobbyRoom",
    /** 部件室 */
    PartsRoom = "PartsRoom",
    /** 维修室 */
    RepairRoom = "RepairRoom"
}
Enum(RoomEnum);


