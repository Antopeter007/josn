export class PurchaseOrder {
    constructor(
        public PurchaseOrderID: string,
        public PurchaseOrderDate: string,
        public PurchaseOrderLineItems: any = [],
        public PurchaseOrderTaxes: number,
        public columnsHeaderData: any,
        public columnsHeaders: any,
        public columns: any,
        public newlyPurchaseOrder: any,
        public grossAmount,
        public PurchaseOrderCreatedDate: Date,
        public POSortOrder: any
    ) { }
}

