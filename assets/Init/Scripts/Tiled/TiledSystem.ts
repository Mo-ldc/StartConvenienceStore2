import { _decorator, Component, TiledLayer, TiledMap, UITransform, v2, Vec2, Vec3 } from 'cc';
import { TiledPathFinder } from './TiledPathFinder';
const { ccclass, property } = _decorator;

/**
 * 瓦片地图寻路系统
 * 只负责：解析地图信息、根据障碍层构建寻路网格、提供坐标转换。
 * 碰撞墙体的生成请使用独立组件 TiledCollider。
 */
@ccclass('TiledSystem')
export class TiledSystem extends Component {
    @property({ type: TiledMap, tooltip: "如果为空，则从当前节点或父节点查找 TiledMap" })
    tiledMap: TiledMap = null;

    @property({ tooltip: "作为障碍物的图层名称（区分大小写），非空瓦片视为障碍" })
    layerName: string = "Collision";

    @property({ tooltip: "调试：在控制台打印信息" })
    debugLog: boolean = false;

    // 缓存瓦片尺寸和地图尺寸（像素单位）
    private _tileWidth: number = 0;
    private _tileHeight: number = 0;
    private _mapWidthPx: number = 0;
    private _mapHeightPx: number = 0;
    private _mapGridWidth: number = 0;
    private _mapGridHeight: number = 0;

    /** 寻路工具 */
    pathFinder: TiledPathFinder = null;

    public init() {
        if (!this.resolveTiledMap()) return;

        // 获取障碍图层
        const layer: TiledLayer = this.tiledMap.getLayer(this.layerName);
        if (!layer) {
            console.warn(`[TiledSystem] 未找到图层 "${this.layerName}"`);
            return;
        }

        this.cacheMapInfo();

        // 初始化寻路器
        this.initPathFinder(layer);

        if (this.debugLog) {
            console.log(`[TiledSystem] 寻路网格初始化完成: ${this._mapGridWidth}x${this._mapGridHeight}`);
            this.logGridInfo();
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
            console.error("[TiledSystem] 未找到 TiledMap 组件，请在属性面板手动指定。");
            return false;
        }
        return true;
    }

    /** 缓存地图基本信息（格子数与像素尺寸） */
    private cacheMapInfo() {
        const mapSize = this.tiledMap.getMapSize();
        const tileSize = this.tiledMap.getTileSize();
        this._mapGridWidth = mapSize.width;
        this._mapGridHeight = mapSize.height;
        this._tileWidth = tileSize.width;
        this._tileHeight = tileSize.height;
        this._mapWidthPx = this._mapGridWidth * this._tileWidth;
        this._mapHeightPx = this._mapGridHeight * this._tileHeight;

        if (this.debugLog) {
            console.log("[TiledSystem] 地图信息:", {
                格子数: { width: this._mapGridWidth, height: this._mapGridHeight },
                地块尺寸: { width: this._tileWidth, height: this._tileHeight },
                像素尺寸: { width: this._mapWidthPx, height: this._mapHeightPx }
            });
        }
    }

    /**
     * 初始化寻路器，将障碍层中的非空瓦片同步为障碍物
     */
    private initPathFinder(layer: TiledLayer) {
        this.pathFinder = new TiledPathFinder(this._mapGridWidth, this._mapGridHeight);

        for (let row = 0; row < this._mapGridHeight; row++) {
            for (let col = 0; col < this._mapGridWidth; col++) {
                const gid = layer.getTileGIDAt(col, row);
                if (gid !== 0) {
                    // Tiled 坐标系：row=0 是顶部，Y 轴向下
                    this.pathFinder.setWall(col, row, true);
                }
            }
        }
    
    }

    /** 通过世界坐标获取地图格子坐标（Tiled 坐标系，row=0 在顶部） */
    public getMapCoordByWorldCoord(worldCoord: Vec3): Vec2 {
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) return v2(-1, -1);
        const localCoord = uiTransform.convertToNodeSpaceAR(worldCoord);

        // Cocos（中心原点，Y向上）→ Tiled（左上原点，Y向下）
        const tiledX = localCoord.x + this._mapWidthPx / 2;
        const tiledY = this._mapHeightPx / 2 - localCoord.y;

        if (tiledX < 0 || tiledX >= this._mapWidthPx || tiledY < 0 || tiledY >= this._mapHeightPx) {
            // console.warn("[TiledSystem] 世界坐标超出地图范围:", worldCoord);
            return v2(-1, -1);
        }

        const col = Math.floor(tiledX / this._tileWidth);
        const row = Math.floor(tiledY / this._tileHeight);
        return v2(col, row);
    }

    public getTileSize(): { width: number, height: number } {
        return { width: this._tileWidth, height: this._tileHeight };
    }

    public getMapSizePx(): { width: number, height: number } {
        return { width: this._mapWidthPx, height: this._mapHeightPx };
    }

    public getMapGridSize(): { width: number, height: number } {
        return { width: this._mapGridWidth, height: this._mapGridHeight };
    }

    /** 通过地图格子坐标（Tiled 坐标系）获取该格子中心点的世界坐标（getMapCoordByWorldCoord 的逆运算） */
    public getWorldCoordByMapCoord(col: number, row: number): Vec3 {
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) return new Vec3(0, 0, 0);

        // 格子中心的 Tiled 像素坐标
        const tiledX = (col + 0.5) * this._tileWidth;
        const tiledY = (row + 0.5) * this._tileHeight;

        // Tiled（左上原点，Y向下）→ Cocos（中心原点，Y向上）本地坐标
        const localX = tiledX - this._mapWidthPx / 2;
        const localY = this._mapHeightPx / 2 - tiledY;

        return uiTransform.convertToWorldSpaceAR(new Vec3(localX, localY, 0));
    }

    /** 寻路网格是否已初始化（init 成功后为 true） */
    public get isReady(): boolean {
        return !!this.pathFinder;
    }

    /** 输出网格信息 */
    public logGridInfo() {
        if (!this.pathFinder) return;
        let strArr: string[] = [];
        for (let row = 0; row < this._mapGridHeight; row++) {
            let rowStr = "";
            for (let col = 0; col < this._mapGridWidth; col++) {
                rowStr += this.pathFinder.isWall(col, row) ? "1" : "0";
            }
            strArr.push(rowStr);
        }
        console.log(strArr.join("\n"));
    }
}
