import { _decorator, assetManager, AudioClip, AudioSource, Component, director, Enum, Node } from 'cc';
import { GameData } from '../Data/Data/GameData';
import PausableTimeout from '../Tool/PausableTimeout';
import { DebugConfig } from '../Data/Configs/DebugConfig';

/**音频名 */
export enum AudioName {
    None = "",
    /** 主界面bgm  */
    Main = "bgm_main",

    /** 战斗胜利bgm  */
    Win = "bgm_win",
    /** 战斗失败bgm  */
    Lose = "bgm_lose",
    /** 按钮点击音效  */
    BtnClick = "btn",

    /** 完成步骤 */
    StepComplete = "step_complete",


    /** 客人来了 */
    GuestCome = "guest_come",
    /** 维修完成 */
    RepairComplete = "repair_complete",
    /** 手机翻转 */
    MobileFlip = "mobile_flip",

    /** 拿起零件 */
    PickPart = "pick_part",

    /** 工具 拧螺丝 */
    ToolScrew = "tool_screw",
    /** 工具 刮刀 */
    ToolScissors = "tool_scissors",
    /** 工具吸盘 */
    ToolVacuum = "tool_vacuum",
    /** 工具热风枪 */
    ToolHotAir = "tool_hot_air",
    /** 工具镊子 */
    ToolNippers = "tool_nippers",
    /** 工具 烙铁 */
    ToolIron = "tool_iron",
    /** 工具 喷液体 */
    ToolSpray = "tool_spray",
    /** 工具 擦拭（抹布） */
    ToolWipe = "tool_wipe",

    /** 花钱 */
    PayCoin = "pay_coin",
    /** 收钱 */
    ReceiveCoin = "receive_coin",

    /** 按钮2 点击计算机，点击勾，点击叉 */
    BtnClick2 = "btn2",

    /**按钮3 点击配件类型 弹窗选择 */
    BtnClick3 = "btn3",
    /** 点击切换模块 */
    BtnClick4 = "btn4",
};
Enum(AudioName)
const { ccclass, property } = _decorator;
@ccclass('AudioMgr')
export class AudioMgr extends Component {
    private static m_instance: AudioMgr = null;
    public static get instance(): AudioMgr {
        if (this.m_instance == null) {
            console.error('管理丢失，请查看是否存在AudioMgr节点');
            return null;
        }
        return this.m_instance;
    }

    static music_component_arr: AudioSource[] = [];
    static sound_component_arr: AudioSource[] = [];


    /**音频map容器 公共的音效资源 */
    private static m_audio_map: Map<string, AudioClip> = new Map();
    private static 最大组件数量 = 20;
    /** 
     * 当前播放音效的map 游戏内方面的 
     * 存储的数据 音效播放结束的Ts回调函数
     */
    public static m_audioSource_map:Map<AudioSource, PausableTimeout > = new Map();

    /**当前音乐名字 */
    public static current_music_name: string = "";

    onLoad() {
        AudioMgr.m_instance = this;
        director.addPersistRootNode(this.node); // 将AudioMgr节点设置为常驻节点
    }
    /**
     * 添加音频资源
     * @param key 音频资源的key
     * @param clip 音频资源
     * @param ispublic 是否公共音频资源
     */
    public static SetAudioClicp(key: string, clip: AudioClip): void {
        if (this.m_audio_map.has(key)) {
            // console.warn(`set fail: ${key} already exsit the audioMap`);
        } else {
            this.m_audio_map.set(key, clip);
            // console.log(`set ${key} in the audioMap`);
        }
    };

    /**获取音频资源*/
    public static GetAudioClicp(key: string): AudioClip {
        if (this.m_audio_map.has(key)) {
            // console.log(`get ${key} in the audioMap`);
            return this.m_audio_map.get(key);
        }
    };


