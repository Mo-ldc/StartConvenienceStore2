import { _decorator, AssetManager, assetManager, Component, director, Prefab, ProgressBar, SceneAsset, UITransform, Node, UI} from 'cc';

import PlatForm from '../Tool/PlatForm';
import { DebugConfig } from '../Data/Configs/DebugConfig';
import { ResConfig } from '../Data/ResConfigs/ResConfig';
import { GameData } from '../Data/Data/GameData';
import { ResMgr } from '../Mgr/ResMgr';
import { UIMgr, UIName } from '../Mgr/UIMgr';

const { ccclass, property } = _decorator;

/** 游戏入口 */
@ccclass('GameEntry')
export class GameEntry extends Component {
    /**加载进度条 */
    @property({ type: ProgressBar, displayName: "加载进度条" })
    private m_progress: ProgressBar = null;
    /**进度条加载速度 */
    private barspeed: number = 3;

    /** 已经加载的资源 */
    private loadedResNum: number = 0;
    /** 最大的加载资源数 */
    private maxLoadResNum: number = 0;    
    /** 当前进度 */
    private curProgress: number = 0;

    /** 当前加载的资源 */
    private curLoadAssets: string[] = [];




    protected onLoad(): void {
        console.log("游戏初始化中...")
        //接入抖音直玩
        PlatForm.getInstance().接入抖音直玩()
        PlatForm.getInstance().抖音检查更新()

        // Platforms_QuickGame.getInstance().onInit()
  
        this.curLoadAssets = [];
        this.curLoadAssets.push(...ResConfig.优先加载资源);
        this.loadedResNum = 0;
        this.maxLoadResNum = this.curLoadAssets.length + 1;
        // PlayerPrefs.DeleteAll();
        GameData.Init();

        // DataSave.getInstance().ReadSaveData();
        this.onInitLoad();
        // director.addPersistRootNode(this.node); // 设置为常驻节点

    }


    async onInitLoad() {
        /**加载Init部分资源 */
        console.time("加载基础资源");
        await this._loadBundle(this.curLoadAssets);
        console.timeEnd("加载基础资源");
        this.OnEnterGame()
    }

    private async _loadBundle(resKeyArr: string[]) {
        if(DebugConfig.Is_Show_Load_Info){
            console.log("加载资源包ID：",resKeyArr)
        }
        const startRes = ResConfig.StartRes;
        for (let i = 0; i < resKeyArr.length; i++) {
            let key = resKeyArr[i];
            let resData = startRes.find(bundle => bundle.resKey === key);
            if(!resData) continue;
            console.time("加载：" + resData.resKey);
            await ResMgr.getInstance().LoadBundle(resData.bundleName).then(bundle => {
                if (bundle) {
                    this.loadedResNum++;
                    if (DebugConfig.Is_Show_Load_Info) {
                        console.warn(`加载资源包 ${resData.bundleName} 成功`);
                    }
                } else {
                    if (DebugConfig.Is_Show_Load_Info) {
                        console.warn(`加载资源包 ${resData.bundleName} 失败`);
                    }
                }
            });
            console.timeEnd("加载：" + resData.resKey);
        }
      
    }

    protected update(dt: number): void {
        let 进度 = this.loadedResNum / this.maxLoadResNum;
        if (this.curProgress < 进度) {
            this.curProgress += dt * this.barspeed;
            this.m_progress.progress =this.curProgress;
        }

    }
  
    private OnEnterGame() {
        //可以在这显示隐私政策
        // PlatForm.getInstance().ReportAnalytics("enter_window_id", { window_id: PlatData_MaiDian.第一次进入游戏界面 });
        const sceneResData = ResConfig.StartRes.find(res => res.resKey === ResConfig.SceneResKey);
        DebugConfig.Info("预加载场景：" + sceneResData.resKey)
        director.preloadScene(sceneResData.resKey, (completedCount: number, totalCount: number, item: any) => {
            // 进度回调函数
            this.m_progress.progress = completedCount / totalCount;
        },
            (error: Error, sceneAsset: SceneAsset) => {
                // 加载完成的回调函数
                if (error) {
                    DebugConfig.Warning('场景加载失败:'+ error);
                }
                else {
                    DebugConfig.Info("加载场景：" + sceneResData.resKey)
                    director.loadScene(sceneResData.resKey, (err, scene: any) => {
                        // UIManager.ShowUI(UIManager.UIName.选关界面);
                        DebugConfig.Info("场景加载完成：" + sceneResData.resKey)
                        
                    });
                }
            });
    }
}