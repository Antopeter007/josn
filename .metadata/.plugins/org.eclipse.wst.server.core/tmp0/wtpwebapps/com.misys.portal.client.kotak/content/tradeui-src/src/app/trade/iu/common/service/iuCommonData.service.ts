import { CommonService } from '../../../../common/services/common.service';
import { Injectable } from '@angular/core';
import { IssuedUndertaking } from '../model/issuedUndertaking.model';
import { DropdownOptions } from '../model/DropdownOptions.model';
import { ConfigService } from '../../../../common/services/config.service';
import { Constants } from '../../../../common/constants';
import { BanktemplateDownloadRequest } from '../model/BanktemplateDownloadRequest';


@Injectable({ providedIn: 'root' })
export class IUCommonDataService {
  constructor(public commonService: CommonService, protected configService: ConfigService) { }
  banktemplateDownloadRequest: BanktemplateDownloadRequest;
  showLUSection = false;
  displayMode: string;
  masterorTnx: string;
  mode: string;
  refId: string;
  tnxId: string;
  tnxType: string;
  BOrefId: string;
  productCode = 'BG';
  orgData: IssuedUndertaking;
  bgCurCode: string;
  cuCurCode: string;
  beneficiary: string;
  expDate: string;
  subProdCode: any;
  purpose: any;
  cuSubProdCode: any;
  lastShipDate: string;
  subProductsList: string[];
  expDateType: string;
  cuExpDateType: string;
  viewComments = false;
  responseMessage: string;
  option: string;
  issuanceCharge: any;
  luIssuanceCharge: any;
  correspondentCharge: any;
  luCorrespondentCharge: any;
  confirmationCharge: any;
  luConfirmationCharge: any;
  attIds: string;
  tnxStatCode: string;
  prodStatLabel: string;
  facilityRefDetails: any;
  checkboxValuesMap = new Map();
  bankDetailsMap = new Map();
  tnxTypeMap = new Map();
  oldPurposeVal: string;
  isBeneMandatory: boolean;
  isXslTemplate: boolean;
  isSpecimenTemplate: boolean;
  isEditorTemplate: boolean;
  isFromBankTemplateOption: boolean;
  addr1: string;
  addr2: string;
  dom: string;
  country: string;
  bgAmdNo: string;
  bankTemplateID: string;
  templateUdertakingType: string;
  stylesheetname: string;
  documentId: string;
  speciman: string;
  guaranteeTextId: string;
  textTypeStandard: string;
  guaranteeTypeCompanyId: string;
  guaranteeTypeName: string;
  creditAvailBy: any;
  cuCreditAvailBy: any;
  bgRenewAmtCode: any;
  cuRenewAmtCode: any;
  bgVariationType: any;
  cuVariationType: any;
  advSendMode: any;
  public disableTnx = false;
  bankNameMap = new Map();

  public getAdvSendMode() {
    return this.advSendMode;
  }
  public setAdvSendMode(advSendMode) {
    this.advSendMode = advSendMode;
  }

  public getPurposeUI() {
    return this.purpose;
  }
  public setPurposeUI(purpose) {
    this.purpose = purpose;
  }

