/** 路径节点类 */
export class PathNode {
    x: number;
    y: number;
    g: number = 0;
    h: number = 0;
    f: number = 0;
    parent: PathNode | null = null;
    isWall: boolean = false;
    inOpen: boolean = false;
    inClosed: boolean = false;

    constructor(x: number, y: number, isWall: boolean = false) {
        this.x = x;
        this.y = y;
        this.isWall = isWall;
    }

    reset(): void {
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.parent = null;
        this.inOpen = false;
        this.inClosed = false;
    }
}
/** 二叉堆，用于实现 A* 算法的开放列表 */
class BinaryHeap<T> {
    private data: T[];
    private compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {
        this.data = [];
        this.compare = compare;
    }

    push(item: T): void {
        this.data.push(item);
        this._siftUp(this.data.length - 1);
    }

    pop(): T | undefined {
        if (this.data.length === 0) return undefined;
        const top = this.data[0];
        const bottom = this.data.pop()!;
        if (this.data.length > 0) {
            this.data[0] = bottom;
            this._siftDown(0);
        }
        return top;
    }

    get size(): number { return this.data.length; }

    private _siftUp(idx: number): void {
        while (idx > 0) {
            const p = (idx - 1) >> 1;
            if (this.compare(this.data[idx], this.data[p]) < 0) {
                [this.data[idx], this.data[p]] = [this.data[p], this.data[idx]];
                idx = p;
            } else break;
        }
    }

    private _siftDown(idx: number): void {
        const len = this.data.length;
        while (true) {
            let min = idx;
            const l = (idx << 1) + 1;
            const r = (idx << 1) + 2;
            if (l < len && this.compare(this.data[l], this.data[min]) < 0) min = l;
            if (r < len && this.compare(this.data[r], this.data[min]) < 0) min = r;
            if (min === idx) break;
            [this.data[idx], this.data[min]] = [this.data[min], this.data[idx]];
            idx = min;
        }
    }
}
/** 矩阵路径寻路器 */
export class TiledPathFinder {
    private grid: PathNode[][];
    private width: number;
    private height: number;
    /** 是否启用严格对角线移动检查 */
    private strictDiagonal: boolean = true;
    /** 搜索节点列表，用于清理搜索状态 */
    private _searchNodes: PathNode[] = [];

    constructor(width: number, height: number, strictDiagonal: boolean = true) {
        this.width = width;
        this.height = height;
        this.strictDiagonal = strictDiagonal;
        this.grid = [];
        this.initGrid();
    }

