import { _decorator, Prefab, SpriteFrame } from 'cc';
import { CtrBase } from './CtrBase';

import { ResMgr } from '../Mgr/ResMgr';
import { ResConfig } from '../Data/ResConfigs/ResConfig';
import { ResData } from '../Data/Data/ResData';
import { MobileResConfig } from '../Data/ResConfigs/MobileResConfig';

const { ccclass, property } = _decorator;
/**
 * 资源管理控制器
 */
@ccclass('CtrRes')
export class CtrRes extends CtrBase {
    private resMgr: ResMgr = ResMgr.getInstance();

    init(...args: any[]): void {
        this.resMgr = ResMgr.getInstance();
    }



    /** 获取或加载预制体，返回 Promise — 用到才加载，同路径不重复加载，锁机制防并发抢占 */
    private async GetOrLoadPrefab(resData: ResData): Promise<Prefab | null> {
        if (!resData) {
            console.error("GetOrLoadPrefab：缺少资源数据");
            return null;
        }
        return this.resMgr.LoadPrefab(resData);
    }

    /** 获取公共货币配置 */
    public GetCurrencyConfig(key: string): ResData | null {
        const data = ResConfig.CurrencyPreResArr.find(d => d.resKey === key);
        if (!data) {
            console.error(`未找到公共货币配置 ${key}`);
        }
        return data;
    }
    /** 获取公共货币预制体 */
    public GetCurrencyPrefab(key: string): Promise<Prefab | null> {
        const data = ResConfig.CurrencyPreResArr.find(d => d.resKey === key);
        return this.GetOrLoadPrefab(data);
    }
    /** 获取公共特效预制体 */
    public GetEffectPrefab(key: string): Promise<Prefab | null> {
        const data = ResConfig.EffectResArr.find(d => d.resKey === key);
        // console.warn("获取特效预制体：", key);
        return this.GetOrLoadPrefab(data);
    }
    /** 获取Hp预制体 */
    public GetHpPrefab(key: string): Promise<Prefab | null> {
        const data = ResConfig.HpResArr.find(d => d.resKey === key);
        return this.GetOrLoadPrefab(data);
    }
    /** 获取Label预制体 */
    public GetLabelPrefab(key: string): Promise<Prefab | null> {
        const data = ResConfig.LabelResArr.find(d => d.resKey === key);
        return this.GetOrLoadPrefab(data);
    }
    public GetMobilePrefab(key: string): Promise<Prefab | null> {
        const data = MobileResConfig.get(key)
        return this.GetOrLoadPrefab(data);
    }
    

    /** 获取房间预制体 */
    public GetRoomPrefab(key: string): Promise<Prefab | null> {
        const data = ResConfig.RoomResArr.find(d => d.resKey === key);
        if(!data){
            console.error(`未找到房间预制体 ${key}`);
        }else{
            // console.warn(`获取房间预制体 ${key}`);
        }
        return this.GetOrLoadPrefab(data);
    }

    /** 获取图片 */
    public getSpriteFrame(key: string) {
        return this.resMgr.GetSpriteFrameMap().get(key);
    }
    public LoadSpriteFrame(data: ResData) {
        return this.resMgr.GetSpriteFrame(data);
    }

    /** 获取预制体 */
    public getPrefab(key: string) {
        let prefab = this.resMgr.GetPrefabMap().get(key);
        if (prefab) return prefab;
    }

    // /** 预加载血条资源 */
    // async preloadHpResources(hpKeyArr: string[]) {
    //     for (let i = 0; i < hpKeyArr.length; i++) {
    //         const key = hpKeyArr[i];
    //         let pre = this.getPrefab(key);
    //         if (!pre) {
    //             await this.GetHpPrefab(key);
    //             console.log("预加载血条资源：", key);
    //         }
    //     }
    // }


}
