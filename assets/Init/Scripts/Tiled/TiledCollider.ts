import { _decorator, BoxCollider2D, Component, ERigidBody2DType, Node, RigidBody2D, Size, TiledLayer, TiledMap, UITransform, v2 } from 'cc';
const { ccclass, property } = _decorator;

interface IRect { x: number; y: number; width: number; height: number; }

/**
 * 瓦片地图碰撞墙体生成系统（独立组件）
 * 负责：扫描障碍层、合并相邻瓦片为矩形、生成静态刚体 + 盒碰撞体。
 * 与寻路系统 TiledSystem 互不依赖。
 *
 * 注意：需在「项目设置 → 功能裁剪」中启用 2D 物理模块，碰撞才会生效。
 */
@ccclass('TiledCollider')
export class TiledCollider extends Component {
    @property({ type: TiledMap, tooltip: "如果为空，则从当前节点或父节点查找 TiledMap" })
    tiledMap: TiledMap = null;

    @property({ tooltip: "要生成碰撞的图层名称（区分大小写），非空瓦片视为墙体" })
    layerName: string = "Collision";

    @property({ tooltip: "调试：在控制台打印合并信息" })
    debugLog: boolean = false;

    /** 生成的墙体统一挂在此容器下，便于清理 */
    private readonly CONTAINER_NAME = "WallColliders";

    // 缓存瓦片尺寸和地图尺寸（像素单位）
    private _tileWidth: number = 0;
    private _tileHeight: number = 0;
    private _mapWidthPx: number = 0;
    private _mapHeightPx: number = 0;
    private _mapGridWidth: number = 0;
    private _mapGridHeight: number = 0;

    public init() {
        if (!this.resolveTiledMap()) return;

        const layer: TiledLayer = this.tiledMap.getLayer(this.layerName);
        if (!layer) {
            console.warn(`[TiledCollider] 未找到图层 "${this.layerName}"`);
            return;
        }

        this.cacheMapInfo();

        // 清除已有墙体容器，避免重复生成
        this.clearColliders(layer.node);

        // 收集碰撞瓦片矩形（未合并）
        const tileRects = this.createCollisionRects(layer);
        if (tileRects.length === 0) {
            if (this.debugLog) console.log(`[TiledCollider] 图层 "${this.layerName}" 没有碰撞瓦片`);
            return;
        }

        // 合并相邻矩形
        const mergedRects = this.mergeRects(tileRects);

        // 生成墙体
        this.createWalls(mergedRects, layer);

        if (this.debugLog) {
            console.log(`[TiledCollider] 完成，合并后碰撞体数量: ${mergedRects.length} (原始: ${tileRects.length})`);
        }
    }

    /** 解析 TiledMap 组件 */
    private resolveTiledMap(): boolean {
        if (!this.tiledMap) {
            this.tiledMap = this.node.getComponent(TiledMap);
            if (!this.tiledMap) {
                this.tiledMap = this.node.parent?.getComponent(TiledMap);
            }
        }
        if (!this.tiledMap) {
            console.error("[TiledCollider] 未找到 TiledMap 组件，请在属性面板手动指定。");
            return false;
        }
        return true;
    }

    /** 缓存地图基本信息 */
    private cacheMapInfo() {
        const mapSize = this.tiledMap.getMapSize();
        const tileSize = this.tiledMap.getTileSize();
        this._mapGridWidth = mapSize.width;
        this._mapGridHeight = mapSize.height;
        this._tileWidth = tileSize.width;
        this._tileHeight = tileSize.height;
        this._mapWidthPx = this._mapGridWidth * this._tileWidth;
        this._mapHeightPx = this._mapGridHeight * this._tileHeight;
    }

