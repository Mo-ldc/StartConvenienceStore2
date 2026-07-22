import { _decorator, Component, Node, NodeEventType, UITransform } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;
/**
 * 脚本核心功能，本节点会跟随目标节点的 宽高 进行相对应的缩放
 */
@ccclass('AutoNodeScale')
@executeInEditMode(true)
export class AutoNodeScale extends Component {
    /** 是否自定义同步节点 */
    @property({ tooltip: '自定义同步节点，如果为true，则会根据 syncNode 节点的宽高进行缩放，否则会根据父节点的宽高进行缩放' })
    private isCustom: boolean = false;
    @property({ type: UITransform, tooltip: '自定义同步节点，如果isCustom为true，则根据此UITransform节点宽高缩放；否则根据父节点宽高缩放' })
    private uiTr: UITransform = null;

    private selfUiTr: UITransform = null;

    protected onEnable(): void {
        this.selfUiTr = this.node.getComponent(UITransform);
        if (!this.selfUiTr) {
            console.warn("AutoNodeScale: 当前节点没有UITransform组件");
            return;
        }

        if (!this.uiTr && !this.isCustom) {
            let parent = this.node.parent;
            if (parent) this.uiTr = parent.getComponent(UITransform);
            else console.warn("AutoNodeScale: 父节点不存在");
        }

        if (this.uiTr) {
            this.uiTr.node.on(NodeEventType.SIZE_CHANGED, this.onSizeChanged, this);
            this.node.on(NodeEventType.SIZE_CHANGED, this.onSizeChanged, this);
            this.updateScale();
        }
    }

    protected onDisable(): void {
        if (this.uiTr) {
            this.uiTr.node.off(NodeEventType.SIZE_CHANGED, this.onSizeChanged, this);
            this.node.off(NodeEventType.SIZE_CHANGED, this.onSizeChanged, this);
        }
    }

    private onSizeChanged(): void {
        this.updateScale();
    }

    private updateScale(): void {
        if (!this.uiTr || !this.selfUiTr) return;

        let targetWidth = this.uiTr.width;
        let targetHeight = this.uiTr.height;
        let selfWidth = this.selfUiTr.width;
        let selfHeight = this.selfUiTr.height;

        if (selfWidth === 0 || selfHeight === 0) return;

        let scale = Math.min(targetWidth / selfWidth, targetHeight / selfHeight);

        this.node.setScale(scale, scale, 1);
    }
}


