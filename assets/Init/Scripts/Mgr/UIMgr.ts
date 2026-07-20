import { _decorator, Component, instantiate, Node, Prefab, SpriteFrame, Widget } from 'cc';
import { ResConfig } from '../Data/ResConfigs/ResConfig';
import { ResMgr } from './ResMgr';
import { BaseUI } from '../UI/Base/BaseUI';
import { PoolMgr } from './PoolMgr';
import { UI_Tip } from '../UI/UI_Tip';
import { ResData } from '../Data/Data/ResData';

const { ccclass, property } = _decorator;
export enum UIName {
    /** 提示UI */
    Tip = "Tip",

    /** 设置页面UI */
    uiSetting = "uiSetting",
    /** 主页面UI */
    uiMain = "uiMain",
    /** 贷款界面 */
    uiLoan = "uiLoan",
    /** 出价界面 */
    uiBid = "uiBid",

    /** 支付界面 */
    uiPayRent = "uiPayRent",
    /** 新闻界面 */
    uiNews = "uiNews",
    /** 教程界面 */
    uiTutorial = "uiTutorial",
    /** 结算界面 */
    uiResult = "uiResult",
}

@ccclass('UIMgr')
export class UIMgr extends Component {
    private static m_instance: UIMgr = null!;
    public static getInstance(): UIMgr {
        return this.m_instance;
    }

    private pageRoot: Node = null; // 页面根节点
    private dialogRoot: Node = null; // 弹窗根节点
    private tipRoot: Node = null; // 提示根节点

    private _loadingMap: Map<string, Promise<Prefab | null>> = new Map();
    public tipStr: string = "";


    protected onLoad(): void {
        UIMgr.m_instance = this;
        if (!this.pageRoot) {
            this.pageRoot = this.node.getChildByName("pageRoot");
            if (!this.pageRoot) {
                this.addRootNode(this.pageRoot, "pageRoot");
            }
        }
        if (!this.dialogRoot) {
            this.dialogRoot = this.node.getChildByName("dialogRoot");
            if (!this.dialogRoot) {
                this.addRootNode(this.dialogRoot, "dialogRoot")
            }
        }
        if (!this.tipRoot) {
            this.tipRoot = this.node.getChildByName("tipRoot");
            if (!this.tipRoot) {
                this.addRootNode(this.tipRoot, "tipRoot");
            }
        }
    }
    /** 增加根节点 */
    private addRootNode(root: Node, name: string) {
        let uiRootPre = this.getUIPrefab("uiRoot");
        if (!uiRootPre) {
            this.loadUIPrefab("uiRoot").then(prefab => {
                root = instantiate(prefab);
                root.parent = this.node;
                root.name = name;
            });
        } else {
            root = instantiate(uiRootPre);
            root.parent = this.node;
            root.name = name;
        }
    }

    public getUIPrefab(key: string): Prefab | null {
        let prefab = ResMgr.getInstance().GetPrefabMap().get(key);
        if (prefab) return prefab;
    }
    public showTip(str: string, callBack?: Function) {
        const uiName = UIName.Tip;
        let pre = this.getUIPrefab(uiName);
        if (!pre) {
            this.loadUIPrefab(uiName).then(prefab => {
                this.addTip(uiName, prefab, str, callBack);
            });
        } else {
            this.addTip(uiName, pre, str, callBack); 
        }

    }
    public showDialog(uiName: string, callBack?: Function) {
        console.log("显示弹窗：", uiName);
        const parent = this.dialogRoot;
        this.showUI(uiName, parent, callBack);
    }
    public showPage(uiName: string, callBack?: Function) {
        console.log("显示页面：", uiName);
        const parent = this.pageRoot;
        this.showUI(uiName, parent, callBack);
    }
    
    private showUI(uiName: string, parent: Node, callBack?: Function) {
        if (!parent) {
            console.warn("无法显示UI：", uiName, " 父节点为空:", parent);
            callBack && callBack();
            return;
        }

        let pre = this.getUIPrefab(uiName);
        if (!pre) {
            this.loadUIPrefab(uiName).then(prefab => {
                this.addUI(uiName, parent, prefab, callBack);
            });
        }else{
            this.addUI(uiName, parent, pre, callBack);
        }
    }

    private loadUIPrefab(uiKey: string): Promise<Prefab | null> {
        const data = ResConfig.UIResArr.find(d => d.resKey === uiKey);
        if (!data) {
            console.error("未找到该公共UI预制体配置:", uiKey);
            return null;
        }
        return this.GetOrLoadPrefab(data).then(prefab => {
            return prefab;
        });
    }
    private addUI(uiName: string, parent: Node, prefab: Prefab, callBack?: Function) {
        let uiNode = PoolMgr.get(uiName, prefab);
        if (!uiNode) {
            console.warn("UI不存在:", uiName);
            return;
        }
        uiNode.parent = parent;
        let ui = uiNode.getComponent(BaseUI);
        if (ui) {
            ui.show(callBack);
            
        }
        return ui;
    }
    private addTip(uiName: string, prefab: Prefab, str: string, callBack?: Function) {
        let uiNode = PoolMgr.get(uiName, prefab);
        if (!uiNode) {
            console.warn("UI不存在:", uiName);
            return;
        }
        uiNode.parent = this.tipRoot;
        let ui = uiNode.getComponent(UI_Tip);
        if (ui) {
            ui.show(callBack);
            ui.setTip(str);
        }
        return ui;
    }
    hideDialog(uiName: string) {
        const parent = this.dialogRoot;
        this.hideUI(uiName, parent);
    }
    hidePage(uiName: string, callBack?: Function) {
        const parent = this.pageRoot;
        this.hideUI(uiName, parent, callBack);
    }
   
    private hideUI(uiName: string, parent: Node, callBack?: Function) {
        let ui = parent.getChildByName(uiName);
        
        if (ui != null) {
            let uiSrc = ui.getComponent(BaseUI);
            if(uiSrc){
                uiSrc.hide(() => {
                    callBack && callBack();
                    ui.removeFromParent();
                    PoolMgr.put(uiName, ui);
                });
            }else{
                ui.removeFromParent();
                PoolMgr.put(uiName, ui);
            }

        }
    }
    /**
     *  
     * @param ui 
     */
    hideUINode(ui: Node) {
        if (ui && ui.parent) {
            ui.removeFromParent();
            PoolMgr.put(ui.name, ui);
        }
    }


    /** 获取或加载预制体，返回 Promise — 用到才加载，同路径不重复加载 */
    private async GetOrLoadPrefab(resData: ResData): Promise<Prefab | null> {
        if (!resData) return null;
        const path = resData.path;
        const key = resData.resKey;
        const resMgr = ResMgr.getInstance();
        let prefab = resMgr.GetPrefabMap().get(key);
        if (prefab) return prefab;

        const loading = this._loadingMap.get(path);
        if (loading) return loading;

        const promise = resMgr.LoadPrefab(resData);
        this._loadingMap.set(path, promise);
        try {
            prefab = await promise;
        } finally {
            this._loadingMap.delete(path);
        }
        return prefab;
    }
}


