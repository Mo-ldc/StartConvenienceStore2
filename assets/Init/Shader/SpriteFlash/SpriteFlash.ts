import { _decorator, Component, Color, Material, UIRenderer, js } from 'cc';
const { ccclass, property, disallowMultiple, executeInEditMode, requireComponent } = _decorator;

@ccclass('SpriteFlash')
@disallowMultiple(true)
@executeInEditMode(true)
@requireComponent(UIRenderer)
export class SpriteFlash extends Component {
    @property({ displayName: '材质', readonly: true })
    materialName: string = '';

    @property({ displayName: '覆盖颜色' })
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
        let ur = this.node.getComponent(UIRenderer);
        if (!ur) return false;
        ur['updateMaterial']();
        let className = js.getClassName(this);
        this.materialName = ur.customMaterial?.name || '';
        if (this.materialName !== className) {
            console.warn(`节点"${this.node.name}"的组件"${className}.ts"需设置材质为"${className}.mtl"`);
            this.material = null;
            return false;
        }
        this.material = ur.getMaterialInstance(0);
        if (!this.material) return false;
        return true;
    }

    private syncMaterial(): void {
        if (!this.material) return;
        this.material.setProperty('coverColor', this.coverColor);
        this.material.setProperty('mixPercent', this.mixPercent);
    }

    /** 重置 */
    reset(): void {
        this.mixPercent = 0.0;
    }
}