  public getVariationType(undertakingType) {
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      return this.bgVariationType;
    } else {
      return this.cuVariationType;
    }
  }

  public setVariationType(variationType, undertakingType) {
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      this.bgVariationType = variationType;
    } else {
      this.cuVariationType = variationType;
    }
  }

  public getRenewAmtCode(undertakingType) {
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      return this.bgRenewAmtCode;
    } else {
      return this.cuRenewAmtCode;
    }
  }

  public setRenewAmtCode(renewAmtCode, undertakingType) {
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
      this.bgRenewAmtCode = renewAmtCode;
    } else {
      this.cuRenewAmtCode = renewAmtCode;
    }
  }

  public getViewComments() {
    return this.viewComments;
  }

  public setViewComments(view: boolean) {
    this.viewComments = view;
  }
  setLUStatus(showLUSection: boolean) {
    if (showLUSection && this.configService.getCounterUndertakingEnabled()) {
      this.showLUSection = true;
    } else {
      this.showLUSection = false;
    }
  }

  displayLUSection() {
    return this.showLUSection;
  }

  public getDisplayMode(): string {
    return this.displayMode;
  }

  public getProductCode(): string {
    return this.productCode;
  }

  public setDisplayMode(displayMode) {
    this.displayMode = displayMode;
  }

  public getmasterorTnx(): string {
    return this.masterorTnx;
  }

  public setmasterorTnx(masterorTnx) {
    this.masterorTnx = masterorTnx;
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

  public setBORefId(BOrefId) {
    this.BOrefId = BOrefId;
  }

  public getBORefId(): string {
    return this.BOrefId;
  }

  public getTnxId(): string {
    return this.tnxId;
  }

  public setTnxId(tnxId) {
    this.tnxId = tnxId;
  }

   public getOrgData(): IssuedUndertaking {
    return this.orgData;
  }

  public setOrgData(orgData) {
    this.orgData = orgData;
  }

  public getTnxType(): string {
    return this.tnxType;
  }

  public setTnxType(tnxType) {
    this.tnxType = tnxType;
  }

  public setCurCode(curCode, undertakingType) {
    if (undertakingType === Constants.UNDERTAKING_TYPE_CU) {
      this.cuCurCode = curCode;
    } else {
      this.bgCurCode = curCode;
    }
  }

  public getCurCode(value): string {
    if (value === Constants.UNDERTAKING_TYPE_CU) {
      return this.cuCurCode;
    } else {
    return this.bgCurCode;
    }
  }

  public setExpDate(expDate) {
    this.expDate = expDate;
  }

  public getExpDate(): string {
    return this.expDate;
  }

  public setShipmentDate(shipmentDate) {
    this.lastShipDate = shipmentDate;
  }

  public getShipmentDate(): string {
    return this.lastShipDate;
  }

  public setFacilityRefDetails(facilityRefDetails) {
    this.facilityRefDetails = facilityRefDetails;
  }

  public getFacilityRefDetails(): string {
    return this.facilityRefDetails;
  }

  public setBeneficiary(beneficiary) {
    this.beneficiary = beneficiary;
  }

  public getBeneficiary(): string {
    return this.beneficiary;
  }

  public setBeneAdd1(addr1) {
    this.addr1 = addr1;
  }
  public setBeneAdd2(addr2) {
    this.addr2 = addr2;
  }
  public setBeneDom(dom) {
    this.dom = dom;
  }
  public setBeneCount(country) {
    return this.country;
  }

  public getBeneAdd1(): string {
    return this.addr1;
  }
  public getBeneAdd2(): string {
    return this.addr2;
  }
  public getBeneDom(): string {
    return this.dom;
  }
  public getBeneCount(): string {
    return this.country ;
  }

  public setResponseMessage(responseMessage) {
    this.responseMessage = responseMessage;
  }

  public getResponseMessage(): string {
    return this.responseMessage;
  }

  public setOption(option) {
    this.option = option;
  }

  public getOption(): string {
    return this.option;
  }

  public setCharges(charge, chargeType, undertakingType) {
    if (chargeType === 'issuance') {
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.issuanceCharge = charge;
      } else {
        this.luIssuanceCharge = charge;
      }
    } else if (chargeType === 'correspondent') {
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.correspondentCharge = charge;
      } else {
        this.luCorrespondentCharge = charge;
      }
    } else if (chargeType === 'confirmation') {
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.confirmationCharge = charge;
      } else {
        this.luConfirmationCharge = charge;
      }
    }
  }

  public getChargesForCommonAmount(chargeType, undertakingType) {
    if (chargeType === 'issuance') {
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        return this.issuanceCharge;
      } else {
        return this.luIssuanceCharge;
      }
    } else if (chargeType === 'correspondent') {
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        return this.correspondentCharge;
      } else {
        return this.luCorrespondentCharge;
      }
    } else if (chargeType === 'confirmation') {
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        return this.confirmationCharge;
      } else {
        return this.luConfirmationCharge;
      }
    }
  }

  public setCreditAvailBy(value, undertakingType) {
      if (undertakingType === 'bg') {
        this.creditAvailBy = value;
      } else {
        this.cuCreditAvailBy = value;
      }
  }

  public getCuCreditAvailBy() {
    return this.cuCreditAvailBy;
  }

  public getCreditAvailBy(key) {
    const creditAvailByMap = new Map();
    creditAvailByMap.set('06', 'LABEL_ON_DEMAND');
    creditAvailByMap.set('01', 'LABEL_PAYMENT');
    return creditAvailByMap.get(key);
}

  public getIssueDateTypeCode(key): string {
    const issDateTypeCodeMap = new Map();
    issDateTypeCodeMap.set('01', 'GENERALDETAILS_START_UPON_ISSUANCE');
    issDateTypeCodeMap.set('02', 'GENERALDETAILS_START_UPON_CONTRACT_SIGN');
    issDateTypeCodeMap.set('03', 'GENERALDETAILS_START_UPON_ADV_PAYMT');
    issDateTypeCodeMap.set('99', 'GENERALDETAILS_START_OTHER');
    return issDateTypeCodeMap.get(key);
  }

  public getPurpose(key): string {
    const purposeMap = new Map();
    purposeMap.set('01', 'GENERALDETAILS_UNDERTAKING');
    purposeMap.set('02', 'GENERALDETAILS_COUNTER_LOCAL_UNDERTAKING');
    purposeMap.set('03', 'GENERALDETAILS_COUNTERCOUNTER_AND_COUNTER_UNDERTAKING');
    purposeMap.set('04', 'GENERALDETAILS_ADVICE');
    purposeMap.set('05', 'GENERALDETAILS_ADVICE_CONFIRM');
    return purposeMap.get(key);
  }

  public getSubProductCode(key): string {
    const SubProductCode = new Map();
    SubProductCode.set('DGAR', 'AMOUNTDETAILS_DEMAND_GUARANTEE');
    SubProductCode.set('STBY', 'AMOUNTDETAILS_STAND_BY_LC');
    SubProductCode.set('DEPU', 'AMOUNTDETAILS_DEPENDENT_UNDERTAKING');
    return SubProductCode.get(key);
  }

  public getExpiryType(key): any {
    const expiryTypeMap = new Map();
    expiryTypeMap.set('01', 'GENERALDETAILS_END_DATE_NONE');
    expiryTypeMap.set('02', 'GENERALDETAILS_END_DATE_FIXED');
    expiryTypeMap.set('03', 'GENERALDETAILS_END_DATE_PROJECTED');

    if (key !== '' && key !== null ) {
      return expiryTypeMap.get(key);
    } else {
      const expiryTypeOptions = [];
      for (const mapKey of expiryTypeMap.keys()) {
        const expiryType = new DropdownOptions();
        expiryType.value = mapKey;
        expiryType.label = this.commonService.getTranslation(expiryTypeMap.get(mapKey));
        expiryTypeOptions.push(expiryType);
      }
      return expiryTypeOptions;
    }
  }


  // Renewal
  public getRenewOnCode(key): string {
    const renewOnCodeMap = new Map();
    renewOnCodeMap.set('01', 'EXTENSION_EXPIRY');
    renewOnCodeMap.set('02', 'EXTENSION_CALENDAR');
    return renewOnCodeMap.get(key);
  }

  public getRenewForPeriod(key): string {
    const renewForPeriodMap = new Map();
    renewForPeriodMap.set('D', 'EXTENSION_EXTEND_FOR_DAYS');
    renewForPeriodMap.set('W', 'EXTENSION_EXTEND_FOR_WEEKS');
    renewForPeriodMap.set('M', 'EXTENSION_EXTEND_FOR_MONTHS');
    renewForPeriodMap.set('Y', 'EXTENSION_EXTEND_FOR_YEARS');
    return renewForPeriodMap.get(key);
  }

  public getRollingRenewOnCode(key): string {
    const rollingRenewOnCodeMap = new Map();
    rollingRenewOnCodeMap.set('01', 'EXTENSION_EXPIRY');
    rollingRenewOnCodeMap.set('02', 'EXTENSION_CALENDAR_DATE');
    return rollingRenewOnCodeMap.get(key);
  }

  public getRollingRenewForPeriod(key): string {
    const rollingRenewForPeriodMap = new Map();
    rollingRenewForPeriodMap.set('D', 'EXTENSION_EXTEND_FOR_DAYS');
    rollingRenewForPeriodMap.set('W', 'EXTENSION_EXTEND_FOR_WEEKS');
    rollingRenewForPeriodMap.set('M', 'EXTENSION_EXTEND_FOR_MONTHS');
    rollingRenewForPeriodMap.set('Y', 'EXTENSION_EXTEND_FOR_YEARS');
    return rollingRenewForPeriodMap.get(key);
  }

