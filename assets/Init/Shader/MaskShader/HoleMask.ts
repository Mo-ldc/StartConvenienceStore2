/*******************************************************************************
 * 创建:2025年10月27日
 * 作者:水煮肉片饭（27185709@qq.com）
 * 描述:挖洞组件，可以实现战争迷雾、放大镜、新手引导、转场动画等效果
 * 1、挖洞轮廓支持矩形、椭圆、纹理图采样（类似Mask）
 * 2、可设置挖洞区域位置、大小、边缘羽化。
 * 3、勾选反向（洞内可见洞外透明）后，可以设置洞内像素缩放（放大镜效果）
*******************************************************************************/
import { _decorator, UIRenderer, Component, Enum, js, Material, UITransform, Vec2, Node, NodeEventType, Sprite, SpriteFrame, Size, Tween, Vec3, tween } from 'cc';
/** 挖洞轮廓类型  */
export enum HoleMaskType {
    /** 矩形  */
    Rectangle,
    /** 椭圆  */
    Ellipse,
    /** 图片  */
    Image
}
Enum(HoleMaskType)


const { ccclass, property, disallowMultiple, executeInEditMode, requireComponent, menu } = _decorator;
@ccclass
@disallowMultiple(true)//同一节点上只允许添加一个同类型（含子类）的组件，防止逻辑发生冲突，默认值为 false。
@executeInEditMode(true)//能在编辑器里运行 默认为false
@requireComponent(UIRenderer)//参数用来指定当前组件的依赖组件，默认值为 null。当组件添加到节点上时，如果依赖的组件不存在，引擎会自动将依赖组件添加到同一个节点，防止脚本出错。该选项在运行时同样有效。
// @menu('Gi/Shader/HoleMask') 用来将当前组件添加到组件菜单中，方便用户查找。
export class HoleMask extends Component {
    @property({ displayName: '材质', readonly: true })
    materialName: string = '';
    @property
    _type: HoleMaskType = HoleMaskType.Rectangle;
    @property({ displayName: '类型', type: Enum(HoleMaskType) })
    get type() { return this._type; }
    set type(val) { this._type = val; this.material?.setProperty('type', val); }
    @property
    _contourTexture: SpriteFrame = null;
    @property({ displayName: '······轮廓图', type: SpriteFrame, visible() { return this._type === HoleMaskType.Image } })
    get contourTexture() { return this._contourTexture; }
    set contourTexture(val) { this._contourTexture = val; this.updateContourTexture(); }
    @property
    _center: Vec2 = new Vec2(0, 0);
    @property({ displayName: '······中心' })
    get center() { return this._center; }
    set center(val) { this._center = val; this.material?.setProperty('center', val); }
    @property
    _size: Size = new Size(100, 100);
    @property({ displayName: '······尺寸' })
    get size() { return this._size; }
    set size(val) { this._size = val; this.material?.setProperty('size', new Vec2(val.width, val.height)); }
    @property
    _feather: number = 0;
    @property({ displayName: '······羽化', visible() { return this._type !== HoleMaskType.Image } })
    get feather() { return this._feather; }
    set feather(val) { this._feather = val; this.material?.setProperty('feather', val); }
    @property
    _inverted: boolean = false;
    @property({ displayName: '反向' })
    get inverted() { return this._inverted; }
    set inverted(val) { this._inverted = val; this.material?.setProperty('inverted', val ? 1 : 0); }
    @property
    _scale: number = 1.0;
    @property({ displayName: '缩放', visible() { return this._inverted } })
    get scale() { return this._scale; }
    set scale(val) { this._scale = val; this.material?.setProperty('scale', val); }
    material: Material = null;
    protected onEnable(): void {
        if (!this.checkMaterial() || !this.material) return;
        this.material.setProperty('enable', 1);
        this.material.setProperty('type', this._type);
        this.material.setProperty('center', this._center);
        this.material.setProperty('size', new Vec2(this._size.width, this._size.height));
        this.material.setProperty('feather', this._feather);
        this.material.setProperty('inverted', this._inverted ? 1 : 0);
        this.material.setProperty('scale', this._scale);
        this.updateContourTexture();
        this.updateContentSize();
        this.node.on(NodeEventType.SIZE_CHANGED, this.updateContentSize, this);
    }
    protected onDisable(): void {
        this.material['_passes'].length !== 0 && this.material.setProperty('enable', 0);
        this.node.off(NodeEventType.SIZE_CHANGED, this.updateContentSize, this);
    }
    //检测渲染组件的材质，是否与本脚本匹配
    checkMaterial(): boolean {
        let ur = this.node.getComponent(UIRenderer);
        ur['updateMaterial']();
        this.material = ur.getMaterialInstance(0);
        let className = js.getClassName(this);
        this.materialName = ur.customMaterial.name;
        if (this.materialName !== className) {
            console.warn(`节点"${this.node.name}"的组件"${className}.ts"与材质"${this.materialName}.mtl"不匹配！请设置材质为"${className}.mtl"并重新编译！`);
            return false;
        }
        ur instanceof Sprite && ur.spriteFrame && (ur.spriteFrame.packable = false);
        return true;
    }
    updateContourTexture(): void {
        if (!this.node.activeInHierarchy) return;
        if (this._type !== HoleMaskType.Image) return;
        if (!this._contourTexture) return;
        this._contourTexture.packable = false;
        this.material?.setProperty('contourTexture', this._contourTexture.texture);
    }
    updateContentSize(): void {
        let ut = this.node.getComponent(UITransform);
        this.material?.setProperty('texSize', new Vec2(ut.width, ut.height));
    }
    /**
     * 移动到节点位置
     * @param duration 移动时间
     * @param node 移动节点
     * @param margin 移动边距
     * @returns 
     */
    moveTo(duration: number, node: Node, margin: number = 0): Promise<void> {
        // console.log("移动到节点位置", node.name);
        return new Promise<void>((resolve) => {
            let wp = new Vec3(), lp = new Vec3();
            node.getWorldPosition(wp);
            this.node.inverseTransformPoint(lp, wp);
            let contentSize = node.getComponent(UITransform).contentSize;
            // console.log("节点内容大小", contentSize);
            let src = this.getComponent(HoleMask);
            tween(src)
                .to(duration, {
                    center: new Vec2(lp.x, lp.y),
                    size: new Size(contentSize.width + margin, contentSize.height + margin)
                }, {
                    // onUpdate: () => {
                    //     console.log("更新材质属性");
                    //     this.material?.setProperty('center', this._center);
                    //     this.material?.setProperty('size', new Vec2(this._size.width, this._size.height));
                    // }
                })
                .call(() => {
                    // console.log("移动完成");
                    resolve()
                })
                .start();
        });
    }

    /**
     * 移动到自定义位置 自定义长宽高
     * @param duration 移动时间
     * @param position 移动位置
     * @param size 移动大小
     * @param margin 移动边距
     * @returns 
     */
    moveToCustom(duration: number, position: Vec3, size: Size, margin: number = 0): Promise<void> {
        return new Promise<void>((resolve) => {
            new Tween(this as HoleMask)
                .to(duration, {
                    center: new Vec2(position.x, position.y),
                    size: new Size(size.width + margin, size.height + margin)
                }, { onComplete: () => resolve() }).start();
        });
    }

    changeTo(node: Node, margin: number = 0) {
        // console.log("直接切换到节点位置", node.name);
        let src = this.getComponent(HoleMask);
        let wp = new Vec3(), lp = new Vec3();
        node.getWorldPosition(wp);
        this.node.inverseTransformPoint(lp, wp);
        let contentSize = node.getComponent(UITransform).contentSize;
        // console.log("节点内容大小", contentSize);
        src.center = new Vec2(lp.x, lp.y);
        src.size = new Size(contentSize.width + margin, contentSize.height + margin);
    }
}
