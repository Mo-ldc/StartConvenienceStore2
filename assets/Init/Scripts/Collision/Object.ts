import { CCInteger, Color, Component, Node, PhysicsSystem2D, Quat, UITransform, Vec2, Vec3, _decorator, ccenum } from 'cc';
import { cBody } from './Body';
import { cCollider } from './Collider';
import { ShapeType, cBox, cPolygon, cShape, cSphere } from './Shape';
import GameSetting from '../Data/Setting/GameSetting';
const { ccclass, property } = _decorator;

/**
 * 触发状态枚举
 * 用于表示碰撞体之间的触发事件状态
 */
export enum Trigger {
    /** 默认状态 */
    default = 0,
    /** 进入触发状态 */
    enter = 1,
    /** 持续触发状态 */
    stay = 2,
    /** 退出触发状态 */
    exit = 3,
};

/**
 * 脏标记枚举
 * 用于标识对象的变换矩阵中哪些部分需要更新
 */
export enum Dirty {
    /** 旋转分量需要更新 */
    R = 1,
    /** 平移分量需要更新 */
    T = 2,
    /** 缩放分量需要更新 */
    S = 4,
    /** 旋转、平移、缩放都需要更新 */
    RTS = 7,
    /** 旋转和缩放需要更新 */
    RS = R | S,
    /** 无脏标记，不需要更新 */
    NON = 0,
};
/** 编辑器数据  */
const editorData = GameSetting.刚体数据组;
ccenum(ShapeType)
@ccclass('cObject')
export class cObject extends Component {

    @property({ group:{name:"Body",id:editorData.groupID,displayOrder: editorData.groupLayer} })
    trigger: boolean = false; //碰撞开关

    @property({ type: PhysicsSystem2D.PhysicsGroup, group: {name:"Body",id:editorData.groupID,displayOrder: editorData.groupLayer} })
    group = PhysicsSystem2D.PhysicsGroup.DEFAULT; //碰撞分组

    @property({ type: ShapeType, group:{name:"Shape",id:editorData.groupID,displayOrder: editorData.groupLayer} })
    type: ShapeType = ShapeType.Box; //相交形状类型

    @property({group:{name:"Shape",id:editorData.groupID,displayOrder: editorData.groupLayer}})
    center: Vec3 = new Vec3();  //偏移位置，是shape相对node节点的中心偏移

    @property({ group: {name:"Shape",id:editorData.groupID,displayOrder: editorData.groupLayer}, visible() { return this.type == ShapeType.Box; } })
    size: Vec3 = new Vec3(); //方块的长宽高

    @property({ group: {name:"Shape",id:editorData.groupID,displayOrder: editorData.groupLayer}, visible() { return this.type == ShapeType.Sphere; } })
    radius: number = 0; //半径，sphere 或者 capsule

    @property({ type:[Vec2] , 
        group: {name:"Shape",id:editorData.groupID,displayOrder: editorData.groupLayer}, visible() { return this.type == ShapeType.Polygon; } })
    points: Array<Vec2> = [];


    @property({ group:{name:"Agent",id:editorData.groupID,displayOrder: editorData.groupLayer}})
    agent: boolean = false; //Agent开关

    
    @property({tooltip:"权值越小，穿透力越强", min:0.01 , max:1.0, step:0.01, 
        group: {name:"Agent",id:editorData.groupID,displayOrder: editorData.groupLayer}, visible() { return this.agent; } })
    weight: number = 0.5; //Agent 权值越小，穿透力越强

    @property({tooltip:"碰撞半径,小于等于物体体积", 
        group:{name:"Agent",id:editorData.groupID,displayOrder: editorData.groupLayer}, visible() { return this.agent; } })
    maxRadius: number = 0; //Agent碰撞半径,小于等于物体体积

    @property({tooltip:"最大速度上限", 
        group:{name:"Agent",id:editorData.groupID,displayOrder: editorData.groupLayer}, visible() { return this.agent; } })
    maxVelocity: number = 0; //Agent 最大速度上限
    
    /** 最大期望速度 */
    tryVelocity:Vec3 = new Vec3();
    /** 当前实际速度*/
    velocity: Vec3 = new Vec3();
    isDirty: Dirty = Dirty.RTS;
    shape: cShape = null;
    body: cBody = null;
        

