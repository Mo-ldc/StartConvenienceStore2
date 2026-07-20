import { _decorator, Button, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { LoanConfigData } from 'db://assets/Init/Scripts/Data/Data/ConfigData';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
const { ccclass, property } = _decorator;
@ccclass('LoanSet')
class LoanSet{
    @property({tooltip:"贷款键值"})
    loanKey: string = "";
    @property({type:SpriteFrame,tooltip:"贷款图标"})
    spriteFrame: SpriteFrame = null;
}
@ccclass('LoanNode')
export class LoanNode extends Component {
    /** 广告标识 */
    @property({type:Node,tooltip:"广告标识"})
    adNode:Node = null;

    /** 贷款文本 */     
    @property({type:Label,tooltip:"贷款文本"})
    loanLabel:Label = null;
    /** 金额文本 */
    @property({type:Label,tooltip:"金额文本"})
    amountLabel:Label = null;
    
    /** 利率文本 */
    @property({type:Label,tooltip:"利率文本"})
    rateLabel:Label = null;
    
    /** 贷款图标 */
    @property({type:Sprite,tooltip:"贷款图标"})
    loanIcon:Sprite = null;

    /** 贷款数据设置数组 */
    @property({type:LoanSet,tooltip:"贷款数据设置数组"})
    loanSetArray:LoanSet[] = [];

    @property({type:Node,tooltip:"贷款按钮"})
    btn:Node = null;

    init(loanData:LoanConfigData){
        this.loanLabel.string = loanData.loanKey;
        this.amountLabel.string = loanData.loanAmount.toString();
        this.rateLabel.string = (loanData.loanRate * 100) + "%";
        this.loanIcon.spriteFrame = this.loanSetArray.find(set => set.loanKey === loanData.loanKey)?.spriteFrame;
        const saveData = GameData.getLoanRecord(loanData.loanKey);
        if(loanData.needAd && saveData && saveData.adCount <= 0){
            this.adNode.active = true;
        }else{
            this.adNode.active = false;
        }
    }
}


