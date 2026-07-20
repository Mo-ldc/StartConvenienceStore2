/**
 * 全局唯一 ID 生成器
 * 
 * 为 DataStore 中的 ObjectModel 分配唯一标识
 * 每局游戏开始时调用 reset() 重置计数器
 * 确保同一局内所有角色/建筑 ID 不重复
 */
export class IDGenerator {
    /** 下一个可用 ID */
    private static _nextId: number = 1;

    /** 生成并返回下一个唯一 ID */
    static next(): number {
        return this._nextId++;
    }

    /** 重置计数器（新一局开始时调用） */
    static reset(): void {
        this._nextId = 1;
    }

    /** 获取当前计数器值（不消耗） */
    static current(): number {
        return this._nextId;
    }
}
