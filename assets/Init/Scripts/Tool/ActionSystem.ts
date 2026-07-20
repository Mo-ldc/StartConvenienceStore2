import { tween,Node, Vec3, UIOpacity, Sprite } from "cc";

export default class ActionSystem {
    /**
     * 永久摇动
     * @param {any} target          目标对象
     * @param {Number} duration     持续时间
     * @param {Number} range        晃动幅度
     * @param {Number} delayTime    停顿时间
     */
    public static shakeRepeat(target: Node, duration: number, range: number, delayTime: number): void {
        tween(target)
            .sequence(
                tween().by(duration, { angle: range }),
                tween().by(duration, { angle: -range }),
                tween().by(duration, { angle: -range }),
                tween().by(duration, { angle: range }),
                tween().delay(delayTime)
            )
            .repeatForever()
            .start()
    };

    /**
     * 永久转动
     * @param {any} target          目标对象
     * @param {Number} duration     旋转一圈所需时间
     */
    public static rotateRepeat(target: Node, duration: number): void {
        tween(target)
            .by(duration, { angle: 360 })
            .repeatForever()
            .start()
    };

    /**
     * 永久缩放
     * @param {any} target          目标对象
     * @param {Number} duration     持续时间
     * @param {Number} range        缩放幅度
     * @param {Number} delayTime    停顿时间
     */
    public static scaleRepeat(target: Node, duration: number, range: number, delayTime: number): void {
        tween(target)
            .sequence(
                tween().to(duration, { scale: 1 + range }),
                tween().to(duration, { scale: 1 }),
                tween().delay(delayTime)
            )
            .repeatForever()
            .start()
    };

  

    /**
     * 缩放节点
     * @param target                目标对象
     * @param duration              持续时间
     * @param range                 回弹幅度
     * @param delayTime             停顿时间
     */
    public static scale_Simple(target: Node, duration: number, startVal:number,endVal:number, delayTime: number,fun?:Function): void {
        target.setScale(new Vec3(startVal,startVal));
        tween(target)
            .delay(delayTime)
            .to(duration, { scale: new Vec3(endVal,endVal) }, { easing: "backOut" })
            .call(()=>{
                if(fun){
                    fun();
                }
            })
            .start()
    }

   
    /**
     * 简单往上（或者向下）移动到目标点
     * @param target
     * @param duration
     * @param startVal
     * @param targetX
     * @param delayTime
     */
    public static simple_MoveToY(target: Node, duration: number,startVal:Vec3,targetY:number,delayTime: number,fun?:Function):void{
        tween(target)
            .delay(delayTime)
            .to(duration, { position:new Vec3(startVal.x,targetY)})
            .call(()=>{
                if(fun)
                  fun();
            })
            .start()
    }

     /**
     * 简单往左（或者向右）移动到目标点
     * @param target
     * @param duration
     * @param startVal
     * @param targetX
     * @param delayTime
     */
     public static simple_MoveToX(target: Node, duration: number,startVal:Vec3,targetX:number,delayTime: number,fun?:Function):void{
        tween(target)
            .delay(delayTime)
            .to(duration, { position:new Vec3(targetX,startVal.y)})
            .call(()=>{
                if(fun)
                  fun();
            })
            .start()
    }

   
    /**
     *  渐隐渐出
     * @param target
     * @param duration 渐隐渐出时间
     * @param startOpa
     * @param enmOpa
     * @param delayTime 延迟时间
     * @param callback
     */
    public static fadeOut(target:Node,duration:number,startOpa:number,enmOpa:number,delayTime:number,callback?:Function):void{
        let opacityComponet = target.getComponent(UIOpacity); 
        if(opacityComponet==null){
            console.error(target.name, "未找到 opacity 组件");
            callback && callback();
            return;
        }
        opacityComponet.opacity=startOpa;
         tween(opacityComponet)
           .delay(delayTime)
           .to(duration,{opacity:enmOpa})
           .call(()=>{
              if(callback) callback();
           })
           .start()
    }

      /**
     * 简单旋转到某个角度
     * @param {any} target          目标对象
     * @param {Number} duration     旋转所需时间
     */
      public static rotate_Simple(target: Node, duration: number,angleVal:number,delayTime:number,fun?:Function): void {
        tween(target)
            .to(duration, { angle: angleVal })
            .call(()=>{
                if(fun) fun();
            })
            .start()
    };

