import { _decorator, Component, Color, Material, UIRenderer, js } from 'cc';
const { ccclass, property, disallowMultiple, executeInEditMode, requireComponent } = _decorator;

@ccclass('GlowOutline')
@disallowMultiple(true)
@executeInEditMode(true)
@requireComponent(UIRenderer)
export class GlowOutline extends Component {
    @property({ displayName: '材质', readonly: true })
    materialName: string = '';

    @property({ displayName: '描边颜色' })
    outlineColor: Color = new Color(255, 0, 0, 255);

    @property({ displayName: '外描边宽度', slide: true, range: [0.0, 0.1, 0.001], tooltip: '向透明区域扩展(UV单位)' })
    outlineWidth: number = 0.0;

    @property({ displayName: '内描边宽度', slide: true, range: [0.0, 0.1, 0.001], tooltip: '向像素内部侵蚀(UV单位)' })
    innerWidth: number = 0.003;

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
        this.material.setProperty('outlineColor', this.outlineColor);
        this.material.setProperty('outlineWidth', this.outlineWidth);
        this.material.setProperty('innerWidth', this.innerWidth);
    }
}
