import { ResType } from "../Type/ResType";

/** 资源数据  */
export interface ResData {
    resKey: string;
    resType: ResType;
    bundleName: string;
    path?: string;
}


