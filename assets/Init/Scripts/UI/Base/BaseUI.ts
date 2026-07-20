import { _decorator, CCBoolean, CCFloat, Component, Enum, Node, tween, TweenEasing, UIOpacity, Vec3 } from 'cc';
import { UIMgr } from '../../Mgr/UIMgr';
import { AudioMgr, AudioName } from '../../Mgr/AudioMgr';
const { ccclass, property } = _decorator;

/**UI切换动画状态 */
export enum UIAniState {
    /** 无效果 */
    None = 0,
    /** 缩放 */
    Scale = 1,
    /** 渐隐 */
    Fade = 2,
    /** 位移 */
    Move = 3,
    /** 自定义 */
    Custom = 4,
}
Enum(UIAniState);

/**缓动曲线 */
export enum UIAniEasing {
    Linear = 0,
    Smooth = 1,
    Fade = 2,
    QuadIn = 3,
    QuadOut = 4,
    QuadInOut = 5,
    CubicIn = 6,
    CubicOut = 7,
    CubicInOut = 8,
    QuartIn = 9,
    QuartOut = 10,
    SineIn = 11,
    SineOut = 12,
    ExpoIn = 13,
    ExpoOut = 14,
    CircIn = 15,
    CircOut = 16,
    ElasticIn = 17,
    ElasticOut = 18,
    BackIn = 19,
    BackOut = 20,
    BackInOut = 21,
    BounceIn = 22,
    BounceOut = 23,
    BounceInOut = 24,
}
Enum(UIAniEasing);

const EASING_STR: Record<UIAniEasing, TweenEasing> = {
    [UIAniEasing.Linear]: 'linear',
    [UIAniEasing.Smooth]: 'smooth',
    [UIAniEasing.Fade]: 'fade',
    [UIAniEasing.QuadIn]: 'quadIn',
    [UIAniEasing.QuadOut]: 'quadOut',
    [UIAniEasing.QuadInOut]: 'quadInOut',
    [UIAniEasing.CubicIn]: 'cubicIn',
    [UIAniEasing.CubicOut]: 'cubicOut',
    [UIAniEasing.CubicInOut]: 'cubicInOut',
    [UIAniEasing.QuartIn]: 'quartIn',
    [UIAniEasing.QuartOut]: 'quartOut',
    [UIAniEasing.SineIn]: 'sineIn',
    [UIAniEasing.SineOut]: 'sineOut',
    [UIAniEasing.ExpoIn]: 'expoIn',
    [UIAniEasing.ExpoOut]: 'expoOut',
    [UIAniEasing.CircIn]: 'circIn',
    [UIAniEasing.CircOut]: 'circOut',
    [UIAniEasing.ElasticIn]: 'elasticIn',
    [UIAniEasing.ElasticOut]: 'elasticOut',
    [UIAniEasing.BackIn]: 'backIn',
    [UIAniEasing.BackOut]: 'backOut',
    [UIAniEasing.BackInOut]: 'backInOut',
    [UIAniEasing.BounceIn]: 'bounceIn',
    [UIAniEasing.BounceOut]: 'bounceOut',
    [UIAniEasing.BounceInOut]: 'bounceInOut',
};

/**Vec3关键帧(缩放/位移) */
@ccclass('UIVec3KF')
export class UIVec3KF {
    @property({ tooltip: '目标值' }) target: Vec3 = new Vec3(0, 0, 1);
    /** 是否详细模式 */
    @property({ tooltip: '是否详细模式' }) detailed: boolean = false;
    /** 时间  */
    @property({ type: CCFloat, tooltip: '过渡时间(秒)', visible: function (this: UIVec3KF) { return this.detailed; } }) duration: number = 0.15;
    /** 缓动曲线  */
    @property({ type: Enum(UIAniEasing), tooltip: '缓动曲线' ,visible: function (this: UIVec3KF) { return this.detailed; } }) easing: UIAniEasing = UIAniEasing.Linear;
}