// Undertaking
  public getUndertakingType(key): string {
    const undertakingTypeMap = new Map();
    undertakingTypeMap.set('01', 'ADVANCE_PAYMENT');
    undertakingTypeMap.set('02', 'BILL_OF_LADING');
    undertakingTypeMap.set('03', 'CUSTOMS');
    undertakingTypeMap.set('04', 'DIRECT_PAY');
    undertakingTypeMap.set('05', 'INSURANCE');
    undertakingTypeMap.set('06', 'JUDICIAL');
    undertakingTypeMap.set('07', 'LEASE');
    undertakingTypeMap.set('08', 'PAYMENT');
    undertakingTypeMap.set('09', 'PERFORMANCE');
    undertakingTypeMap.set('10', 'RETENTION');
    undertakingTypeMap.set('11', 'SHIPPING');
    undertakingTypeMap.set('12', 'TENDER/BID');
    undertakingTypeMap.set('13', 'WARRANTY/MAINTENANCE');
    undertakingTypeMap.set('99', 'ANY_OTHER_LOCAL_UNDERTAKING_TYPE');
    return undertakingTypeMap.get(key);
  }

  public getRulesApplicable(key): string {
  const rulesApplicableMap = new Map();
  rulesApplicableMap.set('06', 'RULES_APPLICABLE_URDG');
  rulesApplicableMap.set('07', 'RULES_APPLICABLE_ISPR');
  rulesApplicableMap.set('99', 'RULES_APPLICABLE_OTHR');
  rulesApplicableMap.set('09', 'RULES_APPLICABLE_NONE');
  rulesApplicableMap.set('10', 'RULES_APPLICABLE_UCPR');
  return rulesApplicableMap.get(key);
  }

  public getDemandIndicator(key): string {
    const demandIndicatorMap = new Map();
    demandIndicatorMap.set('NMLT', 'DEMAND_INDICATOR_NMLT');
    demandIndicatorMap.set('NMPT', 'DEMAND_INDICATOR_NMRT');
    demandIndicatorMap.set('NPRT', 'DEMAND_INDICATOR_NPRT');
    demandIndicatorMap.set('PMPT', 'DEMAND_INDICATOR_PMPT');
    return demandIndicatorMap.get(key);
  }

  public getUndertakingText(key): string {
    const undertakingTextMap = new Map();
    undertakingTextMap.set('01', 'BANK_STANDARD');
    undertakingTextMap.set('02', 'BENEFICIARY_WORDING');
    undertakingTextMap.set('03', 'OUR_WORDING');
    undertakingTextMap.set('04', 'SAME_AS_SPECIFY');
    return undertakingTextMap.get(key);
  }

  public getTextLanguage(key): string {
    const textLanguageMap = new Map();
    textLanguageMap.set(Constants.LANGUAGE_EN, 'English_(UK)');
    textLanguageMap.set(Constants.LANGUAGE_FR, 'French_(Français)');
    textLanguageMap.set(Constants.LANGUAGE_AR, 'Arabic');
    textLanguageMap.set(Constants.LANGUAGE_US, 'English_(US)');
    textLanguageMap.set('*', 'Other');
    return textLanguageMap.get(key);
  }

  public getSpecialTerms(key): string {
    const specialTermsMap = new Map();
    specialTermsMap.set('01', 'TERMS_OF_EFFECTIVENESS');
    specialTermsMap.set('02', 'TERMS_OF_REDUCTION');
    specialTermsMap.set('03', 'TERMS_OF_EFFECTIVENESS_AND_REDUCTION');
    specialTermsMap.set('04', 'TERMS_OF_NONE');
    return specialTermsMap.get(key);
  }

  // Bank
  public getIssuingInstructions(key): string {
    const issuingInstructionsMap = new Map();
    issuingInstructionsMap.set('01', 'ISSUING_INSTR_DIRECT');
    issuingInstructionsMap.set('02', 'ISSUING_INSTR_INDIRECT');
    return issuingInstructionsMap.get(key);
  }
  // Instructions to bank
  public getTransmissionMethod(key): any {
   const transmissionMethod = [
    {label: this.commonService.getTranslation('INSTRUCTIONS_ADV_SEND_MODE_SWIFT'), value: '01'},
    {label: this.commonService.getTranslation('INSTRUCTIONS_ADV_SEND_MODE_TELEX'), value: '02'},
    {label: this.commonService.getTranslation('INSTRUCTIONS_ADV_SEND_MODE_COURIER'), value: '03'},
    {label: this.commonService.getTranslation('INSTRUCTIONS_ADV_SEND_MODE_OTHER'), value: '99'}
      ];
   const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
          obj[item[keyField]] = item;
          return obj;
   }, {});
   if (key !== '' && key !== null ) {
      const obj = arrayToObject(transmissionMethod, 'value');
      if (obj[key] && obj[key] != null && obj[key] !== '') {
        return obj[key].label;
      } else {
        return obj[key];
      }
    } else {
      return transmissionMethod;
    }
  }

  public getOriginalUndertakingDel(key): string {
    const originalUndertakingDelMap = new Map();
    originalUndertakingDelMap.set('01', 'BY_COLLECTION');
    originalUndertakingDelMap.set('02', 'BY_COURIER');
    originalUndertakingDelMap.set('03', 'BY_MAIL');
    originalUndertakingDelMap.set('04', 'BY_MESSENGER');
    originalUndertakingDelMap.set('05', 'BY_REGISTERED_MAIL');
    originalUndertakingDelMap.set('99', 'BY_OTHER');
    return originalUndertakingDelMap.get(key);
  }

  public getDeliveryTo(key): any {
    const deliveryToObj = [
      {label: this.commonService.getTranslation('INSTRUCTIONS_DELIVERY_TO_OURSELVES'), value: '01'},
      {label: this.commonService.getTranslation('INSTRUCTIONS_DELIVERY_TO_REPRESENTATIVE'), value: '02'},
      {label: this.commonService.getTranslation('INSTRUCTIONS_DELIVERY_TO_BENEFICIARY'), value: '03'},
      {label: this.commonService.getTranslation('INSTRUCTIONS_DELIVERY_TO_OTHER'), value: '04'},
      {label: this.commonService.getTranslation('INSTRUCTIONS_DELIVERY_TO_AGENT'), value: '05'}
    ];
    const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
          obj[item[keyField]] = item;
          return obj;
   }, {});
    if (key !== '' && key !== null ) {
      const obj = arrayToObject(deliveryToObj, 'value');
      if (obj[key] && obj[key] != null && obj[key] !== '') {
        return obj[key].label;
      } else {
        return obj[key];
      }
    } else {
      return deliveryToObj;
    }
  }

  public getSendAttachments(key): string {
    const sendAttachmentsMap = new Map();
    sendAttachmentsMap.set('FACT', 'SEND_ATTACHMENT_FACT');
    sendAttachmentsMap.set('FAXT', 'SEND_ATTACHMENT_FAXT');
    sendAttachmentsMap.set('EMAL', 'SEND_ATTACHMENT_EMAL');
    sendAttachmentsMap.set('MAIL', 'SEND_ATTACHMENT_MAIL');
    sendAttachmentsMap.set('COUR', 'SEND_ATTACHMENT_COUR');
    sendAttachmentsMap.set('HOST', 'SEND_ATTACHMENT_HOST');
    sendAttachmentsMap.set('OTHR', 'SEND_ATTACHMENT_OTHR');
    return sendAttachmentsMap.get(key);
  }

  public getCharges(key): string {
    const chargesMap = new Map();
    chargesMap.set('01', 'CHRGDETAILS_APPLICANT');
    chargesMap.set('02', 'CHRGDETAILS_BENEFICIARY');
    return chargesMap.get(key);
  }

  public getConfirmationInstructions(key): string {
    const chargesMap = new Map();
    chargesMap.set('01', 'AMOUNTDETAILS_CFM_INST_CONFIRM');
    chargesMap.set('02', 'AMOUNTDETAILS_CFM_INST_MAY_ADD');
    chargesMap.set('03', 'AMOUNTDETAILS_CFM_INST_WITHOUT');
    return chargesMap.get(key);
  }

  public getRenewalAmount(key): string {
    const renewalAmtMap = new Map();
    renewalAmtMap.set('01', 'EXTENSION_ORIGINAL_AMOUNT');
    renewalAmtMap.set('02', 'EXTENSION_CURRENT_AMOUNT');
    return renewalAmtMap.get(key);
  }

  public getCheckboxBooleanValues(key): string {
    const checkboxValuesMap = new Map();
    checkboxValuesMap.set('Y', true);
    checkboxValuesMap.set('N', false);
    return checkboxValuesMap.get(key);
  }

  public getAmendPurpose(key): string {
    const amendPurposeMap = new Map();
    amendPurposeMap.set('01', 'AMENDMENT_PURPOSE_01');
    amendPurposeMap.set('02', 'AMENDMENT_PURPOSE_02');
    amendPurposeMap.set('03', 'AMENDMENT_PURPOSE_02');
    return amendPurposeMap.get(key);
  }

  public getContractReference(key): any {
    const contractReferences = [
      {label: this.commonService.getTranslation('KEY_TENDER'), value: 'TEND'},
      {label: this.commonService.getTranslation('KEY_ORDER'), value: 'ORDR'},
      {label: this.commonService.getTranslation('KEY_CONTRACT'), value: 'CONT'},
      {label: this.commonService.getTranslation('KEY_OFFER'), value: 'OFFR'},
      {label: this.commonService.getTranslation('KEY_DELIVERY'), value: 'DELV'},
      {label: this.commonService.getTranslation('KEY_PROFORMA_INVOICE'), value: 'PINV'},
      {label: this.commonService.getTranslation('KEY_PROJECT'), value: 'PROJ'}
     ];
    const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
          obj[item[keyField]] = item;
          return obj;
   }, {});
    if (key !== '' && key !== null ) {
      const obj = arrayToObject(contractReferences, 'value');
      if (obj[key] && obj[key] != null && obj[key] !== '') {
        return obj[key].label;
      } else {
        return obj[key];
      }
    } else {
    return contractReferences;
    }
  }

  public getCheckboxFlagValues(key): string {
    this.checkboxValuesMap.set(true, 'Y');
    this.checkboxValuesMap.set(false, 'N');
    this.checkboxValuesMap.set('', 'N');
    return this.checkboxValuesMap.get(key);
  }

  public getReasonReductionRelease(key): string {
    const reasonReductionRelease = new Map();
    reasonReductionRelease.set('BUFI', 'Underlying Business Finished');
    reasonReductionRelease.set('WOEX', 'Warranty Obligation Period Expired');
    reasonReductionRelease.set('NOAC', 'Non Acceptance of a Tender');
    reasonReductionRelease.set('REFU', 'Reduction Clause Fulfilled');
    reasonReductionRelease.set('OTHR', 'Other');
    return reasonReductionRelease.get(key);
  }

  public getCustomerIdentifier(key): string {
    const custIds = new Map();
    custIds.set('BICC', 'BIC');
    custIds.set('OTHR', 'Other');
    return custIds.get(key);
  }

  public setExpDateType(expDateType, underakingType) {
    if (underakingType === Constants.UNDERTAKING_TYPE_CU) {
      this.cuExpDateType = expDateType;
    } else {
      this.expDateType = expDateType;
    }
  }
   // There are many other Transaction Sub-Type Codes(N003). Added only the required one's for amendment.
  public getTnxSubTypeCode(key): string {
    const tnxSubTypeMap = new Map();
    tnxSubTypeMap.set('01', 'Inc.');
    tnxSubTypeMap.set('02', 'Dec.');
    tnxSubTypeMap.set('03', 'Terms');
    tnxSubTypeMap.set('04', 'Upload');
    tnxSubTypeMap.set('05', 'Release');
    tnxSubTypeMap.set('08', 'Disc. Ack.');
    tnxSubTypeMap.set('09', 'Disc. Nack.');
    tnxSubTypeMap.set('20', 'KEY_EXTEND');
    tnxSubTypeMap.set('21', 'KEY_PAY');
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

  public getProdStatusCode(key): string {
    const prodStatCodeMap = new Map();
    prodStatCodeMap.set('01', 'REJECTED');
    prodStatCodeMap.set('02', 'PENDING');
    prodStatCodeMap.set('03', 'NEW');
    prodStatCodeMap.set('04', 'ACCEPTED');
    prodStatCodeMap.set('05', 'SETTLED');
    prodStatCodeMap.set('06', 'CANCELLED');
    prodStatCodeMap.set('07', 'UPDATED');
    prodStatCodeMap.set('08', 'AMENDED');
    prodStatCodeMap.set('09', 'EXTENDED');
    prodStatCodeMap.set('10', 'PURGED');
    prodStatCodeMap.set('11', 'RELEASED');
    prodStatCodeMap.set('12', 'DISCREPANT');
    prodStatCodeMap.set('13', 'PART_SETTLED');
    prodStatCodeMap.set('14', 'PART_SIGHT_PAID');
    prodStatCodeMap.set('15', 'SIGHT_PAYMENT');
    prodStatCodeMap.set('16', 'NOTIFICATION_OF_CHARGES');
    prodStatCodeMap.set('17', 'VERSION_DONE');
    prodStatCodeMap.set('18', 'INPROGRESS');
    prodStatCodeMap.set('19', 'TRACER');
    prodStatCodeMap.set('20', 'PENDING_CONSENT');
    prodStatCodeMap.set('21', 'UTILIZED');
    prodStatCodeMap.set('42', 'EXPIRED');
    prodStatCodeMap.set('23', 'PAID');
    prodStatCodeMap.set('24', 'REQUEST_FOR_SETTLEMENT');
    prodStatCodeMap.set('26', 'ADVISE_OF_BILL_ARRIVAL_CLEAN');
    prodStatCodeMap.set('31', 'AMENDMENT_AWAITING_BENEFICIARY_APPROVAL');
    prodStatCodeMap.set('32', 'AMENDMENT_REFUSED');
    prodStatCodeMap.set('33', 'PAYMENT_REFUSED');
    prodStatCodeMap.set('34', 'GENERAL_REQUEST');
    prodStatCodeMap.set('78', 'WORDING_UNDER_REVIEW');
    prodStatCodeMap.set('79', 'FINAL_WORDING');
    prodStatCodeMap.set('80', 'RENEWED');
    prodStatCodeMap.set('81', 'CANCEL_AWAITING_COUNTERPARTY_RESPONSE');
    prodStatCodeMap.set('82', 'CANCEL_REFUSED');
    prodStatCodeMap.set('84', 'CLAIM_PRESENTATION');
    prodStatCodeMap.set('85', 'CLAIM_SETTLEMENT');
    prodStatCodeMap.set('86', 'EXTEND_PAY');
    prodStatCodeMap.set('87', 'CLAIM_ACCEPTED');
    prodStatCodeMap.set('88', 'CLAIM_REJECTED');
    prodStatCodeMap.set('98', 'PROVISIONAL');
    prodStatCodeMap.set('B5', 'ADVISE_OF_EXTENSION');
    prodStatCodeMap.set('B7', 'PERIODIC_CHARGE_ADVISE');
    prodStatCodeMap.set('C1', 'ADVICE');
    prodStatCodeMap.set('C3', 'ADVISE_REDUCTION_INCREASE');
    prodStatCodeMap.set('C4', 'REDUCTION_INCREASE');
    prodStatCodeMap.set('E9', 'MAINTENANCE_CHARGE_ADVISE');
    return prodStatCodeMap.get(key);
  }

  public getActionReqCode(key): string {
    const actionReqCodeMap = new Map();
    actionReqCodeMap.set('03', 'AMENDMENT_RESPONSE');
    actionReqCodeMap.set('05', 'CANCEL_RESPONSE');
    actionReqCodeMap.set('07', 'CONSENT_RESPONSE');
    actionReqCodeMap.set('12', 'DISCREPANCY_RESPONSE');
    actionReqCodeMap.set('99', 'CUSTOMER_INSTRUCTIONS');
    actionReqCodeMap.set('26', 'CLEAN_RESPONSE');
    return actionReqCodeMap.get(key);
  }

  public getChargeStatus(key): string {
    const chargeStatusCodeMap = new Map();
    chargeStatusCodeMap.set('01', 'CHARGE_STATUS_01');
    chargeStatusCodeMap.set('02', 'CHARGE_STATUS_02');
    chargeStatusCodeMap.set('03', 'CHARGE_STATUS_03');
    chargeStatusCodeMap.set('99', 'CHARGE_STATUS_99');
    return chargeStatusCodeMap.get(key);
  }

  public getChargeType(key): any {
    const chargeTypeCodeObj = [
      {label: this.commonService.getTranslation('CHARGE_TYPE_ISSFEE'), value: 'ISSFEE'},
      {label: this.commonService.getTranslation('CHARGE_TYPE_COMMISSION'), value: 'COMMISSION'},
      {label: this.commonService.getTranslation('CHARGE_TYPE_OTHER'), value: 'OTHER'},
      {label: this.commonService.getTranslation('CHARGE_TYPE_PCH'), value: 'PCH'},
      {label: this.commonService.getTranslation('CHARGE_TYPE_MCH'), value: 'MCH'}
    ];
    const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
          obj[item[keyField]] = item;
          return obj;
   }, {});
    if (key !== '' && key !== null ) {
      const obj = arrayToObject(chargeTypeCodeObj, 'value');
      if (obj[key] && obj[key] != null && obj[key] !== '') {
        return obj[key].label;
      } else {
        return obj[key];
      }
    } else {
      return chargeTypeCodeObj;
    }
  }

  public setSubProdCode(subProdCode, underakingType) {
    if (underakingType === Constants.UNDERTAKING_TYPE_CU) {
      this.cuSubProdCode = subProdCode;
    } else {
      this.subProdCode = subProdCode;
    }
  }
  public getSubProdCode(): any {
    return this.subProdCode;
  }
  public getCUSubProdCode(): any {
    return this.cuSubProdCode;
  }
  public getCUExpDateType(): any {
    return this.cuExpDateType;
  }
  public getExpDateType(): any {
    return this.expDateType;
  }
  public getAttIds(): any {
    return this.attIds;
  }
  public setAttIds(attIds) {
    this.attIds = attIds;
  }
  public getTnxStatCode(): any {
    return this.tnxStatCode;
  }
  public setTnxStatCode(tnxStatCode) {
    this.tnxStatCode = tnxStatCode;
  }

  public setBankDetails(bankDetails) {
    this.bankDetailsMap.clear();
    bankDetails.forEach(element => {
      this.bankDetailsMap.set(element.bankId, element.bankname);
    });
  }
  public getBankDetails(bankId) {
    return this.bankDetailsMap.get(bankId);
  }

  public setOldPurposeVal(purposeVal) {
    this.oldPurposeVal = purposeVal;
  }

  public getOldPurposeVal(): any {
    return this.oldPurposeVal ;
  }

  public setBeneMandatoryVal(isBeneMandatory) {
    this.isBeneMandatory = isBeneMandatory;
  }

  public getBeneMandatoryVal(): boolean {
    return this.isBeneMandatory;
  }

  public setPreviewOption(option) {
    this.option = option;
  }

  public getPreviewOption(): any {
    return this.option;
  }

  public getRenewalType(key): any {
    const renewalTypeCodeObj = [
      {label: this.commonService.getTranslation('EXTENSION_TYPE_REGULAR'), value: '01'},
      {label: this.commonService.getTranslation('EXTENSION_TYPE_IRREGULAR'), value: '02'}
    ];
    const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
          obj[item[keyField]] = item;
          return obj;
   }, {});
    if (key !== '' && key !== null ) {
      const obj = arrayToObject(renewalTypeCodeObj, 'value');
      if (obj[key] && obj[key] != null && obj[key] !== '') {
        return obj[key].label;
      } else {
        return obj[key];
      }
    } else {
      return renewalTypeCodeObj;
    }
}

