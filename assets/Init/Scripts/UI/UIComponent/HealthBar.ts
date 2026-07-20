import { _decorator, Component, Node, ProgressBar, UITransform } from 'cc';
import { BaseUIComponent } from './BaseUIComponent';
const { ccclass, property } = _decorator;

@ccclass('HealthBar')
export class HealthBar extends BaseUIComponent {
    @property(ProgressBar)
    private 生命值进度条: ProgressBar = null;
    public upDataContent(进度值: number): void {
        this.生命值进度条.progress = 进度值;
    }
}


