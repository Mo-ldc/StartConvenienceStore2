import { _decorator } from 'cc';
import { DataMgr } from '../../Mgr/DataMgr';
import GameSetting from '../Setting/GameSetting';
import { DebugConfig } from '../Configs/DebugConfig';
import { LoanRecordData, ObjectStorageData } from './SaveData';

export class GameData 
{
    public static readonly VERSION  = '1.0.0';//游戏版本号
    public static readonly GAME_FRAME = 60;//游戏帧率

    static Init (){
        // PlayerPrefs.DeleteAll()
        if (this.SoundVar == null )
            this.SoundVar = 1;
        if (this.MusicVar == null )
            this.MusicVar = 1;
        if(this.Vibration == null)
            this.Vibration = 1;
        if(this.IsGoSideBar == null)
            this.IsGoSideBar = false;
        if(this.IsGetGoSideBarReward == null)
            this.IsGetGoSideBarReward = false;
        if(DebugConfig.Is_Show_Player_Data){
            console.log(
                '\n游戏音效数据：',this.SoundVar,
                '\n游戏音乐数据：',this.MusicVar,
                '\n是否震动：',this.Vibration,
                '\n是否进入侧边栏：',this.IsGoSideBar,
                '\n是否已领取侧边栏奖励：',this.IsGetGoSideBarReward,
            );
        }

        if(this.PlayerCoin == null)
            this.PlayerCoin =   GameSetting.PlayerCoin;
        if(this.PlayerStar == null)
            this.PlayerStar = GameSetting.PlayerStar;
        if(this.PlayerEnergy == null)
            this.PlayerEnergy = GameSetting.PlayerEnergy;
        
    }


    //#region 游戏公共数据
    static get SoundVar (){
        const val = DataMgr.getInstance().getItem( 'SoundVar');
        return val != null ? val : 1;
    }
    static set SoundVar ( value: number ){
        DataMgr.getInstance().setItem( 'SoundVar', value );
    }

    static get MusicVar (){
        const val = DataMgr.getInstance().getItem( 'MusicVar' );
        return val != null ? val : 1;
    }
    static set MusicVar ( value: number ){
        DataMgr.getInstance().setItem( 'MusicVar', value );
    }
    
    static get Vibration (){
        const val = DataMgr.getInstance().getItem( 'Vibration' );
        return val != null ? val : 1;
    }
    /**是否震动 */
    static set Vibration ( value: number ){
        DataMgr.getInstance().setItem( 'Vibration', value );
    }

    //#endregion



    //#region 侧边栏数据
    /**是否进入侧边栏 */
    static get IsGoSideBar(){
        const val = DataMgr.getInstance().getItem( 'IsGoSideBar' );
        return val != null ? val : false;
    }
    static set IsGoSideBar ( value: boolean ){
        DataMgr.getInstance().setItem( 'IsGoSideBar', value );
    }
    /**是否已领取侧边栏奖励 */
    static get IsGetGoSideBarReward(){
        const val = DataMgr.getInstance().getItem( 'IsGetGoSideBarReward');
        return val != null ? val : false;
    }
    static set IsGetGoSideBarReward ( value: boolean ){
        DataMgr.getInstance().setItem( 'IsGetGoSideBarReward', value );
    }
    //#endregion

 
    //#region 玩家数据
    /** 玩家星级 */
    static get PlayerStar (){
        const val = DataMgr.getInstance().getItem( 'PlayerStar' );
        return val != null ? val : GameSetting.PlayerStar;
    }
    static set PlayerStar ( value: number ){
        if(value >= 0)
        DataMgr.getInstance().setItem( 'PlayerStar', value );
    }

    /** 玩家金币 */
    static get PlayerCoin (){
        const val = DataMgr.getInstance().getItem( 'PlayerCoin' );
        return val != null ? val : GameSetting.PlayerCoin;
    }
    static set PlayerCoin ( value: number ){
        DataMgr.getInstance().setItem( 'PlayerCoin', value );
    }

    /** 玩家体力 */
    static get PlayerEnergy (){
        const val = DataMgr.getInstance().getItem( 'PlayerEnergy' );
        // console.warn('get PlayerEnergy:', val);
        return val != null ? val : GameSetting.PlayerEnergy;
    }
    static set PlayerEnergy ( value: number ){
        // console.warn('set PlayerEnergy:', value);
        if(!value || value <= 0){
            value = 0;
        }
        DataMgr.getInstance().setItem( 'PlayerEnergy', value );
    }
    /** 玩家选择的头像 */
    static get PlayerAvatar (){
        const val = DataMgr.getInstance().getItem( 'PlayerAvatar' );
        return val != null ? val : "avatarIcon1";
    }
    static set PlayerAvatar ( value: string ){
        DataMgr.getInstance().setItem( 'PlayerAvatar', value );
    }

    /** 今天是否获得分享的体力 */
    static get IsGetShareEnergy(){
        const val = DataMgr.getInstance().getItem( 'IsGetShareEnergy' );
        return val != null ? val : false;
    }
    static set IsGetShareEnergy ( value: boolean ){
        DataMgr.getInstance().setItem( 'IsGetShareEnergy', value );
    }

    /** 存储上一次回复体力的时间戳（毫秒） */
    static get LastRecoverTime(){
        const val = DataMgr.getInstance().getItem( 'LastRecoverTime' );
        return val != null ? val : 0;
    }

    static set LastRecoverTime ( value: number ){
        DataMgr.getInstance().setItem( 'LastRecoverTime', value );
    }

