import { _decorator, Component, Node, Slider, Sprite, SpriteFrame } from 'cc';
import { GameData } from 'db://assets/Init/Scripts/Data/Data/GameData';
import { GameVar } from 'db://assets/Init/Scripts/Data/Store/GameVar';
import { AudioMgr, AudioName } from 'db://assets/Init/Scripts/Mgr/AudioMgr';
import { BaseUI } from 'db://assets/Init/Scripts/UI/Base/BaseUI';
const { ccclass, property } = _decorator;

@ccclass('uiSetting')
export class uiSetting extends BaseUI {

    /** 音乐滑块 */
    @property({ type: Slider, tooltip: "音乐滑块" })
    musicSlider: Slider = null;
    /** 音乐滑块底板 */
    @property({ type: Sprite, tooltip: "音乐滑块底板" })
    musicSliderBg: Sprite = null;


    /** 音效滑块 */
    @property({ type: Slider, tooltip: "音效滑块" })
    soundSlider: Slider = null;
    /** 音效滑块底板 */
    @property({ type: Sprite, tooltip: "音效滑块底板" })
    soundSliderBg: Sprite = null;


    show(callback?: Function): void {
        super.show(callback);
        GameVar.pause = true;
        // console.warn("uiSetting 游戏标签:", GameVar.pauseCount);
        this.initSlider();
    }
    hide(callback?: Function): void {
        super.hide(callback);
        GameVar.pause = false;
        // console.warn("uiSetting 游戏标签:", GameVar.pauseCount);
    }

    initSlider() {
        this.musicSlider.progress = GameData.MusicVar;
        this.soundSlider.progress = GameData.SoundVar;
        this.onChangeSliderMusic(this.musicSliderBg, GameData.MusicVar);
        this.onChangeSliderMusic(this.soundSliderBg, GameData.SoundVar);
    }
    /** 滑动音量 */
    onSliderMusic(slider: Slider) {
        let value = slider.progress;
        // console.log("音量:", value);
        AudioMgr.SetMusicVar(value);
        GameData.MusicVar = value;
        this.onChangeSliderMusic(this.musicSliderBg, value);
    }
    onSliderSound(slider: Slider) {
        let value = slider.progress;
        // console.log("音效:", value);
        AudioMgr.SetSoundVar(value);
        GameData.SoundVar = value;
        this.onChangeSliderMusic(this.soundSliderBg, value);
    }

    /** 改变图的 Range */
    onChangeSliderMusic(sprite: Sprite, value: number) {
        if(!sprite || value <= 0){
            return;
        }
        sprite.fillRange = value;
        
    }
}


