import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { PoolMgr } from '../../Mgr/PoolMgr';
import { UIShowType } from '../../Data/Type/Type';

const { ccclass, property } = _decorator;

@ccclass('BaseUIComponent')
export class BaseUIComponent extends Component {

    /** UI显示方式 */
    protected UIShowType:UIShowType = UIShowType.None;
    protected 显示时间: number = 0; // 血条显示时间
    /** 用于判断是否为同一个节点需要血条 */
    public 跟随节点: Node = null;
    protected 同步位置节点: Node = null;
    public show(
        _跟随节点: Node, 
        _同步位置节点: Node, 
        _UIShowType:UIShowType,
        _显示时间?: number 
    ){
        this.跟随节点 = _跟随节点;
        this.同步位置节点 = _同步位置节点;
        this.显示时间 = _显示时间;
        this.UIShowType = _UIShowType;
        this.node.active = true;
        this.upDataPos();
        
    }
    
    public upDataPos() {
        if (this.同步位置节点 && this.node.parent) {
            // console.log("更新血条位置：", this.跟随节点.name);
            let pos = this.同步位置节点.worldPosition.clone();
            pos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(pos);
            this.node.setPosition(pos);
        }
    }
    public 激活节点(_显示时间: number) {
        this.node.active = true;
        this.显示时间 = _显示时间;
    }
    public upDataContent(...args: any[]) {
        console.log("更新组件内容：", args);
    }
    public showTime(时间: number) {
        this.显示时间 = 时间;
    }

    public upDataUI(dt: number) {
        if(!this.node.active){
            return;
        }
        let 是否隐藏 = false;
        switch (this.UIShowType) {
            case UIShowType.Brief:
                if (this.显示时间) {
                    this.显示时间 -= dt;
                    if (this.显示时间 <= 0) {
                        是否隐藏 = true;
                    }
                } else {
                    是否隐藏 = true;
                }
                break;
            case UIShowType.Permanent   :

                break;
            default:
                是否隐藏 = true;
                break;
                
            }
        if(是否隐藏){
            this.node.active = false;
        }
    }
    public removeObjcet() {
        this.跟随节点 = null;
        this.同步位置节点 = null;
        if (this.node.parent) {
            this.node.parent = null;
        }
        PoolMgr.put(this.node.name, this.node);
    }
}


