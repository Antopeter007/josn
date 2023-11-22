export class PurchaseOrderLineItemMap {
    constructor(
        public PurchaseOrderDescription: string,
        public PurchaseOrderQuantityCode: string,
        public PurchaseOrderQuantityValue: number,
        public PurchaseOrderQuantityTolerancePos: number,
        public PurchaseOrderQuantityToleranceNeg: number,
        public PurchaseOrderQuantityPriceUnit: number,
        public PurchaseOrderPriceUnitPos: number,
        public PurchaseOrderQuantityPriceUnitNeg: number,
        public PurchaseOrderLineItemNumber: number,
        public PurchaseOrderLineItemCreatedDate: Date,
        public PurchaseOrderLineItemSortOrder: any      
        ) { }
}

