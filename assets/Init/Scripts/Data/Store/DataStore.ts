/**
 * 全局数据仓库（单例）
 */
export class DataStore {
    private static _instance: DataStore = null;

    static getInstance(): DataStore {
        if (!this._instance) this._instance = new DataStore();
        return this._instance;
    }


    /** 重置所有数据（新一局开始前调用） */
    reset(): void {

    }
}