    /**
     * 播放音乐
     * @param musickey 
     * @param callback 
     * @param is_loop 
     */
    public static PlayMusic(musickey: string, callback?: Function, is_loop: boolean = true) {
        if(this.current_music_name == musickey) {
            callback && callback();
            return;
        }
        if(DebugConfig.Is_Show_Audio_Info){
            console.log("开始播放音乐", musickey);
        }
        this.current_music_name = musickey;
        this._loadClip(this.music_component_arr, musickey, GameData.MusicVar, is_loop, callback);
    }
    /** 切换音乐 */
    public static OnlyPlayMusic(musickey: string,callback?: Function, is_loop: boolean = true) {
        if(this.current_music_name == musickey) {
            callback && callback();
            return;
        }
        if (this.current_music_name != "") {
            if (DebugConfig.Is_Show_Audio_Info) {
                console.log("停止播放音乐", AudioMgr.current_music_name);
            }
            AudioMgr.StopMusic();
        }
        if(DebugConfig.Is_Show_Audio_Info){
            console.log("开始播放音乐", musickey);
        }
        this.current_music_name = musickey;
        this._loadClip(this.music_component_arr, musickey, GameData.MusicVar, is_loop, callback);
    }
  
    /**
     * 播放音效
     * @param soundkey 
     * @param callback 
     * @param is_loop 
     */
    public static PlaySound(soundkey: string, callback?: Function, is_loop: boolean = false) {
        if(DebugConfig.Is_Show_Audio_Info){
            console.log("开始播放音效", soundkey);
        }
        this._loadClip(this.sound_component_arr, soundkey, GameData.SoundVar, is_loop, callback);
    }
    /**
     * 播放音效 不会重复播放
     * @param soundkey 
     * @param callback 
     * @param is_loop 
     * @param playNum 允许同时播放个数
     */
    public static OnlyPlaySound(soundkey: string, callback?: Function, is_loop: boolean = false, playNum: number = 1) {
        if(DebugConfig.Is_Show_Audio_Info){
            console.log("开始播放音效", soundkey);
        }
        let _playNum = 0;
        for (let i = 0; i < this.sound_component_arr.length; i++) {
            if (this.sound_component_arr[i].clip != null && this.sound_component_arr[i].clip.name == soundkey) {
                _playNum++;
                if(_playNum >= playNum){
                    callback && callback();
                    return;
                }
            }
        }
        this._loadClip(this.sound_component_arr, soundkey, GameData.SoundVar, is_loop, callback);
    }
    /**加载音频 */
    private static _loadClip(component_arr:AudioSource[], audiokey: string, audioVar: number, is_loop: boolean = false, callback?: Function) {
        let clip: AudioClip = this.GetAudioClicp(audiokey);
        if (clip == null) {
            let bundle = assetManager.getBundle("Audio");                                                                                                                                                                                                                                             
            if (bundle == null) {
                // console.error(`请先加载音效资源包`);
                callback && callback();
                return null!;
            }
            bundle.load(audiokey, AudioClip, (err: Error, clip: AudioClip) => {
                if (err) {
                    console.error(`音效资源加载失败: ${audiokey}`);
                    return null!;
                } else {
                    if(DebugConfig.Is_Show_Load_Info){
                        // console.log(`音效资源加载成功: ${audiokey}`);
                    }
                    this.SetAudioClicp(audiokey, clip);
                    this._addAudioSource(component_arr, clip, audioVar, is_loop, callback);
                }
            });
        } else {
            this._addAudioSource(component_arr, clip, audioVar, is_loop, callback);
        }
    }
    /**添加音频到音效组件 */
    private static _addAudioSource(component_arr:AudioSource[], clip: AudioClip, audioVar: number, is_loop: boolean = false, callback?: Function) {
        // console.log("节点",_addnode.name,"的组件数量",audioSourceArr.length);
        let audioSource: AudioSource = null;
        for (let i = 0; i < component_arr.length; i++) {
            if (component_arr[i].clip === null) {
                audioSource = component_arr[i];
                break;
            }
        }
        if (!audioSource ) {
            if(component_arr.length < this.最大组件数量){
                audioSource = this.instance.addComponent(AudioSource);
                component_arr.push(audioSource);
            }else{
                console.log("音频组件数量已满");
            }
            // audioSource = this.instance.addComponent(AudioSource);
            
        }
        if(!audioSource){
            console.error("音频组件为空");
            return;
        }
        audioSource.clip = clip;
        audioSource.loop = is_loop;
        audioSource.volume = audioVar;
        audioSource.play();
        if(DebugConfig.Is_Show_Audio_Info){
            console.log(`播放: ${clip.name}`);
        }

        let _callBack = callback;
        if(is_loop == false){
            _callBack = () => {
                callback && callback();
                audioSource.clip = null;
            }
        }
       this.SetTimeOut(clip, audioSource, _callBack);
 
    }
    /**设置音效的回调函数 */
    public static SetTimeOut(clip: AudioClip,audioSource:AudioSource,callback?: Function){
        let timeout:PausableTimeout = null;
        if(callback){
            if(this.m_audioSource_map.has(audioSource)){
                let timeout = this.m_audioSource_map.get(audioSource);
                if(timeout){
                    timeout.ClearTimeout();
                }
                this.m_audioSource_map.delete(audioSource);
            }
            let time = clip.getDuration();

            timeout = new PausableTimeout(callback,time * 1000)
        }
        this.m_audioSource_map.set(audioSource,timeout);
    }
    /**停止音乐 */
    public static StopMusic() {
        if(DebugConfig.Is_Show_Audio_Info){
            console.log("停止音乐");
        }
        this.current_music_name = "";
        this._stopAudioSource(this.music_component_arr);
    }
    public static StopOneSound(target:AudioSource|string) {
        switch (typeof target) {
            case 'string':
                for (let i = 0; i < this.sound_component_arr.length; i++) {
                    let audioSource = this.sound_component_arr[i];
                    let clip = audioSource.clip;
                    if (clip && clip.name == target) {
                        if(DebugConfig.Is_Show_Audio_Info)
                        console.log(`停止音效: ${clip.name}`);
                        audioSource.stop();
                        audioSource.clip = null;
                        if (this.m_audioSource_map.has(audioSource)) {
                            let timeout = this.m_audioSource_map.get(audioSource);
                            if (timeout) {
                                timeout.ClearTimeout();
                            }
                            this.m_audioSource_map.delete(audioSource);
                        }
                        break;
                    }else{
                        // console.error(`音效停止失败: ${target}`);
                    }
                }
                break;
            case 'object':
                target.stop();
                target.clip = null;
                if (this.m_audioSource_map.has(target)) {
                    let timeout = this.m_audioSource_map.get(target);

                    if (timeout) {
                        timeout.ClearTimeout();
                    }
                    this.m_audioSource_map.delete(target);
                    if (DebugConfig.Is_Show_Audio_Info) {
                        console.log(`停止音频： ${target.name} ,同时停止音频结束回调`);
                    }
                }
                break;
            default:
                if(DebugConfig.Is_Show_Audio_Info)
                console.error('音效停止失败: ');
                return;
        }
    }

    

