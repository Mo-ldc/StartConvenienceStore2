import { CCInteger, Enum } from 'cc';
import { EventHandler } from 'cc';
import { tween } from 'cc';
import { Vec3 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

// 缓动类型 同cocos内置缓动
export enum Ease
{
    constant,
    linear,
    quadIn,
    quadOut,
    quadInOut,
    cubicIn,
    cubicOut,
    cubicInOut,
    quartIn,
    quartOut,
    quartInOut,
    quintIn,
    quintOut,
    quintInOut,
    sineIn,
    sineOut,
    sineInOut,
    expoIn,
    expoOut,
    expoInOut,
    circIn,
    circOut,
    circInOut,
    elasticIn,
    elasticOut,
    elasticInOut,
    backIn,
    backOut,
    backInOut,
    bounceIn,
    bounceOut,
    bounceInOut,
    smooth,
    fade,
    quadOutIn,
    cubicOutIn,
    quartOutIn,
    quintOutIn,
    sineOutIn,
    expoOutIn,
    circOutIn,
    elasticOutIn,
    backOutIn,
    bounceOutIn,
}
Enum( Ease );

@ccclass( 'TweenAction' )
export class TweenAction extends Component
{
    @property( { displayName: '目标对象', displayOrder: -1, type: Node, tooltip: "目标对象" } )
    public target: Node;

    @property( { displayName: '动作时长', displayOrder: 0, type: CCInteger, tooltip: "动作时长" } )
    public duration: number = 0;

    @property( { displayName: '延迟时间', displayOrder: 1, type: CCInteger, tooltip: "延迟时间" } )
    public delayTime: number = 0;

    @property( { displayName: '执行次数', displayOrder: 2, type: CCInteger, tooltip: "执行次数" } )
    public repeat: number = 0;

    @property( { displayName: '缓动函数', displayOrder: 3, type: Ease, tooltip: "缓动函数" } )
    public ease: Ease = Ease.linear;

    @property( { displayName: '是否增量', displayOrder: 4, tooltip: "是否增量" } )
    public toOrby: boolean = true;

    @property( { displayName: '是否循环', displayOrder: 10,  tooltip: "是否增量" } )
    public isLoop: boolean = false;

    @property( { displayName: '位置', displayOrder: 5, tooltip: '位置' } )
    public position: Vec3 = new Vec3( 0, 0, 0 );

    @property( { displayName: '旋转', displayOrder: 6, tooltip: "旋转" } )
    public rotation: Vec3 = new Vec3( 0, 0, 0 );

    @property( { displayName: '缩放', displayOrder: 7, tooltip: "缩放" } )
    public scale: Vec3 = new Vec3( 1, 1, 1 );

    @property( { displayName: '回调方法', displayOrder: 8, type: EventHandler, tooltip: "回调方法" } )
    public callback: EventHandler = new EventHandler();

    @property( { displayName: '参数', displayOrder: 9, tooltip: "回调方法" } )
    public customEventData: string = '';

    start ()
    {
        if ( this.target == null )
        {
            this.target = this.node;
        }

        let opts = {};
        opts[ "easing" ] = Ease[ this.ease ].toString();

        if ( this.isLoop ) 
        {
            tween( this.target )
                .sequence
                (
                    tween().to( this.duration,
                        {
                            position: this.position,               // 位置缓动
                            scale: this.scale,                     // 缩放缓动
                            eulerAngles: this.rotation                       // 旋转缓动
                        },
                        opts ),
                    tween().to( this.duration,
                        {
                            position: -this.position,               // 位置缓动
                            scale: this.scale,                     // 缩放缓动
                            eulerAngles: this.rotation                       // 旋转缓动
                        },
                        opts ),
                    tween().delay( this.delayTime ),
                    tween().call( () =>
                    {
                        this.callback.emit( [ this.customEventData ] );
                    } ),
                )
                .repeatForever()
                .start();
        }
        else
        {
            if ( this.toOrby ) 
            {
                tween( this.target )
                    .sequence
                    (
                        tween().by( this.duration,
                            {
                                position: this.position,               // 位置缓动
                                scale: this.scale,                     // 缩放缓动
                                eulerAngles: this.rotation                       // 旋转缓动
                            },
                            opts ),

                        tween().delay( this.delayTime ),
                        tween().call( () =>
                        {
                            this.callback.emit( [ this.customEventData ] );
                        } ),
                    )
                    .repeat( this.repeat )
                    .start();
            }
            else
            {
                tween( this.target )
                    .sequence
                    (
                        tween().to( this.duration,
                            {
                                position: this.position,               // 位置缓动
                                scale: this.scale,                     // 缩放缓动
                                eulerAngles: this.rotation                       // 旋转缓动
                            },
                            opts ),

                        tween().delay( this.delayTime ),
                        tween().call( () =>
                        {
                            this.callback.emit( [ this.customEventData ] );
                        } ),
                    )
                    .repeat( this.repeat )
                    .start();
            }
        }
    }
}