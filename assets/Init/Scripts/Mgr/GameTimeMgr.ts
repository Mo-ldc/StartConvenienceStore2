import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;
/**游戏时间跟新管理 */
@ccclass('GameTimeMgr')
export class GameTimeMgr extends Component {
    private static _instance: GameTimeMgr = null;
    public static getInstance(): GameTimeMgr {
        if (!this._instance) {
            console.error('管理丢失，请查看是否存在GameTimeManager节点');
        }
        return this._instance;
    }

    protected onLoad(): void {
        GameTimeMgr._instance = this;
        director.addPersistRootNode(this.node);
    }


    protected update(dt: number): void {
        this.updateGameTime(dt);
    }

    //#region 游戏时间部分跟新
    public m_game_time = 0;
    public 能否更新游戏时间: boolean = false;
    /**显示的时间 */
    public show_game_time = 0;

    /**更新游戏关卡时间 */
    private updateGameTime(dt: number): void {

        if (this.m_game_time > 0) {
            this.m_game_time -= dt;
            const show_time = Math.ceil(this.m_game_time);
            // const show_time = Math.floor(this.m_game_time);
            if(show_time != this.show_game_time){
                this.show_game_time = show_time;
                // 发送消息更新玩家时间
                // MessMgr.emit(GameEvent.更新游戏时间UI,this.show_game_time);
            }
        }else{
            this.m_game_time = 0;
            this.show_game_time = 0;
       
            // MessMgr.emit(GameEvent.更新游戏时间UI,this.show_game_time);
        }
    }
    //#endregion
    
    当前剩余时间:number = 0;
    是否开启内部倒计时:boolean = false;
    /**更新拼图内部倒计时 */
    public updatePuzzleTime(dt:number){ 
        if(!this.是否开启内部倒计时){
            return;
        }
        if (this.当前剩余时间 <= 0) {
            this.当前剩余时间 = 0;
            return;
        }
        this.当前剩余时间 -= dt;

    }

}