    /** 刷新体力：根据离线时间计算恢复量 */
    static refreshEnergy(): void {
        if (this.PlayerEnergy >= GameSetting.PlayerMaxEnergy) {
            this.LastRecoverTime = Date.now();
            return;
        }
        const now = Date.now();
        const lastTime = this.LastRecoverTime;
        if (lastTime <= 0) {
            this.LastRecoverTime = now;
            return;
        }
        const elapsed = now - lastTime;
        const intervalMs = GameSetting.EnergyRecoverSet.recoverTime * 1000;
        const recovered = Math.floor(elapsed / intervalMs) * GameSetting.EnergyRecoverSet.recoverAmount;
        if (recovered > 0) {
            this.PlayerEnergy = Math.min(GameSetting.PlayerMaxEnergy, this.PlayerEnergy + recovered);
        }
        this.LastRecoverTime = now;
    }

    /** 消耗体力，返回是否成功 */
    static costEnergy(cost: number): boolean {
        this.refreshEnergy();
        if (this.PlayerEnergy < cost) return false;
        this.PlayerEnergy -= cost;
        return true;
    }
    /** 玩家所有的贷款 */
    static get PlayerLoan(){
        const val = DataMgr.getInstance().getItem( 'PlayerLoan' );
        return val != null ? val : 0;
    }
    static set PlayerLoan ( value: number ){
        DataMgr.getInstance().setItem( 'PlayerLoan', value );
    }

    // #endregion
    /** 游戏内天数 */
    static get GameDay(){
        const val = DataMgr.getInstance().getItem( 'GameDay' );
        return val != null ? val : 1;
    }
    static set GameDay ( value: number ){
        DataMgr.getInstance().setItem( 'GameDay', value );
    }
    /** 玩家当天完成的订单数 */
    static get PlayerOrderNum(){
        const val = DataMgr.getInstance().getItem( 'PlayerOrderNum' );
        return val != null ? val : 0;
    }
    static set PlayerOrderNum ( value: number ){
        DataMgr.getInstance().setItem( 'PlayerOrderNum', value );
    }

    //#region 贷款(当天)数据

    /** 贷款记录所属的游戏天数（用于判断是否跨天） */
    static get LoanDay(){
        const val = DataMgr.getInstance().getItem( 'LoanDay' );
        return val != null ? val : 0;
    }
    static set LoanDay ( value: number ){
        DataMgr.getInstance().setItem( 'LoanDay', value );
    }

    /** 读取某档位的贷款缓存记录（存储键即档位键） */
    static getLoanRecord(loanKey: string): LoanRecordData{
        const val = DataMgr.getInstance().getItem( loanKey );
        return val != null ? val : { hasLoaned: false, adCount: 0, hasRepaid: false };
    }
    /** 写入某档位的贷款缓存记录 */
    static setLoanRecord(loanKey: string, value: LoanRecordData): void{
        DataMgr.getInstance().setItem( loanKey, value );
    }
    /** 清除某档位的贷款缓存记录 */
    static clearLoanRecord(loanKey: string): void{
        DataMgr.getInstance().removeItem( loanKey );
    }

    /** 获取对象存储数据 */
    static getObjectStorageData(objectKey: string): ObjectStorageData{
        const val = DataMgr.getInstance().getItem( objectKey );
        return val != null ? val : { count: 0, isUnlocked: false };
    }
    /** 设置对象存储数据 */
    static setObjectStorageData(objectKey: string, value: ObjectStorageData): void{
        DataMgr.getInstance().setItem( objectKey, value );
    }

    /** 应交房租 */
    static get PayRent() {
        const val = DataMgr.getInstance().getItem( 'PayRent' );
        return val != null ? val : 0;
    }
    static set PayRent ( value: number ){
        DataMgr.getInstance().setItem( 'PayRent', value );
    }
    //#endregion
    /** 是否进入交房租阶段 */
    static get IsDaySettlement(){
        const val = DataMgr.getInstance().getItem( 'IsDaySettlement' );
        return val != null ? val : false;
    }
    static set IsDaySettlement ( value: boolean ){
        DataMgr.getInstance().setItem( 'IsDaySettlement', value );
    }

    /** 今日收入 */
    static get TodayIncome(){
        const val = DataMgr.getInstance().getItem( 'TodayIncome' );
        return val != null ? val : 0;
    }
    static set TodayIncome ( value: number ){
        DataMgr.getInstance().setItem( 'TodayIncome', value );
    }

    /** 今日支出 */
    static get TodayExpend(){
        const val = DataMgr.getInstance().getItem( 'TodayExpend' );
        return val != null ? val : 0;
    }
    static set TodayExpend ( value: number ){
        DataMgr.getInstance().setItem( 'TodayExpend', value );
    }

    /** 今日贷款 */
    static get TodayLoan(){
        const val = DataMgr.getInstance().getItem( 'TodayLoan' );
        return val != null ? val : 0;
    }
    static set TodayLoan ( value: number ){
        DataMgr.getInstance().setItem( 'TodayLoan', value );
    }

    /** 是否进入处罚状态 */
    static get IsPenalty(): boolean {
        return DataMgr.getInstance().getItem('IsPenalty') === true;
    }
    static set IsPenalty(value: boolean): void {
        DataMgr.getInstance().setItem('IsPenalty', value);
    }

    /** 罚金金额 */
    static get PenaltyAmount(): number {
        return DataMgr.getInstance().getItem('PenaltyAmount') || 0;
    }
    static set PenaltyAmount(value: number): void {
        DataMgr.getInstance().setItem('PenaltyAmount', value);
    }
}