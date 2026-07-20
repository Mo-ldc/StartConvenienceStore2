import { Enum } from "cc";

/** UI类型*/
export enum UIType
{
    空,
    页面,
    弹窗,
}
Enum( UIType );

/**UI位移方向 */
export enum UITransformDirection {
    向上,
    向下,
    向左,
    向右,
}
Enum( UITransformDirection );

/**游戏结算状态 */
export enum GameOverState {
    游戏中,
    失败,
    成功,
    时间结束失败,
}
Enum( GameOverState );
/**游戏状态 */
export enum GameState {
    运行,
    暂停,
    结算,
    // 其他状态...
}
Enum( GameState );



export enum Color{
    Red = "#ff0000",
    Green = "#00ff00",
    Blue = "#0000ff",
    Yellow = "#ffff00",
    Cyan = "#00ffff",
    Magenta = "#ff00ff",
    White = "#ffffff",
    Black = "#000000",
    Gray = "#808080",
    Orange = "#ffa500",
    Purple = "#800080",
    Pink = "#ffc0cb",
    Brown = "#a52a2a",
    Gold = "#ffd700",
    Silver = "#c0c0c0",
    Navy = "#000080",
    Teal = "#008080",
    Olive = "#808000",
    Indigo = "#4b0082",
    Violet = "#ee82ee",
    Turquoise = "#40e0d0",
}
Enum(Color);

/** 品质 */
export enum Quality {
    低 = 0,
    中 = 1,
    高 = 2,
}

/** 零件所在面 */
export enum PartSide {
    无 = 0,
    正面 = 1,
    背面 = 2,
}
Enum(PartSide);
