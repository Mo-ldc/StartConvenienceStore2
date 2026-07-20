import { _decorator, Component, Enum, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import { RoomEnum } from 'db://assets/Init/Scripts/Data/Enum/RoomEnum';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
const { ccclass, property } = _decorator;

@ccclass('uiMainSelectRootBtn')
export class uiMainSelectRootBtn extends Component {
    /** 房间类型 */
    @property({ type: Enum(RoomEnum), tooltip: '房间类型' })
    roomType: RoomEnum = RoomEnum.None;

    
    sprite: Sprite = null;

    @property({ type: SpriteFrame, tooltip: '选中图片' })
    selectSprite: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: '未选中图片' })
    unselectSprite: SpriteFrame = null;


    btnScale: number = 1.2;
    btnScaleOriginal: number = 1;
    protected onLoad(): void {
        MessMgr.on(GameEvent.ChangeRoom, this.changeNode, this);
        this.sprite = this.node.getComponent(Sprite);
    }
    protected onDestroy(): void {
        MessMgr.off(GameEvent.ChangeRoom, this.changeNode, this);
    }
    

    /** 按钮选择 */
    public select(): void {
        // tween(this.node)
        //     .to(0.1, { scale: new Vec3(this.btnScale, this.btnScale, 1) })
        //     .start();
        this.sprite.spriteFrame = this.selectSprite;
    }
    public unselect(): void {
        // tween(this.node)
        //     .to(0.1, { scale: new Vec3(this.btnScaleOriginal, this.btnScaleOriginal, 1) })
        //     .start();
        this.sprite.spriteFrame = this.unselectSprite;
    }

    /** 改变节点 */
    private changeNode(type: RoomEnum) {
        if (type == this.roomType) {
            this.select();
        } else {
            this.unselect();
        }
    }
}


