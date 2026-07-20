import { Agent } from "./Agent";
import { cBody } from "./Body";
import { Dirty, Trigger, cObject } from "./Object";
import { ShapeSupport } from "./Shape";



export class cCollider {

    private id: number = 0;           // Body对象的唯一标识ID
    private pools: Array<cBody> = []; // 对象池，用于回收和复用cBody对象

    private static _inst: cCollider = null;
    static get inst() {
        if (this._inst == null) {
            this._inst = new cCollider();
        }
        return this._inst;
    }

    private axis: number = -1;              // 当前轴向索引，用于空间分割
    private frameID: number = 0;            // 当前帧ID，用于触发器状态更新
    private insertID: number = 0;           // 插入ID，用于标识插入顺序
    private bodys: Array<cBody> = [];      // 存储当前活跃的碰撞体
    private isDirty: boolean = false;      // 标记是否有需要重建的数据
    private pairs: Map<number, any> = new Map(); // 存储碰撞对的信息

    /**
     * 创建一个新的Body对象
     * @param obj 关联的cObject对象
     */
    create(obj: cObject) {

        let body = this.pools.pop();  // 尝试从对象池获取一个body
        if (!body) {
            body = new cBody(obj);
            body.id = this.id++;
            return body;
        }

        body.object = obj;
        return body;
    }


    //插入 body, force 强制更新数据
    insert(body: cBody, force: boolean = false) {

        if (!body) return;

        if (!body.inCollider) {
            //不在列表,重新插入
            this.bodys.push(body);
            body.inCollider = true;
        }

        //复位状态
       
        body.isRemove = false;
        body.isRetrieve = false;
        body.fid = this.insertID++;

        //强制刷新body数据
        if (force && body.object) {
            body.object.isDirty = Dirty.RTS;
            // body.updateBound(Dirty.RTS);
        }
    }

    //删除 body: 提前标记删除 , update中执行移除
    remove(body: cBody, retrieve: boolean = false) {

        if (!body) return;
        body.isRemove = true; //标记移除body
        body.isRetrieve = retrieve; //是否回收复用body?
    }

    //重置回收bodys
    reset() { 
        this.axis = -1;
        this.frameID = 0;
        this.isDirty = true;

        //回收bodys
        let bodys = this.bodys;
        for (let i = bodys.length - 1; i >= 0; i--) {
            let body = bodys[i];
            this.pools.push(body);
            body.clear();
        }
        bodys.length = 0;

    }

    //退出释放bodys
    clear() { 
        this.id = 0;
        this.axis = -1;
        this.frameID = 0;
        this.isDirty = true;
        this.pools.length = 0;

        //清空bodys
        let bodys = this.bodys;
        for (let i = bodys.length - 1; i >= 0; i--) {
            bodys[i].clear();
        }
        bodys.length = 0;
    }


    /**
     * 更新碰撞检测系统
     * @param dt 时间步长
     */
    update(dt: number) {
        this.reBuild();          // 重建空间分区
        this.triggers();         // 处理碰撞触发
        Agent.inst.process(this.bodys);  // 处理AI代理
    }

