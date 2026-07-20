import { _decorator, Component, instantiate, Node, NodePool, Pool, Prefab } from 'cc';

export class PoolMgr{
    
    private static _poolMap: Map<string, Array<Node>> = new Map();    
    /**
     * 创建或获取对象池
     * @param key 对象池标识（可以是预制体路径、名称等）
     * @param prefab 预制体（可选，首次创建时需要）
     * @param size 初始大小（可选）
     * @returns 对象池
     */
    public static getPool(
        key: string, 
        prefab?: Prefab, 
        size: number = 1
    ){
        if (!this._poolMap.has(key)) {
            if (!prefab) {
                console.error(`对象池 ${key} 不存在且未提供预制体！`);
                return null;
            }
            
            const pool:Node[] = [];
            for (let i = 0; i < size; i++) {
                const node = instantiate(prefab);
                pool.push(node);
            }
            
            this._poolMap.set(key, pool);
        }
        
        return this._poolMap.get(key);
    }
    
    /**
     * 从对象池获取对象
     * @param key 对象池标识
     * @returns 节点实例
     */
    public static get(
        key: string,
        prefab?: Prefab,
        maxNum: number = 3
    ) {
        const pool = this.getPool(key,prefab);
        if (!pool){
            console.error(`对象池 ${key} 不存在！`);
            return null;
        }
        
        let node = pool.pop();
        if(!node){
            // console.log("创建对象:",key)
            if (pool.length < maxNum) {
                node = instantiate(prefab);
                pool.push(node);
            }
            node = pool.pop();
        }
        
        return node;
    }
    
    /**
     * 归还对象到对象池
     * @param key 对象池标识
     * @param node 要归还的节点
     */
    public static put(key: string, node: Node): void {
        const pool = this.getPool(key);
        if (!pool) {
            console.warn(`对象池 ${key} 不存在，节点将被销毁`);
            node.destroy();
            return;
        }
        if (node.parent) {
            node.parent = null;
        }
        let index = pool.indexOf(node);
        if(index < 0){
            pool.push(node);
        }else{
            // console.warn("对象已存在，不要重复存入")
        }
        
    }
    
    /**
     * 预创建对象
     * @param key 对象池标识
     * @param count 预创建数量
     */
    public static preload(key: string, prefab:Prefab,count: number = 5): void {
        const pool = this.getPool(key);
        if (!pool) return;
        for (let i = 0; i < count; i++) {
            pool.push(instantiate(prefab));
        }
        
    }
    
    /**
     * 清空指定对象池
     * @param key 对象池标识
     */
    public static clearPool(key: string): void {
        const pool = this._poolMap.get(key);
        if (pool) {
            pool.forEach(node => node.destroy());
            pool.length = 0;
            this._poolMap.delete(key);
        }
    }
    
    /**
     * 清空所有对象池
     */
    public static clearAll(): void {
        this._poolMap.forEach((pool) => {
            pool.forEach(node => node.destroy());
            pool.length = 0;
        });
        this._poolMap.clear();
    }
    
}


