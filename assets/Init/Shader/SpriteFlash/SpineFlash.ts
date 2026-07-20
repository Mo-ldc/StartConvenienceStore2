import { _decorator, Component, Color, Material, sp, js } from 'cc';
const { ccclass, property, disallowMultiple, executeInEditMode, requireComponent } = _decorator;

@ccclass('SpineFlash')
@disallowMultiple(true)
@executeInEditMode(true)
@requireComponent(sp.Skeleton)
export class SpineFlash extends Component {
    @property({ displayName: '材质', readonly: true })
    materialName: string = '';

    @property({ displayName: '覆盖颜色'})
    coverColor: Color = new Color(255, 255, 255, 255);

    @property({ displayName: '混合比例', slide: true, range: [0.0, 1.0, 0.01] })
    mixPercent: number = 0.0;

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
        let skeleton = this.node.getComponent(sp.Skeleton);
        if (!skeleton) return false;
        skeleton['updateMaterial']?.();
        let className = js.getClassName(this);
        this.materialName = skeleton.customMaterial?.name || '';
        if (this.materialName !== className) {
            console.warn(`节点"${this.node.name}"的组件"${className}.ts"需设置材质为"${className}.mtl"`);
            this.material = null;
            return false;
        }
        this.material = skeleton.getMaterialInstance?.(0) || skeleton.material;
        if (!this.material) return false;
        return true;
    }

    private syncMaterial(): void {
        if (!this.material) return;
        this.material.setProperty('coverColor', this.coverColor);
        this.material.setProperty('mixPercent', this.mixPercent);
    }

    /** 触发闪光 */
    flash(color?: Color, duration: number = 0.2): void {
        this.coverColor = color || new Color(255, 50, 50, 255);
        this.mixPercent = 1.0;
        if (duration > 0) {
            this.unschedule(this.reset);
            this.scheduleOnce(this.reset, duration);
        }
    }

    /** 淡入闪光 */
    fadeFlash(color: Color, duration: number = 0.3): void {
        this.coverColor = color;
        this.mixPercent = 1.0;
        if (duration > 0) {
            this.unschedule(this.fadeReset);
            this.scheduleOnce(this.fadeReset, duration);
        }
    }

    private fadeReset(): void {
        this.mixPercent = 0.0;
    }

    /** 重置 */
    reset(): void {
        this.mixPercent = 0.0;
    }
}
