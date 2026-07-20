import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameVar')
export class GameVar{
    private static _pause: number = 0;
    /** 游戏暂停 */
    static get pause(){
        // console.log("游戏暂停:", TowerDefenseManager.getInstance().暂停标签)
        return this._pause > 0;
    }
    static set pause(value: boolean){
        if(value) this._pause ++;
        else this._pause --;
    }
    static get pauseCount(){
        return this._pause;
    }

    /** 强制恢复 */
    static forceResume(){
        this._pause = 0;
    }

    /** 游戏时间缩放 */
    private static _timeScale: number = 1;
    static get timeScale(){
        return this._timeScale;
    }
    static set timeScale(value: number){
        if(value < 0) value = 0;
        this._timeScale = value;
    }

    /** 游戏是否开始 */
    private static _isStart: boolean = false;
    /** 游戏是否开始 */
    static get isStart(){
        return this._isStart;
    }
    static set isStart(value: boolean){
        this._isStart = value;
    }

    /** 当前游玩的关卡ID */
    private static _currentLvID: number = 0;
    static get currentLvID(){
        return this._currentLvID;
    }
    static set currentLvID(value: number){
        this._currentLvID = value;
    }

}


