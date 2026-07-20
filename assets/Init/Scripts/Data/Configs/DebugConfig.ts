export class DebugConfig {

    //#region 测试部分
    /**是否开始检查关卡图的完整性 */
    public static readonly Is_Check_Level_Img = false;
    /**是否显示加载信息 */
    public static readonly Is_Show_Load_Info = true;
    /**是否开始音效播放信息 */
    public static readonly Is_Show_Audio_Info = false;
    /**是否显示玩家数据检查 */
    public static readonly Is_Show_Player_Data = true;
    /**是否显示UI的打印 */
    public static readonly Is_Show_UI_Info = true;
    /**是否打印关卡信息 */
    public static readonly Is_Show_Game_Info = true;
    /**是否打印加载关卡音效消息 */
    public static readonly Is_Show_Level_Audio_Info = true;
    /**是否开启颜色打印 */
    public static readonly Is_Show_Color_Debug = true;
    /**是否打印节点适配屏幕信息 */
    public static readonly Is_Show_Node_Adapt_Info = false;
    /**是否是无广告版本 是的话直接发放奖励 */
    public static readonly Is_No_Ad = true;

    /**是否开启关卡路径 */
    public static readonly Is_Open_Level_Path = false;

    /**是否显示关卡ID */
    public static readonly Is_Show_Level_ID = false;

    /**是否打印上报信息 */
    public static readonly Is_Show_Report_Info = true;
    //#endregion

    /**颜色打印 在浏览器有效 在cocos引擎无效 */
    public static ColoredLog( color: string = "#000000ff", backgroundColor: string = "#4242426c",...message:any[]) {
        if (this.Is_Show_Color_Debug) { // 假设你有一个全局的日志开关
            // console.log(`%c${message}`, `color: ${color};`,);
            // console.log(`%c${message}`, `color: ${color};`);
            // console.log(`%c${message}`, `color: ${color}; background: ${backgroundColor};`);    
            const fullLine = message + ' '.repeat(Math.max(0, 80 - message.length));
            console.log(`%c${fullLine}`, `background: ${backgroundColor}; color: ${color};`);
            // console.log(`%c%o`, `color: ${color}; background: ${backgroundColor};`, message);
            // const jsonString = JSON.stringify(message);
            // console.log(`%c${jsonString}`, `color: ${color}; background: ${backgroundColor};`);
        }
    }
    public static Error(...message: any[]) {
        this.ColoredLog("#ff0000ff", "#42424283", message);
    }
    public static Warning(...message: any[]) {
        this.ColoredLog("#ffff00ff", "#42424283", message);
    }
    public static Info(...message: any[]) {
        this.ColoredLog("#ffffffff", "#42424283",message);
    }
    
}