    private initGrid() {
        for (let x = 0; x < this.width; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.grid[x][y] = new PathNode(x, y);
            }
        }
    }

    // 设置障碍物
    public setWall(x: number, y: number, isWall: boolean) {
        if (this.isValid(x, y)) {
            this.grid[x][y].isWall = isWall;
        }
    }

    public isWall(x: number, y: number): boolean {
        if (!this.isValid(x, y)) return true;
        return this.grid[x][y].isWall;
    }

    public getGridSize(): { width: number, height: number } {
        return { width: this.width, height: this.height };
    }

    // 核心寻路方法
    public findPath(startX: number, startY: number, endX: number, endY: number): { x: number, y: number }[] {
        if (!this.isValid(startX, startY) || !this.isValid(endX, endY)) return [];

        let startNode = this.grid[startX][startY];
        let endNode = this.grid[endX][endY];

        if (startNode.isWall || endNode.isWall) return [];

        startNode.g = 0;
        startNode.h = this.getDistance(startNode, endNode);
        startNode.f = startNode.g + startNode.h;
        startNode.inOpen = true;
        startNode.parent = null;
        this._searchNodes.push(startNode);

        let openHeap = new BinaryHeap<PathNode>((a, b) => a.f - b.f);
        openHeap.push(startNode);

        while (openHeap.size > 0) {
            let currentNode = openHeap.pop()!;

            // 跳过过期条目（节点被更好路径更新后，旧堆条目 f 值与实际不符）
            if (currentNode.inClosed) continue;
            if (currentNode.g + currentNode.h !== currentNode.f) continue;

            if (currentNode === endNode) {
                let path = this.retracePath(startNode, endNode);
                this._cleanupSearch();
                return path;
            }

            currentNode.inOpen = false;
            currentNode.inClosed = true;

            let neighbors = this.getNeighbors(currentNode);
            for (let neighbor of neighbors) {
                if (neighbor.inClosed || neighbor.isWall) continue;

                let newG = currentNode.g + this.getDistance(currentNode, neighbor);

                if (!neighbor.inOpen) {
                    neighbor.g = newG;
                    neighbor.h = this.getDistance(neighbor, endNode);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = currentNode;
                    neighbor.inOpen = true;
                    this._searchNodes.push(neighbor);
                    openHeap.push(neighbor);
                } else if (newG < neighbor.g) {
                    neighbor.g = newG;
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = currentNode;
                    openHeap.push(neighbor);
                }
            }
        }

        this._cleanupSearch();
        return [];
    }

    private _cleanupSearch(): void {
        for (let i = 0; i < this._searchNodes.length; i++) {
            this._searchNodes[i].reset();
        }
        this._searchNodes.length = 0;
    }

    private getNeighbors(node: PathNode): PathNode[] {
        let neighbors: PathNode[] = [];
        // 8个方向：上下左右 + 四个对角线
        let dirs = [
            [0, 1], [0, -1], [1, 0], [-1, 0],  // 上下左右
            [1, 1], [1, -1], [-1, 1], [-1, -1]  // 对角线
        ];
        for (let dir of dirs) {
            let nx = node.x + dir[0];
            let ny = node.y + dir[1];
            if (this.isValid(nx, ny)) {
                // 如果启用严格模式且是对角线移动，需要检查相邻的两个直向格子是否都是通路
                if (this.strictDiagonal && Math.abs(dir[0]) === 1 && Math.abs(dir[1]) === 1) {
                    // 检查对角线移动的两个相邻直向格子
                    let adjX1 = node.x + dir[0];
                    let adjY1 = node.y;
                    let adjX2 = node.x;
                    let adjY2 = node.y + dir[1];
                    
                    // 如果任何一个相邻直向格子是墙，则不允许对角线移动
                    if (this.grid[adjX1][adjY1].isWall || this.grid[adjX2][adjY2].isWall) {
                        continue;
                    }
                }
                neighbors.push(this.grid[nx][ny]);
            }
        }
        return neighbors;
    }

    private isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    // 计算两点之间的距离（支持对角线）
    private getDistance(a: PathNode, b: PathNode): number {
        let dx = Math.abs(a.x - b.x);
        let dy = Math.abs(a.y - b.y);
        
        // 如果是对角线移动（dx和dy都为1），返回根号2 ≈ 1.414
        if (dx === 1 && dy === 1) {
            return 1.414;
        }
        // 直线移动返回1
        return 1;
    }

private retracePath(startNode: PathNode, endNode: PathNode): { x: number, y: number }[] {
        let path: { x: number, y: number }[] = [];
        let current: PathNode | null = endNode;
        while (current !== startNode) {
            path.push({ x: current.x, y: current.y });
            current = current.parent;
        }
        path.reverse();
        
        // 简化路径：移除可以被直线连接的中间节点
        return this.simplifyPath(path);
    }

    /**
     * 简化路径：使用射线检测移除不必要的中间节点
     * 例如：[(0,0), (1,0), (2,0), (3,1)] → [(0,0), (2,0), (3,1)]
     */
    private simplifyPath(path: { x: number, y: number }[]): { x: number, y: number }[] {
        if (path.length <= 2) return path;

        const simplified: { x: number, y: number }[] = [path[0]];
        let currentIndex = 0;

        while (currentIndex < path.length - 1) {
            let nextIndex = currentIndex + 1;
            
            // 尝试找到最远的可见节点
            for (let i = path.length - 1; i > currentIndex + 1; i--) {
                if (this.hasLineOfSight(path[currentIndex].x, path[currentIndex].y, path[i].x, path[i].y)) {
                    nextIndex = i;
                    break;
                }
            }
            
            simplified.push(path[nextIndex]);
            currentIndex = nextIndex;
        }

        return simplified;
    }

    /**
     * 检查两点之间是否有视线（无障碍物）
     * 使用 Bresenham 直线算法进行网格遍历
     */
    private hasLineOfSight(x0: number, y0: number, x1: number, y1: number): boolean {
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        let x = x0;
        let y = y0;

        while (true) {
            // 检查当前格子是否是障碍物（排除起点和终点）
            if ((x !== x0 || y !== y0) && (x !== x1 || y !== y1)) {
                if (!this.isValid(x, y) || this.grid[x][y].isWall) {
                    return false;
                }
            }

            // 到达终点
            if (x === x1 && y === y1) break;

            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }

        return true;
    }
}