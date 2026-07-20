import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
/**成长公式工具 */
@ccclass('GrowthFormula')
export class GrowthFormula {
    /**
      * 多项式成长公式
      * @param level 当前等级
      * @param base 基础值
      * @param growthRate 成长系数 (k)
      * @param power 幂系数 (p)
      */
    static 成长公式_多项式(
        level: number,  
        base: number,
        growthRate: number,
        power: number = 1.0
    ): number {
        return base * Math.pow(1 + growthRate * level, power);
    }

    /**
     * 分段多项式成长公式
     * @param level 当前等级
     * @param base 基础值
     * @param configs 分段配置 [{maxLevel, growthRate, power}]
     */
    static 成长公式_分段多项式(
        level: number,
        base: number,
        configs: Array<{
            maxLevel: number;
            growthRate: number;
            power: number;
        }>
    ): number {
        let result = base;
        let remainingLevel = level;
        let lastBase = base;
        for (let i = 0; i < configs.length; i++) {
            const config = configs[i];
              if (remainingLevel <= 0) break;

            const levelsInSegment = Math.min(remainingLevel, config.maxLevel);
            result = lastBase * Math.pow(1 + config.growthRate * levelsInSegment, config.power);

            remainingLevel -= levelsInSegment;
            lastBase = result;
        }
        return result;
    }

    /**
     * 对数-线性混合公式
     * @param level 当前等级
     * @param base 基础值
     * @param linearRate 线性系数
     * @param logRate 对数系数
     */
    static 成长公式_线性对数(
        level: number,
        base: number,
        linearRate: number,
        logRate: number
    ): number {
        return base * (1 + linearRate * level + logRate * Math.log(1 + level));
    }

    /**
     * 指数平滑公式
     * @param level 当前等级
     * @param base 基础值
     * @param growthRate 每级增长率
     */
    static 成长公式_指数平滑(
        level: number,
        base: number,
        growthRate: number
    ): number {
        return base * Math.pow(1 + growthRate, level);
    }
}

