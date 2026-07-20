import { _decorator, Component, Node, Sprite, SpriteFrame, tween, UIOpacity, Vec3 } from 'cc';
import { AudioMgr, AudioName } from '../Mgr/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Role')
export class Role extends Component {
    /** 初始位置 */
    @property(Vec3)
    public initialPosition: Vec3 = new Vec3(0, 0, 0);

    /** 展示位置 */
    @property(Vec3)
    public displayPosition: Vec3 = new Vec3(0, 0, 0);


    /** 角色图片 */
    @property(Sprite)
    public roleSpr: Sprite = null;

    /** 角色图片数组 */
    @property({ type: SpriteFrame, tooltip: '角色图片数组' })
    public sprArr: SpriteFrame[] = [];

    initRole(roleKey?: string) {
        this.node.setPosition(this.initialPosition);
        this.setRoleSpr(roleKey);
    }
    setRoleSpr(roleKey?: string){
        let spr = this.sprArr.find(spr => spr.name === roleKey);
        if (spr) this.roleSpr.spriteFrame = spr;
        else{
            this.roleSpr.spriteFrame = null;
        }
    }

    /** 显示角色 */
    showRole(callback?: Function) {
        AudioMgr.PlaySound(AudioName.GuestCome);
        let op = this.node.getComponent(UIOpacity);
        if(!op) op = this.node.addComponent(UIOpacity);
        op.opacity = 0;
        tween(op)
            .to(0.2, { opacity: 255 })
            .start();

        tween(this.node)
            .to(0.5, { position: this.displayPosition })
            .call(()=>{
                callback && callback();
            })
            .start();
    }
    hideRole(callback?: Function) {
        let op = this.node.getComponent(UIOpacity);
        if(!op) op = this.node.addComponent(UIOpacity);
        op.opacity = 255;
        tween(op)
            .delay(0.2)
            .to(0.2, { opacity: 0 })
            .start();

        tween(this.node)
            .to(0.5, { position: this.initialPosition })
            .call(()=>{
                callback && callback();
            })
            .start();
    }

    hideRoleDelay(delaySec: number, callback?: Function) {
        this.scheduleOnce(() => {
            this.hideRole(callback);
        }, delaySec);
    }
}