/**数值关键帧(渐隐) */
@ccclass('UINumKF')
export class UINumKF {
    /** 目标透明度(0~255) */
    @property({ type: CCFloat, tooltip: '目标透明度(0~255)' , range: [0, 255]}) target: number = 255;
    /** 是否详细模式 */
    @property({ tooltip: '是否详细模式' }) detailed: boolean = false;
    /** 时间  */
    @property({ type: CCFloat, tooltip: '过渡时间(秒)', visible: function (this: UINumKF) { return this.detailed; } }) duration: number = 0.15;
    /** 缓动曲线  */
    @property({ type: Enum(UIAniEasing), tooltip: '缓动曲线' ,visible: function (this: UINumKF) { return this.detailed; } }) easing: UIAniEasing = UIAniEasing.Linear;
}

@ccclass('UIAniSet')
export class UIAniSet {
    @property({ type: Enum(UIAniState), tooltip: '动画状态' })
    aniState: UIAniState = UIAniState.None;

    @property({ type: Node, tooltip: '动画节点', visible: function (this: UIAniSet) { return this.aniState != UIAniState.None; } })
    aniNode: Node = null;

    @property({ type: [UIVec3KF], tooltip: '缩放关键帧队列', visible: function (this: UIAniSet) { return this.aniState == UIAniState.Scale; } })
    scaleQueue: UIVec3KF[] = [];

    @property({ type: [UINumKF], tooltip: '渐隐关键帧队列', visible: function (this: UIAniSet) { return this.aniState == UIAniState.Fade; } })
    fadeQueue: UINumKF[] = [];

    @property({ type: [UIVec3KF], tooltip: '位移关键帧队列', visible: function (this: UIAniSet) { return this.aniState == UIAniState.Move; } })
    posQueue: UIVec3KF[] = [];
}

@ccclass('BaseUI')
export class BaseUI extends Component {
    @property({ type: UIAniSet, tooltip: '显示动画设置' })
    showUIAni: UIAniSet = null;

    @property({ type: UIAniSet, tooltip: '隐藏动画设置' })
    hideUIAni: UIAniSet = null;


    /** 动画队列索引 */
    aniQueueIndex: number = 0;
    private _isShow: boolean = false;
    protected onEnable(): void {
        this.registerEvent();
    }
    protected onDisable(): void {
        this.removeEvent();
    }

    /**注册事件 */
    protected registerEvent(): void {
    }

    /**移除事件 */
    protected removeEvent(): void {
    }

    show(callback?: Function) {
        // console.warn("动画开始显示：",this.node.name)
         this.init();
        // if(this._isShow){
        //     callback && callback();
        //     // console.warn("动画已显示：",this.node.name)
        //     return;
        // }
        this._isShow = true;


        this.aniQueueIndex = 0;
        this.node.active = true;
       
        const aniSet = this.showUIAni;
        if (!aniSet || aniSet.aniState === UIAniState.None) {
            if(callback && callback instanceof Function){
                callback();
            }
            return;
        }

        const aniNode = aniSet.aniNode || this.node;
        
        switch (aniSet.aniState) {
            case UIAniState.Scale:
                // console.warn("动画播放：Scale：",this.node.name)
                this.playScaleAni(aniNode, aniSet.scaleQueue, ()=>{
                    if(callback && callback instanceof Function){
                        callback();
                    }
                });
                break;
            case UIAniState.Fade:
                this.playFadeAni(aniNode, aniSet.fadeQueue, ()=>{
                    if(callback && callback instanceof Function){
                        callback();
                    }
                });
                break;
            case UIAniState.Move:
                this.playMoveAni(aniNode, aniSet.posQueue, ()=>{
                    if(callback && callback instanceof Function){
                        callback();
                    }
                });
                break;
            case UIAniState.Custom:
                this._playShowCustomAni(aniNode, ()=>{
                    if(callback && callback instanceof Function){
                        callback();
                    }
                });
                break;
        }
    }