public getReductionOperationType(key): string {
  const reductionOperationTypeMap = new Map();
  reductionOperationTypeMap.set('01', 'INCREASE');
  reductionOperationTypeMap.set('02', 'DECREASE');
  return reductionOperationTypeMap.get(key);
}

public getReductionEventType(key): string {
  const reductionEventTypeMap = new Map();
  reductionEventTypeMap.set('01', 'REGULAR');
  reductionEventTypeMap.set('02', 'IRREGULAR');
  return reductionEventTypeMap.get(key);
}

public getBgAmdNo(bgAmdNo): string {
  const sliceIndex = -3;
  const leadingZero = '000';
  if (bgAmdNo !== '' && bgAmdNo !== null && bgAmdNo !== 'undefined') {
    this.bgAmdNo = (leadingZero + bgAmdNo).slice(sliceIndex);
  }
  return this.bgAmdNo;
}

  public getCrAvailByBankName(key): string {
    const crAvailByBankMap = new Map();
    crAvailByBankMap.set(Constants.NUMERIC_STRING_ONE, Constants.ISSUING_BANK);
    crAvailByBankMap.set(Constants.NUMERIC_STRING_TWO, Constants.ADVISING_BANK);
    crAvailByBankMap.set(Constants.NUMERIC_STRING_THREE, Constants.ANY_BANK);
    crAvailByBankMap.set(Constants.NUMERIC_STRING_EIGHT, Constants.ADVISE_THRU_BANK);
    crAvailByBankMap.set(Constants.NUMERIC_STRING_NINTY_NINE, Constants.OTHER);
    return crAvailByBankMap.get(key);
  }
  public getCrAvailByBankDropDownCode(key): string {
    const crAvailByBankMap = new Map();
    crAvailByBankMap.set(Constants.ISSUING_BANK, Constants.NUMERIC_STRING_ONE);
    crAvailByBankMap.set(Constants.ADVISING_BANK, Constants.NUMERIC_STRING_TWO);
    crAvailByBankMap.set(Constants.ANY_BANK, Constants.NUMERIC_STRING_THREE);
    crAvailByBankMap.set(Constants.ADVISE_THRU_BANK, Constants.NUMERIC_STRING_EIGHT);
    crAvailByBankMap.set(Constants.OTHER, Constants.NUMERIC_STRING_NINTY_NINE);
    if (key !== '' && key !== null && (key !== Constants.ADVISING_BANK) && (key !== Constants.ISSUING_BANK) &&
    (key !== Constants.ANY_BANK) && (key !== Constants.ADVISE_THRU_BANK)) {
      key = Constants.OTHER;
    }
    return crAvailByBankMap.get(key);
}
public getShipmentDetails(key): string {
  const shipmentMap = new Map();
  shipmentMap.set(Constants.SHIPMENT_ALLOWED, 'LABEL_ALLOWED');
  shipmentMap.set(Constants.SHIPMENT_NOT_ALLOWED, 'LABEL_NOT_ALLOWED');
  shipmentMap.set(Constants.SHIPMENT_CONDITIONAL, 'LABEL_CONDITIONAL');
  return shipmentMap.get(key);
}