    /** 根据合并后的矩形创建静态刚体 + 盒碰撞体 */
    private createWalls(mergedRects: IRect[], layer: TiledLayer) {
        // 创建容器节点统一存放墙体
        const container = new Node(this.CONTAINER_NAME);
        container.parent = layer.node;

        for (let i = 0; i < mergedRects.length; i++) {
            const rect = mergedRects[i];

            const wallNode = new Node("wall_" + i);
            wallNode.parent = container;

            // UITransform（必须先添加，碰撞体尺寸基于此）
            const ut = wallNode.addComponent(UITransform);
            ut.setContentSize(rect.width, rect.height);

            // 坐标转换：Tiled(左上原点,Y向下) → Cocos(左下原点,Y向上)
            const centerX = rect.x + rect.width / 2 - this._mapWidthPx / 2;
            const centerY = this._mapHeightPx / 2 - rect.y - rect.height / 2;
            wallNode.setPosition(centerX, centerY);

            // 静态刚体
            const rigid = wallNode.addComponent(RigidBody2D);
            rigid.type = ERigidBody2DType.Static;

            // 盒碰撞体
            const collider = wallNode.addComponent(BoxCollider2D);
            collider.size = new Size(rect.width, rect.height);
            collider.offset = v2(0, 0);
            collider.apply();

            if (this.debugLog) {
                console.log(`[TiledCollider] 生成墙体: 位置(${centerX}, ${centerY}) 大小(${rect.width}, ${rect.height})`);
            }
        }

        if (this.debugLog) console.warn("[TiledCollider] 墙体数量:", mergedRects.length);
    }

    /** 仅清除本组件生成的墙体容器，不影响图层其他子节点 */
    private clearColliders(layerNode: Node) {
        const old = layerNode.getChildByName(this.CONTAINER_NAME);
        if (old) old.destroy();
    }

    /**
     * 遍历障碍图层，收集所有非空瓦片的矩形（每个瓦片一个矩形）
     * 坐标单位为像素，原点为图层左上角（Tiled 坐标系）
     */
    private createCollisionRects(layer: TiledLayer): IRect[] {
        const rects: IRect[] = [];
        for (let row = 0; row < this._mapGridHeight; row++) {
            for (let col = 0; col < this._mapGridWidth; col++) {
                const gid = layer.getTileGIDAt(col, row);
                if (gid === 0) continue; // 空瓦片
                rects.push({
                    x: col * this._tileWidth,
                    y: row * this._tileHeight,
                    width: this._tileWidth,
                    height: this._tileHeight
                });
            }
        }
        return rects;
    }

    /**
     * 合并一组矩形（先水平后垂直）
     */
    private mergeRects(rects: IRect[]): IRect[] {
        if (rects.length === 0) return [];

        // 第一步：按 y 分组，水平合并
        const rows: Map<number, IRect[]> = new Map();
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            if (!rows.has(rect.y)) rows.set(rect.y, []);
            rows.get(rect.y).push(rect);
        }

        const horizontallyMerged: IRect[] = [];
        rows.forEach((rowRects) => {
            rowRects.sort((a, b) => a.x - b.x);
            let current = { ...rowRects[0] };
            for (let i = 1; i < rowRects.length; i++) {
                const next = rowRects[i];
                if (Math.abs(current.x + current.width - next.x) < 0.01 && current.height === next.height) {
                    current.width += next.width;
                } else {
                    horizontallyMerged.push(current);
                    current = { ...next };
                }
            }
            horizontallyMerged.push(current);
        });

        // 第二步：按 x 分组，垂直合并
        const cols: Map<number, IRect[]> = new Map();
        for (let i = 0; i < horizontallyMerged.length; i++) {
            const rect = horizontallyMerged[i];
            if (!cols.has(rect.x)) cols.set(rect.x, []);
            cols.get(rect.x).push(rect);
        }

        const verticallyMerged: IRect[] = [];
        cols.forEach((colRects) => {
            colRects.sort((a, b) => a.y - b.y);
            let current = { ...colRects[0] };
            for (let i = 1; i < colRects.length; i++) {
                const next = colRects[i];
                if (Math.abs(current.y + current.height - next.y) < 0.01 && current.width === next.width) {
                    current.height += next.height;
                } else {
                    verticallyMerged.push(current);
                    current = { ...next };
                }
            }
            verticallyMerged.push(current);
        });

        return verticallyMerged;
    }
}
