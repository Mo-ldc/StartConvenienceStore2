/** 贷款缓存记录（以档位键为存储键，按游戏天缓存） */
export class LoanRecordData {
    /** 是否已贷 */
    hasLoaned: boolean = false;
    /** 已观看广告次数 */
    adCount: number = 0;
    /** 是否已还 */
    hasRepaid: boolean = false;
}

/** 对象存储数据  零件 商品 等*/
export class ObjectStorageData {
    /** 零件数量 */
    count: number = 0;
    /** 是否解锁 */
    isUnlocked: boolean = false;
}


