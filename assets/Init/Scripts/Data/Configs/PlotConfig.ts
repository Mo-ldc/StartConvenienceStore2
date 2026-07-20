import { PartType } from "../Type/ObjType";

export class PlotConfig {

    //#region 客人请求对话（按零件类型分类）
    public static requestDialogue: Record<string, string[]> = {
        [PartType.后盖]: [
            "我手机盖摔坏了，看看能修不",
            "手机没拿稳掉地上了，后盖裂了",
            "后盖碎了，换个新的多少钱",
            "这后盖能换吗",
        ],
        [PartType.屏幕]: [
            "屏幕碎了，能修吗",
            "手机屏幕突然不亮了",
            "屏幕有条线，看着难受",
            "手滑掉地上，屏幕花了",
        ],
        [PartType.电池]: [
            "电池不耐用了，半天就没电",
            "手机充不进电了",
            "电池鼓包了，有点吓人",
            "帮我看看是不是电池坏了",
        ],
        [PartType.镜头]: [
            "摄像头拍出来模糊了",
            "镜头进灰了，能清理吗",
            "拍照有条纹，帮我看看",
            "摄像头玻璃碎了",
        ],
        [PartType.主板]: [
            "手机开不了机了",
            "老是自动重启，烦死了",
            "主板烧了，还能修不",
            "手机进水了，估计要修主板",
        ],
        [PartType.屏幕膜]: [
            "膜刮花了，帮我换一张",
            "贴个膜，多少",
            "膜起泡了，换个新的",
            "帮我换个钢化膜",
        ],
        [PartType.SIM卡]: [
            "SIM卡读不出来了",
            "插卡没反应，帮我看看",
            "卡槽坏了，能换吗",
        ],
    };
    //#endregion

    //#region 阶段对话（与零件类型无关）
    /** 接下订单客人对话 */
    public static acceptOrder: string[] = [
        "那好嘞，就按你意思来，麻烦快点",
        "行，就按你的意思来，麻烦快点",
        "可以，就按你的意思来",
        "好的，麻烦快点",
        "行，我等着，快点啊",
    ];

    /** 拒绝订单客人对话 */
    public static rejectOrder: string[] = [
        "那我去找别人",
        "行，我去找别人",
        "这样啊，我去找别人",
        "我去别家问问",
        "算了，我换一家看看",
    ];

    /** 完成订单客人对话 */
    public static completeOrder: string[] = [
        "谢谢你",
        "你真厉害",
        "我下次还找你",
        "修得跟新的一样，太棒了",
        "手艺不错，下次还来",
    ];
    //#endregion

    /** 砍价客人对话 */
    public static bargain: string[] = [
        "这个价格可以吗",
        "这个价格行吗",
        "这个价格可以吧",
        "这个价格可以吧",
        "这个价格可以吧",
    ];

    //#region 工具方法

    /** 从数组中随机取一句 */
    public static getRandom(arr: string[]): string {
        if (!arr || arr.length === 0) return "";
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /** 根据零件类型获取客人的请求对话 */
    public static getRequestDialogue(partType: PartType): string {
        const arr = this.requestDialogue[partType];
        return arr ? this.getRandom(arr) : "老板，帮我看看这个手机";
    }

    /** 获取指定阶段的随机对话 */
    public static getPhaseDialogue(phase: "accept" | "reject" | "complete" | "bargain"): string {
        switch (phase) {
            case "accept": return this.getRandom(this.acceptOrder);
            case "reject": return this.getRandom(this.rejectOrder);
            case "complete": return this.getRandom(this.completeOrder);
            case "bargain": return this.getRandom(this.bargain);
            
        }
    }
    //#endregion
}
