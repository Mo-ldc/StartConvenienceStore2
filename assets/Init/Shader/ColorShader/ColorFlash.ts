import { _decorator, Component, Color, Material, UIRenderer, Vec4, js } from 'cc';
const { ccclass, property, disallowMultiple, executeInEditMode, requireComponent } = _decorator;

@ccclass('ColorFlash')
@disallowMultiple(true)
@executeInEditMode(true)
@requireComponent(UIRenderer)
export class ColorFlash extends Component {
    @property({ displayName: '材质', readonly: true })
    materialName: string = '';

    @property({ displayName: '扫光颜色', })
    shineColor: Color = new Color(255, 255, 255, 255);

    @property({ displayName: '扫光方向',tooltip: 'x,y=方向(1,0=右 / 0,1=上 / 1,1=右上)' })
    shineDir: Vec4 = new Vec4(1, 0, 0, 0);

    @property({ displayName: '扫光速度', slide: true, range: [0.0, 5.0, 0.1] })
    speed: number = 1.0;

    @property({ displayName: '光带宽度', slide: true, range: [0.0005, 2.0, 0.0005], tooltip: '亮区核心宽度' })
    shineWidth: number = 0.3;

    @property({ displayName: '边缘渐变', slide: true, range: [0.0, 1.0, 0.01], tooltip: '光带边缘渐变过渡宽度' })
    edgeSoftness: number = 0.1;

    @property({ displayName: '扫光亮度', slide: true, range: [0, 3.0, 0.1] })
    brightness: number = 1.0;

    @property({ displayName: '扫光间隔', slide: true, range: [0.0, 5.0, 0.1], tooltip: '两次扫光之间的停顿时间(秒)' })
    interval: number = 0.0;

    material: Material = null;

    protected onEnable(): void {
        if (!this.checkMaterial() || !this.material) return;
        this.syncMaterial();
    }

    protected update(dt: number): void {
        if (!this.material) return;
        this.syncMaterial();
    }

    checkMaterial(): boolean {
        let ur = this.node.getComponent(UIRenderer);
        if (!ur) return false;
        ur['updateMaterial']();
        this.material = ur.getMaterialInstance(0);
        if (!this.material) return false;
        let className = js.getClassName(this);
        this.materialName = ur.customMaterial?.name || '';
        if (this.materialName !== className) {
            console.warn(`节点"${this.node.name}"的组件"${className}.ts"需设置材质为"${className}.mtl"`);
            return false;
        }
        return true;
    }

    private syncMaterial(): void {
        if (!this.material) return;
        this.material.setProperty('shineColor', this.shineColor);
        this.material.setProperty('shineDir', this.shineDir);
        this.material.setProperty('speed', this.speed);
        this.material.setProperty('shineWidth', this.shineWidth);
        this.material.setProperty('edgeSoftness', this.edgeSoftness);
        this.material.setProperty('brightness', this.brightness);
        this.material.setProperty('interval', this.interval);
    }

    /** 设置扫光方向 */
    setDirection(dx: number, dy: number): void {
        this.shineDir = new Vec4(dx, dy, 0, 0);
    }

    /** 从左到右扫光 */
    sweepRight(speed: number = 1): void {
        this.setDirection(1, 0);
        this.speed = speed;
    }

    /** 从右到左扫光 */
    sweepLeft(speed: number = 1): void {
        this.setDirection(-1, 0);
        this.speed = speed;
    }

    /** 从下到上扫光 */
    sweepUp(speed: number = 1): void {
        this.setDirection(0, 1);
        this.speed = speed;
    }

    /** 从上到下扫光 */
    sweepDown(speed: number = 1): void {
        this.setDirection(0, -1);
        this.speed = speed;
    }

    /** 对角线扫光 (右上) */
    sweepDiagonal(speed: number = 1): void {
        this.setDirection(1, 1);
        this.speed = speed;
    }
}
