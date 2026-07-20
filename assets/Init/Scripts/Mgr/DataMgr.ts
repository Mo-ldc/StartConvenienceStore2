import { _decorator } from 'cc';
export class DataMgr {
    private static instance: DataMgr;
    public static getInstance() {
        if (!this.instance) {
            this.instance = new DataMgr();
        }
        return this.instance;
    }
    public static DeleteAll() {
        localStorage.clear();
    }
    dataName: string = "WordWarData";
    data: any;
  

    /**
     * 获取用户某个键对应的持久化数据
     * @param key 
     */
    getItem(key: string) {
        let reson = this.getAll();

        if (reson && reson[key] != undefined){
            // console.log("getItem:", key, reson[key]);
            return reson[key];
        }else{
            // console.warn("getItem:", key, "not found reson:", reson, " reson[", reson[key], "]");
            return null;
        }
            
    }

    /**
     * 设置用户的持久化数据
     * @param key 
     * @param value 
     */
    setItem(key: string, value: any) {
        if (!this.data)
            this.data = {};
        this.data[key] = value;
        localStorage.setItem(this.dataName, JSON.stringify(this.data));
    }

    /**
     * 获取本地存储的所有的持久化数据
     */
    getAll() {
        if (!this.data) {
            let reson = localStorage.getItem(this.dataName);
            if (reson)
                this.data = JSON.parse(reson);
            else
                this.data = {};
        }
        return this.data;
    }

    /**
     * 移除键对应的持久化数据
     * @param key 
     */
    removeItem(key: string) {
        let reson = this.getAll();
        if (reson) {
            delete reson[key];
            localStorage.setItem(this.dataName, JSON.stringify(reson));
        }
    }

    /**
     * 移除这个用户所有的本地持久化数据
     * @param key 
     */
    removeAll() {
        localStorage.removeItem(this.dataName);
    }
    //#endregion

    /** 保存数据 */
    private _save() {
        localStorage.setItem(this.dataName, JSON.stringify(this));
    }
    /** 保存数据 */
    public Save() {
        this._save();
    }

}