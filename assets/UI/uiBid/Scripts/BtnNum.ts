import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BtnNum')
export class BtnNum extends Component {
    /** 文本 */
    @property({ type: Label })
    btnLabel: Label = null;
    @property({ type: Node })
    btnNode: Node = null;


    setLabel() {
        if (this.btnLabel) {
            this.btnLabel.string = this.node.name;
        }
    }
}