public getShipmentPeriodValue(key): string {
  const shipmentPeriodMap = new Map();
  shipmentPeriodMap.set(Constants.SHIPMENT_NO, 'LABEL_NO');
  shipmentPeriodMap.set(Constants.SHIPMENT_YES, 'LABEL_YES');
  shipmentPeriodMap.set(Constants.SHIPMENT_BETWEEN, 'LABEL_BETWEEN');
  return shipmentPeriodMap.get(key);
}

public getIncoTermDetails(key): string {
  if (key == null || key === '' || key === '<BLANK>') {
    return key;
  }
  const incoTermMap = new Map();
  incoTermMap.set(Constants.INCO_CFR, 'LABEL_COST_AND_FREIGHT');
  incoTermMap.set(Constants.INCO_DPU, 'LABEL_DELIVERED_AT_PLACE_UNLOADED');
  incoTermMap.set(Constants.INCO_CIF, 'LABEL_COST_INSURANCE_AND_FREIGHT');
  incoTermMap.set(Constants.INCO_CIP, 'LABEL_CARRIAGE_AND_INSURANCE_PAID');
  incoTermMap.set(Constants.INCO_CPT, 'LABEL_CARRIAGE_PAID');
  incoTermMap.set(Constants.INCO_DAF, 'LABEL_DELIVERED_AT_FRONTIER');
  incoTermMap.set(Constants.INCO_DDP, 'LABEL_DELIVERED_DUTY_PAID');
  incoTermMap.set(Constants.INCO_DDU, 'LABEL_DELIVERED_DUTY_UNPAID');
  incoTermMap.set(Constants.INCO_DEQ, 'LABEL_DELIVERED_EX_QUAY');
  incoTermMap.set(Constants.INCO_DES, 'LABEL_DELIVERED_EX_SHIP');
  incoTermMap.set(Constants.INCO_EXW, 'LABEL_EX_WORKS');
  incoTermMap.set(Constants.INCO_FCA, 'LABEL_FCA');
  incoTermMap.set(Constants.INCO_FAS, 'LABEL_FREE_ALONGSIDE_SHIP');
  incoTermMap.set(Constants.INCO_FOB, 'LABEL_FREE_ON_BOARD');
  incoTermMap.set(Constants.INCO_DAT, 'LABEL_DAT');
  incoTermMap.set(Constants.INCO_DAP, 'LABEL_DAP');
  incoTermMap.set(Constants.INCO_OTH, 'LABEL_OTH');
  return incoTermMap.get(key);
}

