/**
 * 玩家数据模型
 * 
 * 记录当前战局中玩家的实时状态
 * 由 EconomyService 管理货币，由 CtrPlay 管理选中角色
 */
export class PlayerModel {
    /** 当前货币数量 */
    currency: number = 0;
    /** 最大货币数量 */
    maxCurrency: number = 1000;

    /** 当前选中的角色键名（用于下次点击生成） */
    selectedRoleKey: string = '';

    /** 重置玩家数据（新一局开始前调用） */
    reset(): void {
        this.currency = 0;
        this.selectedRoleKey = '';
    }
}
