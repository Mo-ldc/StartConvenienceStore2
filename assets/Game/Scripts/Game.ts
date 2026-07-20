import { _decorator, Component, EventTouch, Node } from 'cc';
import { CtrMgr } from '../../Init/Scripts/Mgr/CtrMgr';
import { CtrBase } from '../../Init/Scripts/Ctr/CtrBase';
import { GameVar } from '../../Init/Scripts/Data/Store/GameVar';
import { IDGenerator } from '../../Init/Scripts/Infrastructure/IDGenerator';
import { MessMgr } from '../../Init/Scripts/Mgr/MessMgr';
import { UIMgr, UIName } from '../../Init/Scripts/Mgr/UIMgr';
import { DataStore } from '../../Init/Scripts/Data/Store/DataStore';
import { GameEvent } from '../../Init/Scripts/Data/Enum/GameEvent';
import { GameData } from '../../Init/Scripts/Data/Data/GameData';

const { ccclass, property } = _decorator;

/**
 * 游戏主场景入口脚本
 * 
 * 职责：
 * - 初始化整个游戏架构（DataStore、IDGenerator、Controllers、Services）
 * - 每帧驱动 CtrMgr 更新所有控制器
 * - 转发触摸事件到 CtrMgr
 * - 场景退出时清理全局状态
 * 
 * 初始化顺序：
 * 1. 重置 DataStore 和 IDGenerator
 * 2. 扫描 ctrRoot 子节点，注册所有 Controller 到 CtrMgr
 * 3. 初始化地图（CtrMap.init → 创建地图 → 注册建筑）
 * 4. 初始化玩法（CtrPlay.init → 经济系统 → 加载 UI）
 * 5. 启动战斗（LevelService.startBattle）
 */
@ccclass('Game')
export class Game extends Component {
    /** 控制器根节点（子节点上挂载各 CtrBase 组件） */
    @property(Node)
    ctrRoot: Node = null;

    /** 场景激活时：注册事件 + 初始化 */
    protected onLoad(): void {
        this.registerEvent();

    }
    /** 场景禁用时：取消事件 + 清理 */
    protected onDestroy(): void {
        this.resetEvent();
    }

    /** 注册触摸事件 */
    registerEvent() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        // MessMgr.on(GameEvent.StartGame, this.initData, this);
        // MessMgr.on(GameEvent.ResetGame, this.resetGame, this);
    }

    /** 取消触摸事件 */
    resetEvent() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        // MessMgr.off(GameEvent.StartGame, this.initData, this);
        // MessMgr.off(GameEvent.ResetGame, this.resetGame, this);
    }

    protected onEnable(): void {
        this.init();
    }

    /** 初始化游戏：重置数据 → 注册控制器 → 创建地图 → 启动战斗 */
    init() {
        // 重置全局数据
        GameVar.isStart = false;
        const arr = this.ctrRoot.children;
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            const ctr = element.getComponent(CtrBase);
            if (ctr) {
                CtrMgr.getInstance().addCtr(ctr);
            } else {
                console.warn("无控制器", element.name);
            }
        }
        UIMgr.getInstance().showPage(UIName.uiMain);
    }

    protected start(): void {
        this.initData();
        GameVar.isStart = true;
    }

    /** 重置游戏：清理所有节点和数据（保留玩家货币/选择） */
    resetGame() {
        console.warn("重置游戏数据");

        // 1) 停帧
        GameVar.isStart = false;
        // GameVar.forceResume();



        // 3) 销毁角色节点 → 回收对象池（必须在 Map 销毁前）
        const ctrRole = CtrMgr.getInstance().ctrRole;
        if (ctrRole) ctrRole.dispose();

      
        DataStore.getInstance().reset();
        IDGenerator.reset();
    }

    /** 初始化 */
    initData() {
        DataStore.getInstance().reset();
        IDGenerator.reset();
        console.warn("初始化 游戏 数据：");
        const ctrLv = CtrMgr.getInstance().ctrLv;
        ctrLv.init();
        const ctrRoom = CtrMgr.getInstance().ctrRoom;
        ctrRoom.init();
        if (GameData.IsDaySettlement) {
            // 进入交房租阶段
            console.log("进入交房租阶段");
            UIMgr.getInstance().showDialog(UIName.uiPayRent);
        } else {
            console.log("进入结算判断阶段");
            MessMgr.emit(GameEvent.SettlementJudge);
        }
    }


    /** 每帧更新：驱动所有控制器的 upDateCtr */
    protected update(dt: number): void {
        
        if (!GameVar.isStart) {
            // console.log("update 未开始");
            return;
        }
        if (GameVar.pause) {
            // console.log("update 暂停");
            return;    
        };
        CtrMgr.getInstance().upDateCtr(dt);
    }

    /** 每帧晚更新：驱动所有控制器的 lateUpdateCtr */
    protected lateUpdate(dt: number): void {
        if (!GameVar.isStart) {
            // console.log("lateUpdate 未开始");
            return;
        }
        if (GameVar.pause) {
            // console.warn("lateUpdate 暂停");
            return;    
        };
        CtrMgr.getInstance().lateUpdateCtr(dt);
    }

    /** 触摸开始 → 转发给 CtrMgr 分发到各控制器 */
    onTouchStart(event: EventTouch) {

        if (!GameVar.isStart) return;
        if (GameVar.pause) {
            // console.log("onTouchStart 暂停");
            return;    
        };
        // console.log("Game onTouchStart")
        CtrMgr.getInstance().onTouchStart(event);
    }

    /** 触摸移动 → 转发给 CtrMgr */
    onTouchMove(event: EventTouch) {
        if (GameVar.pause) {
            // console.log("onTouchMove 暂停");
            return;    
        };
        if (!GameVar.isStart) return;
        // console.log("Game onTouchMove")
        CtrMgr.getInstance().onTouchMove(event);
    }

    /** 触摸结束 → 转发给 CtrMgr */
    onTouchEnd(event: EventTouch) {
        if (GameVar.pause) {
            // console.log("onTouchEnd 暂停");
            return;    
        };
        if (!GameVar.isStart) return;
        // console.log("Game onTouchEnd")
        CtrMgr.getInstance().onTouchEnd(event);
    }

    
}
