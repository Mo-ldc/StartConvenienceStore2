import { _decorator, Component, instantiate, Label, Node, Prefab, ScrollView, Sprite, tween, Vec3 } from 'cc';
import { GameEvent } from 'db://assets/Init/Scripts/Data/Enum/GameEvent';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { MessMgr } from 'db://assets/Init/Scripts/Mgr/MessMgr';
import { BaseUI } from 'db://assets/Init/Scripts/UI/Base/BaseUI';
import { uiMainSelectRootBtn } from './uiMainSelectRootBtn';
import { RoomEnum } from 'db://assets/Init/Scripts/Data/Enum/RoomEnum';

const { ccclass, property } = _decorator;

@ccclass('uiMain')
export class uiMain extends BaseUI {
    /** 底部UI */
    @property({ type: Node, tooltip: '底部UI' })
    private bottomUI: Node = null;

    private btnArr: uiMainSelectRootBtn[] = [];
    curRoom: RoomEnum = RoomEnum.None; // 当前房间 



    protected registerEvent(): void {
        /** 更新体力 */
        // MessMgr.on(GameEvent.UpdateEnergy, this.refreshEnergyNum, this);    
        MessMgr.on(GameEvent.RoomUIActive, this.setRoomUIActive, this);   
        MessMgr.on(GameEvent.ChangeRoom, this.changeRoom, this);
        const arr = this.bottomUI.children;
        if(!arr || arr.length == 0) return;
        for (let i = 0; i < arr.length; i++) {
            const btn = arr[i];
            if (!btn) continue;
            const btnSrc = btn.getComponent(uiMainSelectRootBtn);
            if (!btnSrc) continue;
            // console.log("按钮名称", btn.name, "房间类型", btnSrc.roomType);
            btn.on(Node.EventType.TOUCH_END, this.onBtnClick.bind(this, btnSrc), this);
        }
    }
    protected removeEvent(): void {
        // MessMgr.off(GameEvent.UpdateEnergy, this.refreshEnergyNum, this);
        MessMgr.off(GameEvent.RoomUIActive, this.setRoomUIActive, this);    
        MessMgr.off(GameEvent.ChangeRoom, this.changeRoom, this);
        const arr = this.bottomUI.children;
        if(!arr || arr.length == 0) return;
        for (let i = 0; i < arr.length; i++) {
            const btn = arr[i];
            if (!btn) continue;
            btn.off(Node.EventType.TOUCH_END);
        }
    }

    init(): void {
        this.initBtn(RoomEnum.LobbyRoom);
    }

    private setRoomUIActive(active: boolean): void {
        if(this.bottomUI){
            this.bottomUI.active = active;
        }
    }
   
    private onBtnClick(btnSrc: uiMainSelectRootBtn): void {
        if(this.curRoom == btnSrc.roomType){
            return;
        }
        // console.warn("点击按钮", btnSrc.node.name," ", btnSrc.roomType);
        AudioMgr.PlaySound(AudioName.BtnClick);
        MessMgr.emit(GameEvent.ChangeRoom, btnSrc.roomType);
    }
    private changeRoom(roomEnum: RoomEnum): void {
        this.curRoom = roomEnum;
    }
    private initBtn(btnType: RoomEnum): void {
        for (let i = 0; i < this.btnArr.length; i++) {
            const btn = this.btnArr[i];
            if (btn.roomType == btnType) {
                btn.select();
                this.curRoom = btn.roomType;
            } else {
                btn.unselect();
            }
        }
    }
}


