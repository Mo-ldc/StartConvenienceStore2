import { _decorator, Component, EventTouch, instantiate, Node, Prefab, v3, Vec3 } from 'cc';
import { CtrBase } from './CtrBase';
import { BaseRoom } from '../Game/BaseRoom';
import { CtrMgr } from '../Mgr/CtrMgr';
import { MessMgr } from '../Mgr/MessMgr';
import { GameEvent } from '../Data/Enum/GameEvent';
import { RoomEnum } from '../Data/Enum/RoomEnum';

import { LobbyRoom } from 'db://assets/RoomRes/LobbyRoom/Scripts/LobbyRoom';
import { PartsRoom } from 'db://assets/RoomRes/PartsRoom/Scripts/PartsRoom';
import { RepairRoom } from 'db://assets/RoomRes/RepairRoom/Scripts/RepairRoom';
import { PartType } from '../Data/Type/ObjType';
const { ccclass, property } = _decorator;

@ccclass('CtrRoom')
export class CtrRoom extends CtrBase  {
    /** 房间根节点 */
    @property({ type: Node , tooltip: '房间根节点' })
    public roomRoot: Node = null;

    /** 接待室 */
    @property({ type: LobbyRoom , tooltip: '接待室' })
    public lobbyRoom: LobbyRoom = null;
    /** 配件商店 */
    @property({ type: PartsRoom , tooltip: '配件商店' })
    public partsRoom: PartsRoom = null;
    /** 修复房间 */
    @property({ type: RepairRoom , tooltip: '修复房间' })
    public repairRoom: RepairRoom = null;


    init(){
        console.log("初始化 房间 数据：");
        this.lobbyRoom.init();
        this.partsRoom.init();
        this.repairRoom.init();
    }


    registerEvent(): void {
        MessMgr.on(GameEvent.ChangeRoom, this.changeRoom, this);
        MessMgr.on(GameEvent.JumpToPartShop, this.jumpToPartShop, this);
        MessMgr.on(GameEvent.JumpToRepairRoom, this.jumpToRepairRoom, this);
        MessMgr.on(GameEvent.RefreshRole, this.refreshRole, this);
        MessMgr.on(GameEvent.RoomCreateMobile, this.handleCreateMobile, this);
        MessMgr.on(GameEvent.MobileMoveToRepairRoom, this.mobileMoveToRepairRoom, this);
        MessMgr.on(GameEvent.MobileMoveToLobbyRoom, this.mobileMoveToLobbyRoom, this);
        
    }
    removeEvent(): void {
        MessMgr.off(GameEvent.ChangeRoom, this.changeRoom, this);
        MessMgr.off(GameEvent.JumpToPartShop, this.jumpToPartShop, this);
        MessMgr.off(GameEvent.JumpToRepairRoom, this.jumpToRepairRoom, this);
        
        MessMgr.off(GameEvent.RefreshRole, this.refreshRole, this);
        MessMgr.off(GameEvent.RoomCreateMobile, this.handleCreateMobile, this);
        MessMgr.off(GameEvent.MobileMoveToRepairRoom, this.mobileMoveToRepairRoom, this);
        MessMgr.off(GameEvent.MobileMoveToLobbyRoom, this.mobileMoveToLobbyRoom, this);
    }

    /** 刷新角色 */
    private refreshRole(): void {
        const ctrLv = CtrMgr.getInstance().ctrLv;
        if (this.lobbyRoom) {
            // 根据需求来创建角色 创建维修手机
            const data = ctrLv.getCurrentOrder();
            const roleData = ctrLv.roleData;
            this.lobbyRoom.initOrder(data, roleData.roleKey);
        }

    }

    /** 响应房间创建手机的需求 */
    private handleCreateMobile(mobileKey: string, room: BaseRoom): void {
        if(room)
        this.createMobile(mobileKey, room);
        else
            console.warn("房间不存在")
    }


    private changeRoom(roomEnum: RoomEnum): void {
        // console.log("切换房间: " + roomEnum);
        if(this.repairRoom){
            this.repairRoom.partBtnRoot.active = false;
        }
        switch (roomEnum) {
            case RoomEnum.LobbyRoom:
                this.lobbyRoom.showRoom();
                this.repairRoom.hideRoom();
                this.partsRoom.hideRoom();
                /** 显示选房间的UI */
                // MessMgr.emit(GameEvent.RoomUIActive, true);

                let mobile = this.repairRoom.repairMobile;
                if(mobile){
                    let data = mobile.getRepairHint();
                    if(data && data.action == "complete"){
                        //
                        this.lobbyRoom.showCompleteMobile(mobile.node);
                    }
                }
               
                break;
            case RoomEnum.PartsRoom:
                this.partsRoom.showRoom();
                this.lobbyRoom.showRoom();
                this.repairRoom.hideRoom();
                break;
            case RoomEnum.RepairRoom:
                this.repairRoom.showRoom();
                this.lobbyRoom.hideRoom();
                this.partsRoom.hideRoom();

                /** 隐藏选房间的UI */
                // MessMgr.emit(GameEvent.RoomUIActive, false);
                break;
            default:
                break;
        }
    }

    /** 手机移动到维修间 */
    public mobileMoveToRepairRoom(): void {
        this.repairRoom?.addMobile(this.lobbyRoom?.mobile, this.lobbyRoom?.getOrder().mobileKey);
        MessMgr.emit(GameEvent.ChangeRoom, RoomEnum.RepairRoom);
    }
    /** 手机移动到前台 */
    public mobileMoveToLobbyRoom(): void {
        this.lobbyRoom?.addMobile(this.repairRoom?.mobile);
        MessMgr.emit(GameEvent.ChangeRoom, RoomEnum.LobbyRoom);
    }

    /** 创建一个手机 */
    public createMobile(mobileKey: string, room: BaseRoom): void {
        const ctrRes = CtrMgr.getInstance().ctrRes;
        const prefab = ctrRes.getPrefab(mobileKey);
        if (prefab) {
            this._createMobile(prefab, mobileKey, room);
        }else{
            ctrRes.GetMobilePrefab(mobileKey).then(prefab => {
                this._createMobile(prefab, mobileKey, room);
            });
        }
    }
    private _createMobile(prefab: Prefab,mobileKey: string,room: BaseRoom): void {
        if(!prefab){
            console.warn("手机预制体不存在")
            return;
        }
        if(!room){
            console.warn("房间不存在")
        }
        const mobile = instantiate(prefab);
        room?.addMobile(mobile, mobileKey);
        console.log(room.node.name + " 创建手机: " + mobileKey);
    }
    /** 跳转到零件商店 */
    private jumpToPartShop(partKey: string): void {
        if(!this.partsRoom){
            console.warn("零件商店不存在")
            return;
        }
        this.partsRoom.showTargetShop(partKey);

        MessMgr.emit(GameEvent.ChangeRoom, RoomEnum.PartsRoom);
    }

    /** 跳转到维修界面且生成对应的零件 */
    private jumpToRepairRoom(): void {
        if (!this.repairRoom) {
            console.warn("维修房间不存在")
            return;
        }
        if (this.repairRoom.toGeneratePartType != PartType.无) {
            this.repairRoom.onJumpBack();
            MessMgr.emit(GameEvent.ChangeRoom, RoomEnum.RepairRoom);
        }

    }
}