    onLoad() {
        if(this.body == null){
            this.createCollider();
        }
    }
    /** 创建碰撞体 */
    createCollider() {
        // console.warn("创建碰撞体：", this.node.name)
        //创建碰撞形状
        switch (this.type) {
            case ShapeType.Box:
                this.shape = new cBox(this.center, this.size);
                break;
            case ShapeType.Sphere:
                this.shape = new cSphere(this.center, this.radius);
                break;
            case ShapeType.Polygon:
                this.shape = new cPolygon(this.center, this.points);
                break;
        }


        //创建碰撞body容器
        this.body = cCollider.inst.create(this);
        this.body.shape = this.shape; //绑定碰撞形状
        this.body.group = this.group; //碰撞分组掩码
        this.body.isAgent = this.agent; // agent 检测开关
        this.body.weight = this.weight; // agent 避让优先级
        this.body.neighborDist = this.maxRadius; // agent 体积半径
        this.body.maxVelocity = this.maxVelocity; // agent 最大速度
        this.body.mask = PhysicsSystem2D.instance.collisionMatrix[this.group];

        //把body加入碰撞管理
        cCollider.inst.insert(this.body);

        this.isDirty = Dirty.RTS;   //首次更新标记
    }
    /**
     * 设置碰撞体是否激活
     * @param active 是否激活
     */
    setBodyActive(active: boolean) {
        if(this.body) this.body.isActive = active;
    }

    //同步位置到body
    setPosition(position: Vec3) {
        this.node.position = position;
        this.isDirty |= Dirty.T;
    }

    //同步旋转到body
    setRotation(rotation: Quat) {
        this.node.rotation = rotation;
        this.isDirty |= Dirty.R;
    }

    //同步缩放到body
    setScale(scale: Vec3) {
        this.node.scale = scale;
        this.isDirty |= Dirty.S;
    }

    //设置瞄点，2D专用
    setAnchor(anchor: Vec2) {

        let c0 = this.center;
        let c1 = this.shape.center;
        let uts = this.node.getComponent(UITransform);
        if(uts){
            uts.anchorPoint = anchor;

            let s = uts.contentSize;
            c1.x = (0.5 - anchor.x) * s.width + c0.x;
            c1.y = (0.5 - anchor.y) * s.height + c0.y;
            
            this.isDirty |= Dirty.T;
        }
    }

    getRotation() { return this.node.rotation; }
    getPosition() { return this.node.position; }
    getScale() { return this.node.scale; }

    //删除当前节点
    /**
     * @param retrieve  移除body, retrieve: 是否回收body ？默认回收body
     * @returns 
     */
    remove(retrieve: boolean = true) {

        //移除body, retrieve: 是否回收body ？
        cCollider.inst.remove(this.body, retrieve);
        this.body = null;
        //从父节点移除
        this.node.removeFromParent();

        //最后node用户自己控制回收和释放
        //this.remove().destroy() // 回收body，释放node
        //pool.push(this.remove(false)); //不回收body , 回收node

        return this.node;
    }

    //重新添加到父节点
    insert(parent: Node) {
        if (!parent || !parent.isValid) {
            console.error("父节点不存在 或者不可用");
            return;
        }
        if (!this.body) {
            this.createCollider();
        }
        //插入body, 强制更新body数据
        cCollider.inst.insert(this.body, true);

        //添加到父节点
        if (this.node && this.node.isValid && this.node.parent != parent ){
            this.node.parent = parent;
        }else{
            console.warn("自身节点不存在 或者不可用")
        }
    }

    init(...any: any) { }

    
    //#region 碰撞触发逻辑
    /**trigger 回调 enter,stay exit*/
    onTrigger(b: cBody,trigger: Trigger) {
  
        switch(trigger){
            case Trigger.enter:
                this.onTriggerEnter(b);
                break;
            case Trigger.stay:
                this.onTriggerStay(b);
                break;
            case Trigger.exit:
                this.onTriggerExit(b);
                break;
            case Trigger.default:
                this.onTriggerDefault(b);
                break;
        }
    }
    /**
     *  碰撞触发 - 进入
     * @param b 碰撞体
     */
    protected onTriggerEnter(b: cBody) {

    }
    /**
     * 碰撞触发 - 持续
     * @param b 碰撞体
     */
    protected onTriggerStay(b: cBody) {

    }
    /**
     * 碰撞触发 - 离开
     * @param b 碰撞体
     */
    protected onTriggerExit(b: cBody) {

    }
    /**
     * 默认处理
     * @param b 碰撞体
     */
    protected onTriggerDefault(b: cBody) { 
    
    }
    //#endregion

    /**
     * 获取脏标记
     * @returns 脏标记
     */
    hasChangeDirty(){
        let isDirty = this.isDirty
        let flag = this.node.hasChangedFlags;
        if(flag){
            if(flag&Node.TransformBit.POSITION) isDirty|=Dirty.T; 
            if(flag&Node.TransformBit.ROTATION) isDirty|=Dirty.R; 
            if(flag&Node.TransformBit.SCALE) isDirty|=Dirty.S; 
        }

        this.isDirty = Dirty.NON;
        
        return isDirty;
    }

    onDestroy() {
        cCollider.inst.remove(this.body,true);
        this.unscheduleAllCallbacks();
        this.shape = null;
        this.body = null;

    }
}

