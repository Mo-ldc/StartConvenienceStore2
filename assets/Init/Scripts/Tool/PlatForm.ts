import { DebugConfig } from "../Data/Configs/DebugConfig";



/**对外接口 包括广告 分享  埋点等*/
export default class PlatForm {
    private static m_Instance: PlatForm = null;
    public static getInstance(): PlatForm {
        if (!this.m_Instance) {
            this.m_Instance = new PlatForm();
        }

        return this.m_Instance;
    }



    public Ui_Ad_GetReward(成功回调: Function, 失败回调?: Function, 广告描述?: string, ui_name?: string) {
        if (DebugConfig.Is_No_Ad) {
            成功回调 && 成功回调();
            return;
        }
    
    }

    /**分享 */
    public Share(_callback?: Function) {
        // PlatForm.getInstance().ReportAnalytics("click_event", { event_id: 20003 });
        console.log("测试分享:直接成功")
        // Platforms_QuickGame.getInstance().shareInvite(
        //     () => {
        //         _callback && _callback();
        //     },
        //     () => { }
        // );
    }
    /**添加桌面 */
    public AddDesktop(_callback?: Function) {

        // PlatForm.getInstance().ReportAnalytics("click_event", { event_id: 20006 });
        console.log("添加桌面");
        // Platforms_QuickGame.getInstance().AddShortcut(() => {

            _callback && _callback();
        // })
    }
    /**去侧边栏 */
    public GoSidebar(_callback?: Function) {
        console.log("去侧边栏");
        // Platforms_QuickGame.getInstance().TTSlider(() => {
            // this.gosideBtn.node.active = false;
            // this.rewardBtn.node.active= true;
            _callback && _callback();
        // });
    }
    /**收藏 */
    public Collection(_callback?: Function) {
        // PlatForm.getInstance().ReportAnalytics("click_event", { event_id: 20004 });
        console.log("收藏");
        _callback && _callback();
    }
    /**录屏 */
    public Screen(_callback?: Function) {
        // PlatForm.getInstance().ReportAnalytics("click_event", { event_id: 20002 });
        console.log("录屏");
        _callback && _callback();
    }
    /**震动 */
    public Vibration(_callback?: Function) {

    }
    // 每个引导流程的打点 引导ID, 引导类型 引导状态

    public ReportGuide(id: number, type: string, status: string) {
        const guideData = { id: id, type: type, status: status };
        this.ReportAnalytics("guide_event", guideData);
    }
    

    // 关卡进度打点
    public ReportLevel(id:number,status:string) {
        const levelData = { id: id, status: status };
        this.ReportAnalytics("level_event", levelData);
    }

    // 抽奖次数
    public ReportDrawTimes( id:number) {
        const drawData = { id: id };
        this.ReportAnalytics("draw_event", drawData);
    }


    // 升星等级
    public ReportStarLevel(id:number,lv:number) {
        const starData = { id: id, lv_star: lv };
        this.ReportAnalytics("up_star_event", starData);
    }


    /**埋点 */
    public ReportAnalytics(eventName: string, data: object) {
        // if(DebugConfig.Is_Show_Report_Info){
        //     console.log(
        //         "埋点名字：",eventName,
        //         "\n埋点本体：",data);
        // }
        // tt.reportAnalytics('Enter_Window', {
        //     Window_Name: 'set_value',
        //   });
        // Platforms_QuickGame.getInstance().reportAnalytics(eventName,data);
    }

    public 接入抖音直玩() {
        let tt = globalThis.tt;
        if (tt) {
            const options = tt.getLaunchOptionsSync();
            console.log("游戏启动场景：", options.scene);
            if (options.scene.substring(options.scene.length - 4) === "3041") {
                console.log('从推荐直流进入');
                window['tt'].reportScene({
                    sceneId: 7001,
                    success(res) {
                        console.log(res)
                    },
                    fail(res) {
                        console.log(res)
                    }
                })
            } else {
                console.log("非直流场景进入_" + options.scene);
            }
        } else {
            console.log("非TT游戏");
        }
    }
    /** 检查更新 - 如果新版本已经准备完成 - 提示重启 */
    public 抖音检查更新() {
        let tt = globalThis.tt;
        if (tt
            && tt.getUpdateManager
            && tt.getUpdateManager().onUpdateReady
            && tt.showModal
        ) {
            const updateManager = tt.getUpdateManager();
            console.log("tt 注册版本更新回调");
            // TODO 这里的回调可能接收不到，可能已经在注册前就已经更新好了 - 待验证
            updateManager.onUpdateReady((res: any) => {
                console.log("tt 新版本已经准备完成, 准备弹窗提示");
                tt.showModal({
                    title: "更新提示",
                    content: "新版本已经准备好，是否重启小程序？",
                    success: (res: any) => {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate();
                        }
                    },
                });
            });
            updateManager.onCheckForUpdate((res: any) => {
                console.log("tt 检查更新结果", res.hasUpdate);
            });
        }
    }

}