public getBankTemplateID(): string {
  return this.bankTemplateID;
}
public setBankTemplateID(bankTemplateID: string) {
  this.bankTemplateID = bankTemplateID;
}

public getTemplateUndertakingType(): string {
  return this.templateUdertakingType;
}
public setTemplateUndertakingType(templateUdertakingType: string) {
  this.templateUdertakingType = templateUdertakingType;
}

public getIsFromBankTemplateOption(): boolean {
  return this.isFromBankTemplateOption;
}
public setIsFromBankTemplateOption(isFromBankTemplateOption: boolean) {
  this.isFromBankTemplateOption = isFromBankTemplateOption;
}

public getStylesheetName(): string {
  return this.stylesheetname;
}
public setStylesheetName(stylesheetname: string) {
  this.stylesheetname = stylesheetname;
}

public getSpecimenName(): string {
  return this.speciman;
}
public setSpecimenName(speciman: string) {
  this.speciman = speciman;
}

public getDocumentId(): string {
  return this.documentId;
}
public setDocumentId(documentId: string) {
  this.documentId = documentId;
}
public getGuaranteeTextId(): string {
  return this.guaranteeTextId;
}
public setGuaranteeTextId(guaranteeTextId: string) {
  this.guaranteeTextId = guaranteeTextId;
}

