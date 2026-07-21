
import { TalkConfigData } from "../Data/ConfigData";
import { Gender } from "../Enum/Enum";
import { PartType } from "../Type/ObjType";

export class PlotConfig {

    //#region 客人请求对话（按零件类型分类）
    public static requestDialogue: Record<string, TalkConfigData[]> = {
        [PartType.后盖]: [
            { talkKey: "tb_hg_1", talkContent: "师傅，我这手机壳已经裂开了，保护手机全靠一口气撑着", sex: Gender.男 },
            { talkKey: "tb_hg_2", talkContent: "手机还没散架，壳先散了，业务能力有待提高", sex: Gender.男 },
            { talkKey: "tb_hg_3", talkContent: "这个壳摸起来割手，保护手机的同时顺便攻击主人", sex: Gender.男 },

            { talkKey: "tg_hg_1", talkContent: "这壳松得像借来的，拿着手机还得防着它偷偷掉下来", sex: Gender.女 },
            { talkKey: "tg_hg_2", talkContent: "师傅，给它换套新衣服吧，这套已经穿到开线了", sex: Gender.女 },
        ],
        [PartType.屏幕]: [
            { talkKey: "tb_pm_1", talkContent: "手机还能用，就是看什么都自带马赛克特效", sex: Gender.男 },
            { talkKey: "tb_pm_2", talkContent: "师傅救救它，我现在回消息全靠盲打和缘分", sex: Gender.男 },
            { talkKey: "tb_pm_3", talkContent: "麻烦换个屏，我现在看视频像隔着防盗网", sex: Gender.男 },

            { talkKey: "tg_pm_1", talkContent: "师傅，我的屏幕绿得发慌，不知道的还以为手机中毒了", sex: Gender.女 },
            { talkKey: "tg_pm_2", talkContent: "麻烦修一下，我现在解锁手机跟破解密码一样难", sex: Gender.女 },
    
        ],
        [PartType.电池]: [
            { talkKey: "tb_dc_1", talkContent: "师傅，我这手机电池已经进入养老模式了，充两小时，精神五分钟", sex: Gender.男 },
            { talkKey: "tb_dc_2", talkContent: "这手机一离开充电器就没有安全感，麻烦给它治治", sex: Gender.男 },
            { talkKey: "tb_dc_3", talkContent: "帮我看看电池吧，它现在一天要充八次，比我喝水还勤快", sex: Gender.男 },

            { talkKey: "tg_dc_1", talkContent: "师傅救救它吧，现在电量掉得比我工资还快", sex: Gender.女 },
            { talkKey: "tg_dc_2", talkContent: "麻烦修一下，它现在充电像吃饭，掉电像拉肚子", sex: Gender.女 },
        ],
        [PartType.镜头]: [
            { talkKey: "tb_gt_1", talkContent: "师傅，我这镜头拍什么都像加了十层雾，仙气是有了，脸没了", sex: Gender.男 },
            { talkKey: "tb_gt_2", talkContent: "前置镜头坏了，现在自拍只能靠想象", sex: Gender.男 },
            { talkKey: "tb_gt_3", talkContent: "师傅帮它治治吧，现在扫码都要和二维码培养感情", sex: Gender.男 },

            { talkKey: "tg_gt_1", talkContent: "后置镜头一打开就抖，比我上台讲话还紧张", sex: Gender.女 },
            { talkKey: "tg_gt_2", talkContent: "镜头对不上焦，拍张照片比谈恋爱还难确定关系", sex: Gender.女 },
        ],
        [PartType.主板]: [
            { talkKey: "tb_zb_1", talkContent: "主板好像烧糊涂了，一会儿重启，一会儿关机，情绪很不稳定", sex: Gender.男 },
            { talkKey: "tb_zb_2", talkContent: "手机突然变砖了，麻烦看看能不能把它从建材区救回来", sex: Gender.男 },
            { talkKey: "tb_zb_3", talkContent: "师傅，我这手机主板好像开摆了，屏幕还亮着，脑子已经下班了", sex: Gender.男 },

            { talkKey: "tg_zb_1", talkContent: "师傅看看吧，它开机三分钟，重启两小时，循环播放", sex: Gender.女 },
            { talkKey: "tg_zb_2", talkContent: "师傅，帮我把它的脑子修好，不然只能拿去垫桌脚了", sex: Gender.女 }
        ],
        [PartType.屏幕膜]: [
            { talkKey: "tb_sj_1", talkContent: "麻烦换张膜，我看消息都得先绕开三条裂缝", sex: Gender.男 },
            { talkKey: "tb_sj_2", talkContent: "膜里面全是气泡，按一下跑一个，已经可以当解压玩具了", sex: Gender.男 },
            { talkKey: "tb_sj_3", talkContent: "这膜摸起来跟搓衣板似的，再不换我指纹都要磨没了", sex: Gender.男},

            { talkKey: "tg_sj_1", talkContent: "膜碎成这样还能坚持不掉，多少有点敬业过头了", sex: Gender.女},
            { talkKey: "tg_sj_2", talkContent: "师傅，给它换张新的吧", sex: Gender.女},
        ],
        [PartType.SIM卡]: [
            { talkKey: "tb_sim_1", talkContent: "麻烦看看，它现在既没信号，也没态度，主打一个沉默", sex: Gender.男 },
            { talkKey: "tb_sim_2", talkContent: "麻烦修一下，我现在出门只能到处蹭Wi-Fi，活得像个网络流浪汉", sex: Gender.男 },
            { talkKey: "tb_sim_3", talkContent: "手机有电、屏幕也亮，就是卡不干活，团队里出现了内鬼", sex: Gender.男 },

            { talkKey: "tg_sim_1", talkContent: "它现在搜信号像我找对象，找半天一个都没有", sex: Gender.女 },
            { talkKey: "tg_sim_2", talkContent: "师傅，我这手机卡好像失联了，插在手机里跟没来过一样", sex: Gender.女 },
        ],
    };
    //#endregion

