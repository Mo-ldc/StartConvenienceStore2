import { Asset, AssetManager, SpriteFrame, Prefab, instantiate, assetManager, AudioClip, Node, VideoClip, Scene, director, SceneAsset, Atlas, Constructor, SpriteAtlas } from "cc";
import { ResData } from "../Data/Data/ResData";
import { ResType } from "../Data/Type/ResType";
type ResLoadOneFn = (bundle: AssetManager.Bundle, resData: ResData) => Promise<any>;
type ResLoadDirFn = (bundle: AssetManager.Bundle, resData: ResData) => Promise<any[]>;

export class ResMgr {
    private static m_instance: ResMgr = null!;

    private static oneHandlers = new Map<ResType, ResLoadOneFn>();
    private static dirHandlers = new Map<ResType, ResLoadDirFn>();
    private static _inited = false;
    
    /**
     * string: 资源Key
     * ResData: 资源数据
     */
    private resConfigMap:Map<string, ResData> = new Map();
    
    /**已加载的预制体资源
     * string: 资源Key
     * Prefab: 预制体资源 
     */
    private prefabMap:Map<string, Prefab> = new Map();
    /**
     * string: 资源Key
     * SpriteFrame: 精灵帧资源 
     */
    private spritesMap:Map<string, SpriteFrame> = new Map();



    public static getInstance(): ResMgr {
        if (this.m_instance == null) {
            this.m_instance = new ResMgr();
        }
        return this.m_instance;
    }

    private static initHandlers(): void {
        if (ResMgr._inited) return;
        ResMgr._inited = true;
        ResMgr._initDefaultHandlers();

    }

    private static _initDefaultHandlers(): void {
        const c = ResMgr;

        c.registerResType(ResType.AudioClip, AudioClip);
        c.registerResType(ResType.Video, VideoClip);
        c.registerResType(ResType.Prefab, Prefab);
        c.registerResType(ResType.Config);
        c.registerResType(ResType.Script);
        c.registerResType(ResType.SpriteFrame, SpriteFrame);
        c.registerResType(ResType.SpriteAtlas, SpriteAtlas);
        c.registerResType(ResType.Scene, SceneAsset, (bundle, resData) =>
            new Promise(resolve => {
                director.preloadScene(resData.path,
                    () => { },
                    (err: Error | null) => {
                        if (err) {
                            console.error("场景预加载失败:", err);
                            resolve(null);
                            return;
                        }
                        resolve([null as any]);
                    }
                );
            })
        );
    }