    /**
     * 相交碰撞测试
     * 遍历所有物体对并检测它们之间的碰撞
     * 检测代理对象间的交互以及按掩码和组规则进行碰撞检测
     */
    private triggers(): void { //resultCB: (a: Body, b: Body) => void

        ++this.frameID;
       
        // 获取轴向信息用于碰撞检测
        let axis = this.axis,
            n = (axis >> 2) & 0x3,      // 第一个轴索引 (x or y)
            m = (axis >> 4) & 0x3;      // 第二个轴索引 (y or x)

        let bodys = this.bodys;
        let agentMgr = Agent.inst;      // 获取代理管理器实例
        let i = 0, j = 0, N = bodys.length;
        
        // 遍历所有物体对
        for (i = 0; i < N; i++) {

            let bi = bodys[i];

            if (bi.isRemove) continue;  // 跳过已被标记删除的物体
            if (!bi.isActive) continue;  // 跳过不激活的物体
            
            // 提取当前物体的边界框和其他属性
            let A = bi.aabb,
                an = A[n],              // 当前物体在n轴上的最小值
                am = A[m],              // 当前物体在m轴上的最小值
                mask = bi.mask,         // 当前物体的碰撞掩码
                group = bi.group,       // 当前物体的碰撞组
                upper = bi.upper,       // 当前物体的上界
                objA = bi.object;       // 当前物体的对象引用

            for (j = i + 1; j < N; j++) {

                let bj = bodys[j];
                if (bj.isRemove) continue;  // 跳过已被标记删除的物体

                // 如果当前物体的上界小于等于另一个物体的下界，则跳出循环
                // 因为数组已排序，后续物体也不会与当前物体相交
                if (upper <= bj.lower) {
                    break;
                }

                let B = bj.aabb, objB = bj.object;
                
                // 检查两个物体之间是否有碰撞关系（通过掩码和组）
                let a2b = mask & bj.group, b2a = bj.mask & group;

                // AABB碰撞检测：检查两个边界框是否相交
                if (!(an > B[n + 3] || B[n] > A[n + 3] || am > B[m + 3] || B[m] > A[m + 3])) {
                    
                    // 检测两个代理对象之间的交互
                    if(bi.isAgent && bj.isAgent){
                        agentMgr.check(bi,bj);
                        agentMgr.check(bj,bi);
                    }

                    // 如果两个物体有碰撞关系（通过掩码和组）
                    if((a2b || b2a)){
                        let at = objA.shape.type;    // 物体A的形状类型
                        let bt = objB.shape.type;    // 物体B的形状类型
                        
                        // 根据形状类型确定调用顺序
                        if (at > bt) {
                            if (!ShapeSupport[bt | at](bj, bi))
                                continue; 
                        } else {
                            if (!ShapeSupport[at | bt](bi, bj))
                                continue; 
                        }

                        // 触发碰撞事件，根据ID大小决定参数顺序
                        if(bi.id < bj.id)
                            this.onTrigger(bj,bi,(b2a?1:0)|(a2b?2:0));
                        else
                            this.onTrigger(bi,bj,(a2b?1:0)|(b2a?2:0));
                    }
                }
            }
        }
        
        // 结束触发处理
        this.endTrigger();
    }

    /**
     * 处理两个碰撞体之间的触发事件
     * @param bi 碰撞体1
     * @param bj 碰撞体2
     * @param state 碰撞状态，用于标识哪些对象应该接收触发事件
     */
    private onTrigger(bi:cBody,bj:cBody,state:number){
        
        // 初始化触发状态为stay（持续接触）
        let trigger = 0;
        // 计算唯一ID用于标识这对碰撞体，使用组合数学中的三角数公式确保(i,j)和(j,i)得到相同ID
        let id = (bi.id * (bi.id + 1) >> 1) + bj.id - 1;

        let pairs = this.pairs;
        let data = pairs.get(id);
        if (data !== undefined) {
            // 如果之前已经记录了这对碰撞体，触发状态设为stay
            trigger = Trigger.stay;
            // 检查是否是新的接触帧（基于frame id判断）
            if(data.fida != bi.fid || data.fidb != bj.fid){
                // 如果任一碰撞体的frame id发生了变化，说明是新进入的接触
                trigger = Trigger.enter;
                data.fida = bi.fid;  // 更新frame id
                data.fidb = bj.fid;
            }
            // 更新帧ID和状态
            data.frameID = this.frameID;
            data.state = state;
        } else {
            // 如果是首次记录这对碰撞体，触发状态设为enter
            trigger = Trigger.enter;
            // 创建新的碰撞对记录
            pairs.set(id, { id: id, a: bi, b: bj, fida:bi.fid , fidb:bj.fid, frameID: this.frameID, state:state });
        }

        // 根据状态位检查是否需要向碰撞体A发送触发事件
        let objA = bi.object;
        if ((state&1) && objA && objA.trigger && !bi.isRemove) {
            objA.onTrigger(bj, trigger);
        }

        // 根据状态位检查是否需要向碰撞体B发送触发事件
        let objB = bj.object;
        if ((state&2) && objB && objB.trigger && !bj.isRemove) {
            objB.onTrigger(bi, trigger);
        }
    }

    /**
     * 结束触发事件，清理不再存在的碰撞对
     */
    private endTrigger(){

        let deletes = [];
        let pairs = this.pairs;
     
        let length = pairs.size;
        let frameID = this.frameID;
        let entries = pairs.values();
        for (let i = 0; i < length; i++) {
            let data = entries.next().value;
            let bi = data.a;
            let bj = data.b;

            if (data.frameID != frameID || bi.isRemove || bj.isRemove) {

                if(data.fida == bi.fid && data.fidb == bj.fid){
                    let objA = bi.object;
                    if (objA && objA.trigger && !bi.isRemove)
                        objA.onTrigger(bj, Trigger.exit);
                    
                    let objB = bj.object;
                    if (objB && objB.trigger && !bj.isRemove)
                        objB.onTrigger(bi, Trigger.exit);
                }

                deletes.push(data.id);
            }
        }

        length = deletes.length - 1;
        while(length >= 0){
            pairs.delete(deletes[length--]);
        }
        deletes.length = 0;
    }