    //#region 阶段对话（与零件类型无关）
    /** 接下订单客人对话 */
    public static acceptOrder: TalkConfigData[] = [
        { talkKey: "accept_100", talkContent: "那好嘞，就按你意思来，麻烦快点" },
        { talkKey: "accept_101", talkContent: "行，就按你的意思来，麻烦快点" },
        { talkKey: "accept_102", talkContent: "可以，就按你的意思来" },
        { talkKey: "accept_103", talkContent: "好的，麻烦快点" },
        { talkKey: "accept_104", talkContent: "行，我等着，快点啊" },
    ];

    /** 拒绝订单客人对话 */
    public static rejectOrder: TalkConfigData[] = [
        { talkKey: "reject_100", talkContent: "那我去找别人" },
        { talkKey: "reject_101", talkContent: "行，我去找别人" },
        { talkKey: "reject_102", talkContent: "这样啊，我去找别人" },
        { talkKey: "reject_103", talkContent: "我去别家问问" },
        { talkKey: "reject_104", talkContent: "算了，我换一家看看" },
    ];

    /** 完成订单客人对话 */
    public static completeOrder: TalkConfigData[] = [
        { talkKey: "complete_100", talkContent: "谢谢你" },
        { talkKey: "complete_101", talkContent: "你真厉害" },
        { talkKey: "complete_102", talkContent: "我下次还找你" },
        { talkKey: "complete_103", talkContent: "修得跟新的一样，太棒了" },
        { talkKey: "complete_104", talkContent: "手艺不错，下次还来" },
    ];
    //#endregion

    /** 砍价客人对话 */
    public static bargain: TalkConfigData[] = [
        { talkKey: "bargain_100", talkContent: '{price}，能修就修' },
        { talkKey: "bargain_101", talkContent: '{price}，能修就修' },
    ];


    //#region 工具方法

    /** 从数组中随机取一句 */
    public static getRandom(arr:TalkConfigData[]): TalkConfigData {
        if (!arr || arr.length === 0) return null;
        let randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    /** 根据零件类型获取客人的请求对话 */
    public static getRequestDialogue(partType: PartType, sex: Gender): TalkConfigData {
        let arr = this.requestDialogue[partType];
        arr = arr.filter(item => item.sex === sex);
        let randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];    
    }

    /** 获取指定阶段的随机对话 */
    public static getPhaseDialogue(phase: "accept" | "reject" | "complete" | "bargain"): TalkConfigData {
        switch (phase) {
            case "accept": return this.getRandom(this.acceptOrder);
            case "reject": return this.getRandom(this.rejectOrder);
            case "complete": return this.getRandom(this.completeOrder);
            case "bargain": return this.getRandom(this.bargain);
            
        }
    }
    //#endregion
}