public setXslTemplate(isXslTemplate) {
  this.isXslTemplate = isXslTemplate;
}

public getXslTemplate(): boolean {
  return this.isXslTemplate;
}

public setEditorTemplate(isEditorTemplate) {
  this.isEditorTemplate = isEditorTemplate;
}

public getEditorTemplate(): boolean {
  return this.isEditorTemplate;
}

public setSpecimenTemplate(isSpecimenTemplate) {
  this.isSpecimenTemplate = isSpecimenTemplate;
}

public getSpecimenTemplate(): boolean {
  return this.isSpecimenTemplate;
}

setBankTemplateData(jsonContent) {
  const invalidValue = '**';
  if (jsonContent.objectData.speciman != null && jsonContent.objectData.speciman !== ''
  && jsonContent.objectData.speciman !== invalidValue) {
    this.speciman = jsonContent.objectData.speciman;
  }
  if (jsonContent.objectData.documentId != null && jsonContent.objectData.documentId !== '' &&
  jsonContent.objectData.documentId !== invalidValue) {
    this.documentId = jsonContent.objectData.documentId;
  }
  if (jsonContent.objectData.stylesheetname != null && jsonContent.objectData.stylesheetname !== ''
  && jsonContent.objectData.stylesheetname !== invalidValue) {
    this.stylesheetname = jsonContent.objectData.stylesheetname;
  }
  if (jsonContent.objectData.textTypeStandard != null && jsonContent.objectData.textTypeStandard !== '') {
    this.textTypeStandard = jsonContent.objectData.textTypeStandard;
  }
  if ((jsonContent.guaranteeTypeName != null && jsonContent.guaranteeTypeName !== '') &&
  (jsonContent.guaranteeTypeCompanyId != null && jsonContent.guaranteeTypeCompanyId !== '')) {
    this.setIsFromBankTemplateOption(true);
  }
  if (this.speciman != null && this.speciman !== '' && this.speciman !== invalidValue) {
    this.setSpecimenName(jsonContent.objectData.speciman);
    this.setDocumentId(jsonContent.objectData.documentId);
    this.setSpecimenTemplate(true);
  }
  if (this.stylesheetname != null && this.stylesheetname !== ''
  && this.stylesheetname !== invalidValue && this.stylesheetname !== undefined) {
    this.setStylesheetName(jsonContent.objectData.stylesheetname);
    this.setXslTemplate(true);
  }
  if (this.textTypeStandard === '02') {
    this.setEditorTemplate(true);
  }
  this.setGuaranteeTextId(jsonContent.objectData.guaranteeTextId);
}

transformToTemplateIssuedUndertaking(eventId, masterId, productCode, guaranteeName, guaranteeCompanyId, guaranteeTextId,
                                     docId, mode, styleSheet, formData) {

this.banktemplateDownloadRequest = new BanktemplateDownloadRequest();
this.banktemplateDownloadRequest.eventId = eventId;
this.banktemplateDownloadRequest.masterId = masterId;
this.banktemplateDownloadRequest.productCode = productCode;
this.banktemplateDownloadRequest.guaranteeName = guaranteeName;
this.banktemplateDownloadRequest.guaranteeCompanyId = guaranteeCompanyId;
this.banktemplateDownloadRequest.guaranteeTextId = guaranteeTextId;
this.banktemplateDownloadRequest.docId = docId;
this.banktemplateDownloadRequest.mode = mode;
this.banktemplateDownloadRequest.styleSheet = styleSheet;
this.banktemplateDownloadRequest.formData = formData;
}

public setBankNameDetails(bankDetails) {
  this.bankNameMap.clear();
  bankDetails.forEach(element => {
    this.bankNameMap.set(element.bankname, element.name);
  });
}

public getBankName(bankname) {
  return this.bankNameMap.get(bankname);
}

}