    /**
     * 简单旋转到某个角度并移动移动一定距离
     * @param {any} target          目标对象
     * @param {Number} duration     旋转所需时间
    */
    public static rotate_Move(target: Node, duration: number,angleVal:number,startPosVal:Vec3,endPosVal:Vec3,delayTime:number,fun?:Function): void {
        tween(target)
            .delay(delayTime)
            .parallel(
                tween().to(duration, { angle: angleVal }),
                tween().to(duration, { position:new Vec3(endPosVal.x,endPosVal.y)})
            )
            .call(()=>{
                if(fun) fun();
            })
            .start()
    };


   /**
    * 简单移动移动一定距离
    * @param target             目标对象
    * @param duration           移动所需时间
    * @param startPosVal
    * @param endPosVal
    * @param delayTime
    * @param fun
    */
    public static move_Simper(target: Node, duration: number,startPosVal:Vec3,endPosVal:Vec3,delayTime:number,fun?:Function): void {
        tween(target)
            .delay(delayTime)
            .to(duration, { position:new Vec3(endPosVal.x,endPosVal.y)})
            .call(()=>{
                if(fun) fun();
            })
            .start()
    };

    /**
     * 渐隐或者渐显并移动移动一定距离
     * @param {any} target          目标对象
     * @param {Number} duration     旋转所需时间
     * @param {}
    */
    public static fadeOut_Move(target: Node, duration: number,opaVal:number,startPosVal:Vec3,endPosVal:Vec3,delayTime:number,fun?:Function): void {
        tween(target)
            .delay(delayTime)
            .parallel(
                tween().to(duration, { opacity: opaVal }),
                tween().to(duration, { position:new Vec3(endPosVal.x,endPosVal.y)})
            )
            .call(()=>{
                if(fun) fun();
            })
            .start()
    };

    /**
     * 放大或者缩小并移动移动一定距离
     * @param {any} target          目标对象
     * @param {Number} duration     旋转所需时间
     * @param {}
    */
    public static Scale_Move(target: Node, duration: number,scaleVal:number,startPosVal:Vec3,endPosVal:Vec3,delayTime:number,fun?:Function): void {
        tween(target)
            .delay(delayTime)
            .parallel(
                tween().to(duration, { scaleX: scaleVal,scaleY:scaleVal }),
                tween().to(duration, { position:new Vec3(endPosVal.x,endPosVal.y)})
            )
            .call(()=>{
                if(fun) fun();
            })
            .start()
    };

    /**
     *  渐变FillRange
     * @param aniNode 需要变化的目标对象
     * @param startFillRange 变化前的 FillRange
     * @param endFillRange 目标 FillRange
     * @param duration 变化时间
     * @param callBack 回调函数
     * @returns
     */
    public static ChangeFillRange(aniNode: Node, startFillRange: number = 0, endFillRange = 1, duration: number = 1, callBack?: Function) {
        if (aniNode == null) {
            callBack && callBack();
            return;
        }
        if (duration < 0) {
            duration = 0;
        }
        let sprite = aniNode.getComponent(Sprite);
        if (sprite) {
            sprite.fillRange = startFillRange;
            tween(sprite)
              .to(duration, { fillRange: endFillRange })
              .call(
                  () => {
                      callBack && callBack()
                  }
              )
              .start()
        }
        else {
            callBack && callBack();
            console.error(aniNode.name, "未找到 sprite 组件");
        }
    }


    /////下面是关卡类型需要的添加 标签tag 的版本缓动
    /**
     * 渐变FillRange
     * @param aniNode 需要变化的目标对象
     * @param fillStart 目标的开始 fillStart
     * @param startFillRange 变化前的 FillRange
     * @param endFillRange 目标 FillRange
     * @param duration 变化时间
     * @param delayTime 延迟时间
     * @param callBack 回调函数
     * @param tag 该缓动标签
     * @returns
     */
     public static ChangeFillRange_tag(
        aniNode: Node,
        fillStart:number = 0,
        startFillRange: number = 0,
        endFillRange = 1,
        duration: number = 1,
        delayTime:number=0,
        callBack?: Function,
        tag:number = -99
    ) {
        if (aniNode == null) {
            callBack && callBack();
            return;
        }
        if (duration < 0) {
            duration = 0;
        }
        let sprite = aniNode.getComponent(Sprite);
        if (sprite) {
            sprite.fillStart = fillStart;
            sprite.fillRange = startFillRange;
            tween(sprite)
              .tag(tag)
              .delay(delayTime)
              .to(duration, { fillRange: endFillRange })
              .call(
                  () => {
                      callBack && callBack()
                  }
              )
              .start()
        }
        else {
            callBack && callBack();
            console.error(aniNode.name, "未找到 sprite 组件");
        }
    }