    /** 动态注册资源类型 */
    public static registerResType(
        type: ResType,
        assetCtor?: Constructor<Asset> | null,
        dirHandler?: ResLoadDirFn
    ): void {
        const loadOne: ResLoadOneFn = (bundle, resData) =>
            new Promise(resolve => {
                const cb = (err: Error | null, asset: any) => {
                    if (err) {
                        console.error(`加载${ResType[type]}资源失败:`, err);
                        resolve(null);
                        return;
                    }
                    resolve(asset);
                };
                assetCtor ? bundle.load(resData.path, assetCtor, cb) : bundle.load(resData.path, cb);
            });

        const loadDir: ResLoadDirFn = dirHandler ?? ((bundle, resData) =>
            new Promise(resolve => {
                const cb = (err: Error | null, assets: any[]) => {
                    if (err) {
                        console.error(`加载${ResType[type]}资源失败:`, err);
                        resolve(null);
                        return;
                    }
                    resolve(assets);
                };
                assetCtor ? bundle.loadDir(resData.path, assetCtor, cb) : bundle.loadDir(resData.path, cb);
            })
        );

        ResMgr.oneHandlers.set(type, loadOne);
        ResMgr.dirHandlers.set(type, loadDir);
    }
    /** 确保资源包存在 */
    private _ensureBundle(bundleName: string){
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) {
            return null;
        }
        return bundle;

    }

    /**
     * 加载预制体资源
     * @param bundleName 资源包名称
     * @param path 资源路径
     * @returns 
     * @description 加载指定资源包下的所有预制体资源，返回预制体资源数组。如果资源包为空或加载失败，返回 null。
     */
    public async LoadPrefabs(bundleName: string, path: string): Promise<Prefab[] | null> {
        const bundle = await this._ensureBundle(bundleName);
        if (!bundle) {
            console.error("资源包为空:", bundleName);
            return null;
        }
        return new Promise(resolve => {
            bundle.loadDir(path, Prefab, (err: Error | null, assets: Prefab[]) => {
                if (err) {
                    console.error("加载", bundle.name, "下的", path, "预制体资源失败:", err);
                    resolve(null);
                    return;
                }
                resolve(assets);
            });
        });
    }
    /**
     * 加载资源包
     * @param name 资源包名称
     * @returns 
     * @description 加载指定名称的资源包，返回资源包对象。如果资源包为空或加载失败，返回 null。
     */
    public async LoadBundle(name: string) {
        return new Promise(resolve => {
            assetManager.loadBundle(name, (err: Error | null, bundle: AssetManager.Bundle) => {
                if (err) {
                    console.log(err.message)
                    resolve(null)
                    return;
                }
                // console.log("加载 bundle: ", name);
                resolve(bundle);
            });
        });
    }

    /**
     * 加载场景
     * @param resData 资源数据
     * @returns 
     * @description 加载指定场景，返回 Promise。如果加载失败，返回 null。
     */
    public async LoadScene(resData: ResData): Promise<void> {
        return new Promise(resolve => {
            director.loadScene(resData.path, () => {
                resolve();
            });
        });
    }

    /**
     * 加载单个资源（泛型，可指定返回类型）
     * @param resData 资源数据
     * @returns 
     * @description 加载指定资源，返回 Promise。如果加载失败，返回 null。
     */
    /** 加载单个资源（泛型，可指定返回类型） */
    public async LoadResOne<T = any>(resData: ResData){
        if (!resData) {
            console.error("资源数据为空");
            return null;
        }
        ResMgr.initHandlers();

        let bundle = await this._ensureBundle(resData.bundleName);
        if (!bundle) {
            // DebugConfig.Warning("先加载资源包:", resData.bundleName);
            await this.LoadBundle(resData.bundleName).then((_bundle:AssetManager.Bundle) => {
                bundle = _bundle;
            });
        }
        const fn = ResMgr.oneHandlers.get(resData.resType);
        if (!fn) {
            console.error(`未注册的资源类型: ${ResType[resData.resType]}(${resData.resType})`);
            return null;
        }
        const result = await fn(bundle, resData);
        return result;
    }

    /**
     * 加载同类型所有资源（泛型，可指定返回类型）
     * @param resData 资源数据
     * @returns 
     * @description 加载指定资源包下的所有同类型资源，返回资源数组。如果资源包为空或加载失败，返回 null。
     */
    /** 加载同类型所有资源（泛型，可指定返回类型） */
    public async LoadResAll<T = any>(resData: ResData): Promise<T[] | null> {
        if (!resData) {
            console.error("资源数据为空");
            return null;
        }
        ResMgr.initHandlers();
        const bundle = await this._ensureBundle(resData.bundleName);
        if (!bundle) {
            console.error("资源包为空:", resData.bundleName);
            return null;
        }
        const fn = ResMgr.dirHandlers.get(resData.resType);
        if (!fn) {
            console.error(`未注册的资源类型: ${ResType[resData.resType]}(${resData.resType})`);
            return null;
        }
        const results = await fn(bundle, resData);
        return results as T[];
    }

    /**
     * 直接用 Cocos 构造器加载单个资源（绕过 ResType 注册表）
     * @param bundleName 资源包名称
     * @param path 资源路径
     * @param assetCtor 资源构造器
     * @returns 
     * @description 加载指定资源，返回 Promise。如果加载失败，返回 null。
     */
    public async LoadAsset<T extends Asset>(
        bundleName: string,
        path: string,
        assetCtor: Constructor<T>
    ): Promise<T | null> {
        const bundle = await this._ensureBundle(bundleName);
        if (!bundle) {
            console.error("资源包为空:", bundleName);
            return null;
        }
        return new Promise(resolve => {
            bundle.load(path, assetCtor, (err: Error | null, asset: T) => {
                if (err) {
                    console.error("加载资源失败:", err);
                    resolve(null);
                    return;
                }
                resolve(asset);
            });
        });
    }

    /**
     * 直接用 Cocos 构造器加载目录下所有资源（绕过 ResType 注册表）
     * @param bundleName 资源包名称
     * @param path 资源路径
     * @param assetCtor 资源构造器
     * @returns 
     * @description 加载指定资源包下的所有同类型资源，返回资源数组。如果资源包为空或加载失败，返回 null。
     */
    public async LoadAssets<T extends Asset>(
        bundleName: string,
        path: string,
        assetCtor: Constructor<T>
    ): Promise<T[] | null> {
        const bundle = await this._ensureBundle(bundleName);
        if (!bundle) {
            console.error("资源包为空:", bundleName);
            return null;
        }
        return new Promise(resolve => {
            bundle.loadDir(path, assetCtor, (err: Error | null, assets: T[]) => {
                if (err) {
                    console.error("加载资源失败:", err);
                    resolve(null);
                    return;
                }
                resolve(assets);
            });
        });
    }

    /**
     * 加载单个预制体资源
     * @param resData 资源数据
     * @description 优先从缓存获取，缓存未命中则加载并写入缓存，返回预制体
     */
    public async LoadPrefab(resData: ResData): Promise<Prefab | null> {
        if (!resData) {
            console.error("资源数据为空");
            return null;
        }
        let prefab = this.prefabMap.get(resData.resKey);
        if (!prefab) {
            prefab = await this.LoadResOne<Prefab>(resData);
            if (prefab) {
                if(this.prefabMap.has(resData.resKey)){
                    // console.warn("资源已存在缓存中，将覆盖缓存:", resData.resKey);
                }
                this.prefabMap.set(resData.resKey, prefab);
            }
        }else{
            // console.log("获得预制体缓存：", resData.key);
        }
        return prefab;
    }

    public GetPrefabMap(): Map<string, Prefab> {
        return this.prefabMap;
    }

    public async LoadSpriteFrame(resData: ResData): Promise<SpriteFrame | null> {
        if (!resData) {
            console.error("资源数据为空");
            return null;
        }
        let spriteFrame = this.spritesMap.get(resData.resKey);
        if (!spriteFrame) {
            spriteFrame = await this.LoadResOne<SpriteFrame>(resData);
            if (spriteFrame) {
                if(this.spritesMap.has(resData.resKey)){
                    // console.warn("资源已存在缓存中，将覆盖缓存:", resData.resKey);
                }
                this.spritesMap.set(resData.resKey, spriteFrame); // Changed from resData.path to resData.key
            }
        }
        return spriteFrame;
    }

    public GetSpriteFrame(resData: ResData): Promise<SpriteFrame | null> {
        if (!resData) {
            console.error("资源数据为空");
            return null;
        }
        let spriteFrame = this.spritesMap.get(resData.resKey);
        return new Promise(resolve => {
            if (!spriteFrame) {
                this.LoadResOne<SpriteFrame>(resData).then(spriteFrame => {
                    this.spritesMap.set(resData.resKey, spriteFrame);
                    resolve(spriteFrame);
                });
            }else{
                resolve(spriteFrame);
            }

        });
    }

    public GetSpriteFrameMap(): Map<string, SpriteFrame> {
        return this.spritesMap;
    }

    public SetResConfig(resKey: string, resConfig: ResData) {
        if(!resKey){
            console.error("资源Key为空");
            return;
        }
        if(!resConfig){
            console.error("资源数据为空");
            return;
        }
        if(this.resConfigMap.has(resKey)){
            console.warn("资源已存在缓存中，将覆盖缓存:", resKey);
            return;
        }
        this.resConfigMap.set(resKey, resConfig);
    }
    /**
     * 获取资源配置映射
     * @returns 
     */
    public GetResConfigMap(): Map<string, ResData> {
        return this.resConfigMap;
    }
}
