import { Quality } from "../Enum/Enum";
import { OrderType } from "../Type/ObjType";

/** 编辑器组数据  */
export class EditorGroupData {
    /** 组ID  */
    groupID: string = "";
    /** 组名称  */
    groupName?: string = "";
    /** 组层级  */
    groupLayer: number = Infinity;
}

