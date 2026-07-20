import { _decorator, Node, Prefab, UITransform, Vec3, v3, v2, Vec2, EventTouch, Label, LabelOutline, Color, tween, Quat } from 'cc';
import { CtrBase } from './CtrBase';

const { ccclass, property } = _decorator;
@ccclass('CtrRole')
export class CtrRole extends CtrBase {
    
    init(): void { }

    registerEvent(): void {
        // MessMgr.on(GameEvent.ObjectDied, this.handleRoleDied, this);
    }

    resetEvent(): void {
        // MessMgr.off(GameEvent.ObjectDied, this.handleRoleDied, this);
    }
    public upDateCtr(dt: number): void {
       
    }

    dispose(): void {

    }
    //#endregion

}
