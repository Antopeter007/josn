export const bankAttachmentCols = [
    { field: 'fileType', width: '6%'},
    { field: 'boReleaseDttm', width: '10%'},
    { field: 'event', width: '12%'},
    { field: 'eventStatus', width: '12%'},
    { field: 'title', width: '25%'},
    { field: 'fileName', width: '27%'},
    { field: 'action', width: '8%'},
  ];
export const attachmentColsForLn = [
  { field: 'fileType', width: '7%'},
  { field: 'boReleaseDttm', width: '8%'},
  { field: 'event', width: '20%'},
  { field: 'title', width: '30%'},
  { field: 'fileName', width: '27%'},
  { field: 'action', width: '8%'},
];
export const feeAndChargesCols =  [
    { field: 'boReleaseDttm', width: '13%'},
    { field: 'event', width: '8%'},
    { field: 'eventStatus', width: '9%'},
    { field: 'ChargeType', width: '8%'},
    { field: 'Description', width: '17%'},
    { field: 'tnx_cur_code', width: '9%'},
    { field: 'amount', width: '10%'},
    { field: 'chargeStatus', width: '12%'},
    { field: 'SettlementDate', width: '14%'}
  ];

export const documentsCols = [
  { field: 'event', width: '10%'},
  { field: 'eventStatus', width: '10%'},
  { field: 'documentType', width: '10%'},
  { field: 'documentName', width: '10%'},
  { field: 'documentNumber', width: '10%'},
  { field: 'documentDate', width: '10%'},
  { field: 'numOfOriginals', width: '10%'},
  { field: 'numOfPhotocopies', width: '10%'},
  { field: 'linkTo', width: '20%'}
];

export const documentsColsforELRL = [
  { field: 'event'},
  { field: 'documentType'},
  { field: 'documentName', width: '10%'},
  { field: 'numOfOriginals'},
  { field: 'numOfPhotocopies'}
];

export const documentsColsWithoutName = [
  { field: 'event', width: '10%'},
  { field: 'eventStatus', width: '10%'},
  { field: 'documentType', width: '10%'},
  { field: 'documentNumber', width: '10%'},
  { field: 'documentDate', width: '10%'},
  { field: 'numOfOriginals', width: '10%'},
  { field: 'numOfPhotocopies', width: '10%'},
  { field: 'total', width: '10%'},
  { field: 'linkTo', width: '20%'}
];

export const attachmentCols = [
  { field: 'fileType', width: '6%'},
  { field: 'boReleaseDttm', width: '10%'},
  { field: 'event', width: '12%'},
  { field: 'eventStatus', width: '12%'},
  { field: 'title', width: '20%'},
  { field: 'fileName', width: '20%'},
  { field: 'attachmentStatus', width: '12%'},
  { field: 'action', width: '8%'},
];

export interface PrincipalAccount {};
export const feesAndChargesHeader =  [
  { header: 'ChargeType', width: '15%'},
  { header: 'Description', width: '30%'},
  { header: 'tnx_cur_code', width: '10%'},
  { header: 'amount', width: '15%'},
  { header: 'tnx_stat_code', width: '15%'},
  { header: 'SettlementDate', width: '15%'}
];

export const documentsHeader = [
  { header: 'type'},
  { header: 'DocCode'},
  { header: 'DocNo'},
  { header: 'DocDate'},
  { header: 'firstMail'},
  { header: 'secondMail'},
  { header: 'total'},
  {header: 'mapAttach'}
];

export const childReferencesHeader = [
  { header: 'ChildRefId'}
];

export const FormTableHeader =  [
  { header: 'ChargeType'},
  { header: 'Description'},
  { header: 'tnx_cur_code'},
  { header: 'amount'},
  { header: 'tnx_stat_code'},
  { header: 'SettlementDate'}
];

export const variationsHeader =  [
  { header: 'variationFirstDate'},
  { header: 'operation'},
  { header: 'variationPct'},
  { header: 'variationAmtAndCurCode'}

];

export class ChargesDetailsRequest {
  public refId: string;
  public tnxId: string;
  public productCode: string;
  public masterOrTnx: string;

}

export const attachmentColsForSeLncds = [
  { field: 'fileType', width: '7%'},
  { field: 'date', width: '8%'},
  { field: 'docName', width: '20%'},
  { field: 'fileName', width: '30%'},
  { field: 'action', width: '5%'},
];

export const purchaseOrderCols = [
  { header: 'poNum'},
  { header: 'poDate'},
  { header: 'noOfItems'},
  { header: 'currency'},
  { header: 'netAmount'},
  { header: 'purchaseOrderTaxes'},
  { header: 'grossAmount'}
];

export const purchaseOrderLineItemCols = [
  {
    header: 'PurchaseOrderDescription'
  },
  {
    header: 'PurchaseOrderQuantityCode'
  },
  {
    header: 'PurchaseOrderQuantityWithValAndTolerance'
  },
  {
    header: 'PurchaseOrderPriceUnitWithValAndTolerance'
  },
  {
    header: 'PurchaseOrderAmount'
  }
];



