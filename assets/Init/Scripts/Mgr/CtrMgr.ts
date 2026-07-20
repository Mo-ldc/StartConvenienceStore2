import { EventTouch, isValid } from "cc";
import { CtrBase } from "../Ctr/CtrBase";
import { CtrRes } from "../Ctr/CtrRes";
import { CtrRole } from "../Ctr/CtrRole";
import { CtrUI } from "../Ctr/CtrUI";
import { CtrRoom } from "../Ctr/CtrRoom";
import { CtrLoan } from "../Ctr/CtrLoan";
import { CtrLv } from "../Ctr/CtrLv";

type CtrCtor = new (...args: any[]) => CtrBase;

/**
 * 控制器中继站
 * 统一驱动所有 CtrBase 的 update / lateUpdate，并在遍历中安全处理增删
 */
export class CtrMgr {
    private static instance: CtrMgr = null;

    public static getInstance(): CtrMgr {
        if (this.instance == null) this.instance = new CtrMgr();
        return this.instance;
    }
    public get ctrRes(): CtrRes { return this.getCtr(CtrRes); }
    public get ctrUI(): CtrUI { return this.getCtr(CtrUI); }
    public get ctrRole(): CtrRole { return this.getCtr(CtrRole); }
    public get ctrRoom(): CtrRoom { return this.getCtr(CtrRoom); }
    public get ctrLoan(): CtrLoan { return this.getCtr(CtrLoan); }
    public get ctrLv(): CtrLv { return this.getCtr(CtrLv); }

    private _ctrMap = new Map<CtrCtor, CtrBase>();
    private _ctrArr: CtrBase[] = [];
    private _pendingRemove = new Set<CtrBase>();
    private _iterating = false;

    /** 每帧驱动所有控制器的 update */
    upDateCtr(dt: number) {
        this._iterating = true;
        for (let i = 0; i < this._ctrArr.length; i++) {
            const ctr = this._ctrArr[i];
            if (!isValid(ctr, true)) {
                this._pendingRemove.add(ctr);
                continue;
            }
            if (ctr.canUpDate) ctr.upDateCtr(dt);
        }
        this._iterating = false;
        this._flushRemove();
    }

    /** 每帧驱动所有控制器的 lateUpdate */
    lateUpdateCtr(dt: number) {
        this._iterating = true;
        for (let i = 0; i < this._ctrArr.length; i++) {
            const ctr = this._ctrArr[i];
            if (!isValid(ctr, true)) {
                this._pendingRemove.add(ctr);
                continue;
            }
            ctr.lateUpdateCtr(dt);
        }
        this._iterating = false;
        this._flushRemove();
    }

    /** 添加控制器 */
    addCtr(ctr: CtrBase) {
        if (!ctr || this._ctrArr.indexOf(ctr) >= 0) return;
        this._ctrArr.push(ctr);
        this._ctrMap.set(ctr.constructor as CtrCtor, ctr);
    }

    /** 移除控制器 */
    removeCtr(ctr: CtrBase) {
        if (!ctr) return;
        if (this._iterating) {
            this._pendingRemove.add(ctr);
        } else {
            this._removeImmediate(ctr);
        }
    }

    /** 按类型获取控制器 */
    getCtr<T extends CtrBase>(type: new (...args: any[]) => T): T | null {
        return (this._ctrMap.get(type as CtrCtor) as T) ?? null;
    }

    /** 清空所有控制器并销毁其节点 */
    clearCtr() {
        const arr = [...this._ctrArr];
        while (arr.length) arr.pop()?.node?.destroy();
        this._ctrArr.length = 0;
        this._ctrMap.clear();
        this._pendingRemove.clear();
    }

    private _removeImmediate(ctr: CtrBase) {
        const idx = this._ctrArr.indexOf(ctr);
        if (idx >= 0) this._ctrArr.splice(idx, 1);
        const ctor = ctr.constructor as CtrCtor;
        if (this._ctrMap.get(ctor) === ctr) this._ctrMap.delete(ctor);
    }

    private _flushRemove() {
        if (this._pendingRemove.size === 0) return;
        const removes = [...this._pendingRemove];
        this._pendingRemove.clear();
        for (const ctr of removes) this._removeImmediate(ctr);
    }

    onTouchStart(event: EventTouch) {
        for (let i = 0; i < this._ctrArr.length; i++) {
            const ctr = this._ctrArr[i];
            if (!isValid(ctr, true)) continue;
            ctr.onTouchStart(event);
        }
    }
    onTouchMove(event: EventTouch) {
        for (let i = 0; i < this._ctrArr.length; i++) {
            const ctr = this._ctrArr[i];
            if (!isValid(ctr, true)) continue;
            ctr.onTouchMove(event);
        }
    }
    onTouchEnd(event: EventTouch) {
        for (let i = 0; i < this._ctrArr.length; i++) {
            const ctr = this._ctrArr[i];
            if (!isValid(ctr, true)) continue;
            ctr.onTouchEnd(event);
        }
    }
    /** 释放所有控制器 */
    dispose() {
        for (let i = 0; i < this._ctrArr.length; i++) {
            this._ctrArr[i].dispose();
        }
        this._ctrArr.length = 0;
        this._ctrMap.clear();
    }
    
}