    /**
     * 重建碰撞检测系统空间划分
     */
    private reBuild(): void {

        let change = false;
        let axis = this.preBuildAxis();
        if ((axis & 0x3) != (this.axis & 0x3) || this.axis < 0) {
            this.axis = axis;
            change = true;
        }

        if (change || this.isDirty) {

            this.isDirty = false;

            let bodys = this.bodys;
            axis = this.axis & 0x3;
            for (let i = 0, N = bodys.length; i !== N; i++) {
                let bi = bodys[i];
                let aabb = bi.aabb;
                bi.lower = aabb[axis];
                bi.upper = aabb[axis + 3];
            }

            if (!change)
                this.sort(bodys);
            else
                bodys.sort((a: cBody, b: cBody) => a.lower - b.lower);

        }
    }


    /**
     * 对碰撞体数组按lower值排序
     * @param a 碰撞体数组
     */
    private sort(a: Array<cBody>): void {

        let i = 0, j = 0, l = 0;
        for (i = 1, l = a.length; i < l; i++) {
            let v = a[i];
            let lower = v.lower;
            for (j = i - 1; j >= 0; j--) {
                let w = a[j];
                if (w.lower <= lower) {
                    break;
                }
                a[j + 1] = w;
            }

            if (j + 1 != i) {
                a[j + 1] = v;
            }
        }
    }


    /**
     * 预计算构建轴向
     * 使用质心分布来确定最佳的轴向用于空间划分
     */
    private preBuildAxis(): number {

        let axis = 0,
            sumX = 0, sumX2 = 0,
            sumY = 0, sumY2 = 0,
            sumZ = 0, sumZ2 = 0,
            x = 0.0, y = 0.0, z = 0.0;

        let bodys = this.bodys;
        let N = bodys.length;

        let length = 0;
        let isDirty = false;
        for (let i = 0; i < N; i++) {

            let body = bodys[i];

            //删除body
            if (body.isRemove) {
                //是否回收body
                if (body.isRetrieve) {
                    this.pools.push(body);
                    body.clear();
                }
                //已从collider移除
                body.inCollider = false;
                continue;
            }

            if ((++length) <= i) {
                bodys[length - 1] = body;
            }
            if (body.updateBound()) isDirty = true;

            let s = body.aabb,
                sx = (s[3] - s[0]),
                sy = (s[4] - s[1]),
                sz = (s[5] - s[2]);
            x += sx * sx, y += sy * sy; z += sz * sz;

            let cX = (s[3] + s[0]) * 0.5;
            sumX += cX, sumX2 += cX * cX;

            let cY = (s[4] + s[1]) * 0.5;
            sumY += cY, sumY2 += cY * cY;

            let cZ = (s[5] + s[2]) * 0.5;
            sumZ += cZ, sumZ2 += cZ * cZ;
        }

        this.bodys.length = length;
        this.isDirty = isDirty;

        let invN = 1.0 / length;
        x = x > 0 ? length / x : 0;
        y = y > 0 ? length / y : 0;
        z = z > 0 ? length / z : 0;

        let X = (sumX2 - sumX * sumX * invN) * x;
        let Y = (sumY2 - sumY * sumY * invN) * y;
        let Z = (sumZ2 - sumZ * sumZ * invN) * z;

        if (X == 0) X = x; if (Y == 0) Y = y; if (Z == 0) Z = z;

        if (X > Y) {
            if (X > Z) {
                axis = 0;
                axis |= (Y > Z ? (1 << 2) | (2 << 4) : (1 << 4) | (2 << 2));//yz:zy;
            } else {
                axis = 2;
                axis |= (X > Y ? (0 << 2) | (1 << 4) : (0 << 4) | (1 << 2));//xy:yx;
            }
        } else if (Y > Z) {
            axis = 1;
            axis |= (X > Z ? (0 << 2) | (2 << 4) : (0 << 4) | (2 << 2));//xz:zx;
        } else {
            axis = 2;
            axis |= (X > Y ? (0 << 2) | (1 << 4) : (0 << 4) | (1 << 2));//xy:yx;
        }


        return axis;
    }

}