    hide(callback?: Function) {
        this.aniQueueIndex = 0;
        // console.log("动画开始隐藏：",this.node.name)
        const aniSet = this.hideUIAni;
        if (!aniSet || aniSet.aniState === UIAniState.None) {
            // console.warn("动画开始隐藏：",this.node.name)
            this._hide();
            if(callback && callback instanceof Function){
                callback();
            }
         
            return;
        }

        const aniNode = aniSet.aniNode || this.node;


        switch (aniSet.aniState) {
            case UIAniState.Scale:
                this.playScaleAni(aniNode, aniSet.scaleQueue, ()=>{
                    if(callback && callback instanceof Function){
                        callback();
                    }
                    this._hide();
                });
                break;
            case UIAniState.Fade:
                this.playFadeAni(aniNode, aniSet.fadeQueue, ()=>{
                    if(callback && callback instanceof Function){
                        callback();
                    }
                    this._hide();
                });
                break;
            case UIAniState.Move:
                this.playMoveAni(aniNode, aniSet.posQueue, ()=>{
                    if(callback && callback instanceof Function){
                        callback();
                    }
                    this._hide();
                });
                break;
            case UIAniState.Custom:
                this._playHideCustomAni(aniNode, ()=>{
                    if(callback && callback instanceof Function){
                        callback();
                    }
                    this._hide();
                });
                break;
        }
    }
    private _hide(){
        // console.warn("动画隐藏：",this.node.name)
        UIMgr.getInstance().hideUINode(this.node);
    }

    /** 关闭界面 */
    private close() {
        AudioMgr.PlaySound(AudioName.BtnClick2);
        if(this._isShow){
            this._isShow = false;
            this.hide();
        }else{
            // console.warn("动画已隐藏：",this.node.name)
        }
    }

    protected playScaleAni(aniNode: Node, keyFrames: UIVec3KF[], callback?: Function) {
        if (!aniNode || !keyFrames || keyFrames.length <= 0) {
            callback && callback();
            return;
        }
        const kf = keyFrames[this.aniQueueIndex];
        if(!kf){
            callback && callback();
            return;
        }
        aniNode.scale = kf.target;
        this.aniQueueIndex++;
        if (this.aniQueueIndex >= keyFrames.length) {
            callback && callback();
            return;
        }
        const next = keyFrames[this.aniQueueIndex];
        tween(aniNode)
            .to(next.duration, { scale: next.target }, { easing: EASING_STR[next.easing] })
            .call(() => {
                this.playScaleAni(aniNode, keyFrames, callback);
            })
            .start();
    }

     protected playFadeAni(aniNode: Node, keyFrames: UINumKF[], callback?: Function) {
        if (!aniNode || !keyFrames || keyFrames.length <= 0) {
            callback && callback();
            return;
        }
        let uiOpacity = aniNode.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = aniNode.addComponent(UIOpacity);
        }
        const kf = keyFrames[this.aniQueueIndex];
        uiOpacity.opacity = kf.target;
        this.aniQueueIndex++;
        if (this.aniQueueIndex >= keyFrames.length) {
            callback && callback();
            return;
        }
        const next = keyFrames[this.aniQueueIndex];
        tween(uiOpacity)
            .to(next.duration, { opacity: next.target }, { easing: EASING_STR[next.easing] })
            .call(() => {
                this.playFadeAni(aniNode, keyFrames, callback);
            })
            .start();
    }

    protected playMoveAni(aniNode: Node, keyFrames: UIVec3KF[], callback?: Function) {
        if (!aniNode || !keyFrames || keyFrames.length <= 0) {
            callback && callback();
            return;
        }
        const kf = keyFrames[this.aniQueueIndex];
        aniNode.position = kf.target;
        this.aniQueueIndex++;
        if (this.aniQueueIndex >= keyFrames.length) {
            callback && callback();
            return;
        }
        const next = keyFrames[this.aniQueueIndex];
        tween(aniNode)
            .to(next.duration, { position: next.target }, { easing: EASING_STR[next.easing] })
            .call(() => {
                this.playMoveAni(aniNode, keyFrames, callback);
            })
            .start();
    }


    init() {
    }



    protected _playShowCustomAni(_aniNode: Node, callback?: Function) {
        callback && callback();
    }

    protected _playHideCustomAni(_aniNode: Node, callback?: Function) {
        callback && callback();
    }
}
