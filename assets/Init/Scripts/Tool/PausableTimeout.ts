/**自定义封装的计时器 方法 有暂停功能 */
export default class PausableTimeout {
    /**当前在执行中的计时器数量 */
    private static PausableTimeoutNum = 0;

    /**当前计时器的回调 */
    private m_call_back = null;
    /**当前计时器延迟 执行总时间 */
    private m_delay:number = 0;
    /**当前计时器的id */
    private m_timeout_id:number = -1;
    /**当前计时器的开始时间 */
    private m_start_time:number = 0;


    /**当前计时器在这个时间后结束计时 */
    private m_remaining:number = 0;
    /**当前计时器是否暂停 */
    private m_paused:boolean = false;

    /**此计时器是否已经被清除 包括结束的或者手动暂停的 */
    private m_is_clear:boolean = false;


    constructor(_callBack, _delay:number) {
        this.m_call_back = _callBack;
        this.m_delay = _delay;
        this.m_timeout_id = null;
        this.m_start_time = null;
        this.m_remaining = _delay;
        this.m_paused = false;
        this.m_is_clear = false;
        PausableTimeout.PausableTimeoutNum++;
        this._start();
    }

    /**执行计时器 */
    private _start() {
        this.m_start_time = Date.now();
        this.m_timeout_id = setTimeout(() => {
            this.m_call_back && this.m_call_back();
            this.ClearTimeout();
        }, this.m_remaining);
    }

    /**暂停这个计时器 */
    public Pause() {
        if (this.m_paused == false && this.m_is_clear == false) {
            this.m_paused = true;
            clearTimeout(this.m_timeout_id);
            this.m_remaining -= Date.now() - this.m_start_time;
        }
    }

    /**恢复这个计时器 */
    public ReSume() {
        if (this.m_paused && this.m_is_clear == false) {
            this.m_paused = false;
            this._start();
        }
    }

    /**清理这个计时器 */
    public ClearTimeout() {
        if(this.m_is_clear) return;
        this.m_call_back = null;
        clearTimeout(this.m_timeout_id);
        this.m_is_clear = true;
        PausableTimeout.PausableTimeoutNum--;
    }

    /**获得当前计时器的状态 是否被清除(或者完成) */
    public GetClear(){
        return this.m_is_clear;
    }

    /**获得当前在执行中的计时器数量 */
    public static GetAllNumber(){
        return this.PausableTimeoutNum;
    }

}