    /**停止所有音效 */
    public static StopAllSound() {
        if(DebugConfig.Is_Show_Audio_Info){
            console.log("停止所有音效");
        }
        this._stopAudioSource(this.sound_component_arr);
    }

    private static _stopAudioSource(audioSourceArr:AudioSource[]) {
        for (let i = 0; i < audioSourceArr.length; i++) {
            audioSourceArr[i].stop();
            audioSourceArr[i].clip = null;

            if (this.m_audioSource_map.has(audioSourceArr[i])) {
                let timeout = this.m_audioSource_map.get(audioSourceArr[i]);
                if (timeout) {
                    timeout.ClearTimeout();
                }
                this.m_audioSource_map.delete(audioSourceArr[i]);
            }
        }
    }

    /**暂停音效 */
    public static PauseSound() {
        if(DebugConfig.Is_Show_Audio_Info){
            console.log("暂停音效");
        }
        this.m_audioSource_map.forEach((value: PausableTimeout, key: AudioSource) => {
            key && key.pause();
            value && value.Pause();
        });
    }
    /**恢复音效 */
    public static ReSumeSound() {
        if(DebugConfig.Is_Show_Audio_Info){
            console.log("恢复音效");
        }
        this.m_audioSource_map.forEach((value: PausableTimeout, key: AudioSource) => {
            key && key.play();
            value && value.ReSume();
        });
    }

    public static SetMusicVar(number:number){
        this.music_component_arr.forEach((value: AudioSource, index: number) => {
            value.volume = number;
        });
    }

    public static SetSoundVar(number:number){
        this.sound_component_arr.forEach((value: AudioSource, index: number) => {
            value.volume = number;
        });
    }

}


