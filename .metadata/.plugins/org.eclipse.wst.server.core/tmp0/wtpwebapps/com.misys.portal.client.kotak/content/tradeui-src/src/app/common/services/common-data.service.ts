import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

  constructor() { }
  displayMode: string;
  mode: string;
  refId: string;
  tnxId: string;
  productCode: string;
  entity = '';
  applicant: string;
  isProdStatReject = false;
  viewComments = false;
  option: string;
  attIds: string;
  prodStatLabel: string;
  tnxTypeMap = new Map();
  isBankUser: boolean;
  operation: string;
  isMultiBank: boolean;
  masterorTnx: string;
  public disableTnx = false;
  subTnxTypeCode: string;
  prodStatCode: string;
  public isDecisionReject = false;
  enableLiabAmt: boolean;

  public getViewComments() {
    return this.viewComments;
  }
  public setViewComments(view: boolean) {
    this.viewComments = view;
  }

  public getDisplayMode(): string {
    return this.displayMode;
  }
  public setDisplayMode(displayMode) {
    this.displayMode = displayMode;
  }
  public getProductCode(): string {
    return this.productCode;
  }
  public setProductCode(productCode: string) {
    this.productCode = productCode;
  }
  public getProdStatCode(): string {
    return this.prodStatCode;
  }
  public setProdStatCode(prodStatCode: string) {
    this.prodStatCode = prodStatCode;
  }
  public getliabilityAmtFlag(): boolean {
    return this.enableLiabAmt;
  }
  public setliabilityAmtFlag(enableliabamt: boolean) {
    this.enableLiabAmt = enableliabamt;
  }
  public getMode(): string {
    return this.mode;
  }
  public setMode(mode) {
    this.mode = mode;
  }
 public getRefId(): string {
    return this.refId;
  }
  public setRefId(refId) {
    this.refId = refId;
  }
  public getTnxId(): string {
    return this.tnxId;
  }
  public setTnxId(tnxId) {
    this.tnxId = tnxId;
  }
  public setEntity(entity) {
    this.entity = entity;
  }
  public getEntity(): string {
    return this.entity;
  }
  public setApplicant(applicant) {
    this.applicant = applicant;
  }
  public getApplicant(): string {
    return this.applicant;
  }
  public setOption(option) {
    this.option = option;
  }

  public getOption(): string {
    return this.option;
  }
  public getAttIds(): any {
    return this.attIds;
  }
  public setAttIds(attIds) {
    this.attIds = attIds;
  }

  public getmasterorTnx(): string {
    return this.masterorTnx;
  }

  public setmasterorTnx(masterorTnx) {
    this.masterorTnx = masterorTnx;
  }

  public getTnxSubTypeCode(key): string {
    const tnxSubTypeMap = new Map();
    tnxSubTypeMap.set('01', 'Inc.');
    tnxSubTypeMap.set('02', 'Dec.');
    tnxSubTypeMap.set('03', 'Terms');
    tnxSubTypeMap.set('04', 'Upload');
    tnxSubTypeMap.set('05', 'Release');
    tnxSubTypeMap.set('08', 'Disc. Ack.');
    tnxSubTypeMap.set('09', 'Disc. Nack.');
    tnxSubTypeMap.set('24', 'Correspondence');
    tnxSubTypeMap.set('25', 'Request For Settlement');
    tnxSubTypeMap.set('62', 'Accept Claim');
    tnxSubTypeMap.set('63', 'Reject Claim');
    tnxSubTypeMap.set('66', 'Accept');
    tnxSubTypeMap.set('67', 'Reject');
    tnxSubTypeMap.set('68', 'Cancellation Request');
    tnxSubTypeMap.set('88', 'Wording Accepted.');
    tnxSubTypeMap.set('89', 'Wording Rejected.');
    return tnxSubTypeMap.get(key);
  }

  public getTnxTypeCode(key): string {
    this.tnxTypeMap.set('01', 'New');
    this.tnxTypeMap.set('02', 'Update');
    this.tnxTypeMap.set('03', 'Amend');
    this.tnxTypeMap.set('04', 'Extend');
    this.tnxTypeMap.set('05', 'Accept');
    this.tnxTypeMap.set('06', 'Confirm');
    this.tnxTypeMap.set('07', 'Consent');
    this.tnxTypeMap.set('08', 'Settle');
    this.tnxTypeMap.set('09', 'Transfer');
    this.tnxTypeMap.set('10', 'Drawdown');
    this.tnxTypeMap.set('11', 'Reverse');
    this.tnxTypeMap.set('12', 'Delete');
    this.tnxTypeMap.set('13', 'Message');
    this.tnxTypeMap.set('14', 'Cancel');
    this.tnxTypeMap.set('15', 'Reporting');
    this.tnxTypeMap.set('16', 'Reinstate');
    this.tnxTypeMap.set('17', 'Purge');
    this.tnxTypeMap.set('18', 'Presentation');
    this.tnxTypeMap.set('19', 'Assign');
    this.tnxTypeMap.set('20', 'Register');
    this.tnxTypeMap.set('21', 'Resubmission');
    this.tnxTypeMap.set('22', 'Report Activity');
    this.tnxTypeMap.set('23', 'Prepayment');
    this.tnxTypeMap.set('24', 'Charging Advice');
    this.tnxTypeMap.set('82', 'Error Report');
    this.tnxTypeMap.set('85', 'Invoice Settle');
    this.tnxTypeMap.set('86', 'Deal Name Change');
    this.tnxTypeMap.set('87', 'Facility Name Change');
    return this.tnxTypeMap.get(key);
  }

  public getSubTnxTypeCode(): string {
    return this.subTnxTypeCode;
  }
  public setSubTnxTypeCode(subTnxTypeCode: string) {
    this.subTnxTypeCode = subTnxTypeCode;
  }

  public getIsBankUser(): boolean {
    return this.isBankUser;
  }
  public setIsBankUser(isBankUser: boolean) {
    this.isBankUser = isBankUser;
  }

  public getOperation(): string {
    return this.operation;
  }
  public setOperation(operation: string) {
    this.operation = operation;
  }
  public isNotProcessed(): boolean {
    return this.isProdStatReject;
  }

  public setIsMultiBank(isMultiBank) {
    this.isMultiBank = isMultiBank;
  }
  public getIsMultiBank(): boolean {
    return this.isMultiBank;
  }
}