    /**
     * 简单移动移动一定距离
     * @param target 目标对象
     * @param startX 初始x
     * @param startY 初始y
     * @param endX 目标x
     * @param endY 目标y
     * @param duration 执行时间
     * @param delayTime 延迟时间
     * @param callback 回调
     * @param tag 缓动标签
     */
    public static MoveSimper_tag(
        target: Node,
        startX:number = 0,
        startY:number = 0,
        endX:number = 0,
        endY:number = 0,
        duration: number=1,
        delayTime:number=0,
        callback?:Function,
        tag:number = -99
    ): void {
        target.setPosition(startX,startY);
        tween(target)
            .tag(tag)
            .delay(delayTime)
            .to(duration, { position:new Vec3(endX,endY)})
            .call(()=>{
                if(callback) callback();
            })
            .start()
    };


    /**
     * opacity 变化
     * @param target 变化的目标
     * @param startOpa 初始opacity
     * @param endOpa 目标opacity
     * @param duration 执行时间
     * @param delayTime 延迟时间
     * @param callback 回调
     * @param tag 这个缓动的标签
     */
     public static FadeOut_tag(
        target:Node,
        startOpa:number,
        endOpa:number,
        duration:number,
        delayTime:number = 0,
        callback?:Function,
        tag:number = -99
    ):void{
        let opacityComponet = target.getComponent(UIOpacity);
        if(opacityComponet==null){
            console.error(target.name, "未找到 opacity 组件");
            callback && callback();
            return;
        }
        opacityComponet.opacity=startOpa;
        tween(opacityComponet)
          .tag(tag)
          .delay(delayTime)
          .to(duration,{opacity:endOpa})
          .call(()=>{
             if(callback) callback();
          })
          .start()
   }


    /**
     *  角色呼吸
     * @param target 目标
     * @param startScaleY 目标初始的Y值
     * @param range 呼吸幅度
     * @param duration 呼吸持续时间
     * @param delayTime 呼吸延迟时间
     * @param tag 这个缓动的标签
     */
    public static RoseBreath_tag(
        target: Node,
        startScaleY:number,
        range:number,
        duration: number,
        delayTime: number = 0,
        tag:number = -99
    ): void {
        let t1 = tween(target).to(duration, { scale: new Vec3(target.scale.x, startScaleY, 1) });
        let t2 = tween(target).to(duration, { scale: new Vec3(target.scale.x, startScaleY + range, 1) });
        
        tween(target)
            .tag(tag)
            .sequence(
                t1,
                t2,
                tween().delay(delayTime)
            )
            .repeatForever()
            .start()
    };

  /**
     * 简单伸缩
     * @param target 伸缩的目标
     * @param startX 初始X
     * @param startY 初始Y
     * @param endX 目的X
     * @param endY 目的Y
     * @param duration 执行时间
     * @param delayTime 延时
     * @param callback 回调
     * @param tag 标签
     */
   public static Scale_Simple_tag(
       target: Node,
       startX: number,
       startY: number,
       endX: number,
       endY: number,
       duration: number,
       delayTime: number = 0,
       callback?: Function,
       tag:number = -99): void {
    target.setScale(startX,startY);
    tween(target)
        .tag(tag)
        .delay(delayTime)
        .to(duration, { scale: new Vec3(endX,endY) })
        .call(() => {
            if (callback) {
                callback();
            }
        })
        .start()
    }


    /**
     * 简单旋转
     * @param target 目标对象
     * @param duration 旋转到目标角度的所需时间
     * @param angleVal 需要旋转到的角度
     * @param delayTime 延迟
     * @param callback 回调
     * @param tag 该缓动的标签
     */
    public static Rotate_Simple_tag(
        target: Node,
        duration: number,
        angleVal:number,
        delayTime:number,
        callback?:Function,
        tag:number = -99): void {
        tween(target)
            .tag(tag)
            .delay(delayTime)
            .to(duration, { angle: angleVal })
            .call(()=>{
                if(callback) callback();
            })
            .start()
    };
}