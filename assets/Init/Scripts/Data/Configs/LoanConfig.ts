import { LoanConfigData } from "../Data/ConfigData";

/** 贷款配置：分3档，每档可自主设置是否需要广告 */
export class LoanConfig {
    /** 贷款档位列表 */
    public static loanTiers: LoanConfigData[] = [
        { loanKey: "loan_5k", loanAmount: 5000, loanRate: 0.05, needAd: false },
        { loanKey: "loan_10k", loanAmount: 10000, loanRate: 0.1, needAd: false,  },
        { loanKey: "loan_50k", loanAmount: 50000, loanRate: 0.2, needAd: true, },
    ];

    /** 按档位键获取配置 */
    public static getTier(loanKey: string): LoanConfigData | null {
        return this.loanTiers.find(t => t.loanKey === loanKey) ?? null;
    }
}
