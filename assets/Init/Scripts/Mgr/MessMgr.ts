interface IEventData 
{
    func: Function;
    target: any;
}
interface IEvent 
{
    [ eventName: string ]: IEventData[];
}
export class MessMgr 
{
    public static handle: IEvent = {};
    private static _listenerCount: number = 0;

    /** 监听事件 */
    public static on <T extends any[]>( eventName: string,cb: (...args: T) => void, target: any,)
    {
        if ( !this.handle[ eventName ] )
        {
            this.handle[ eventName ] = [];
        }

        const data: IEventData = { func: cb, target };
        this.handle[ eventName ].push( data );
        this._listenerCount++;

        // ✅ 自动清理机制
        if (target && typeof target.onDestroy === 'function') {
            const originalOnDestroy = target.onDestroy;
            target.onDestroy = () => {
                this.off(eventName, cb, target);
                originalOnDestroy.call(target);
            };
        }
    }

    /** 移除监听事件 */
    public static off(eventName: string, cb: Function, target: any,) {
        const list = this.handle[eventName];
        if (!list) return;

        // ✅ 性能优化：倒序遍历避免splice索引问题
        for (let i = list.length - 1; i >= 0; i--) {
            const event = list[i];
            if (event.func === cb && (!target || target === event.target)) {
                list.splice(i, 1);
                this._listenerCount--;
                break;
            }
        }

        // 清理空数组
        if (list.length === 0) {
            delete this.handle[eventName];
        }
    }

    /** 广播事件 */
    public static emit <T extends any[]>( eventName: string, ...args: T )
    {
        const list = this.handle[ eventName ];
        if ( !list || list.length <= 0 )
        {
            return;
        }

        for ( let i = 0; i < list.length; i++ )
        {
            const event = list[ i ];
            event.func.apply( event.target, args );
        }
    }

    /** 统计信息 */
        // ✅ 新增：统计信息
    public static get listenerCount(): number {
        return this._listenerCount;
    }
    
    /** 事件数量 */
    public static get eventCount(): number {
        return Object.keys(this.handle).length;
    }
}