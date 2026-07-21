import { _decorator, Component, Enum, Label, Node } from 'cc';
import { AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('BtnNum')
export class BtnNum extends Component {
    /** 文本 */
    @property({ type: Label })
    btnLabel: Label = null;
    @property({ type: Node })
    btnNode: Node = null;

    /** 点击音效 */
    @property({ type: Enum(AudioName) })
    clickAudio: AudioName = AudioName.None;

    setLabel() {
        if (this.btnLabel) {
            this.btnLabel.string = this.node.name;
        }
    }
}


