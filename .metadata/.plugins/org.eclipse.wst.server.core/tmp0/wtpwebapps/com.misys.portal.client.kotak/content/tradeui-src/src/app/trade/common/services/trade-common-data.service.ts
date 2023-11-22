import { Injectable } from '@angular/core';
import { CommonService } from '../../../common/services/common.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TradeCommonDataService {


  constructor(public commonService: CommonService, public translate: TranslateService) { }
  prodStatLabel: string;
  displayMode: string;
  tnxTypeMap = new Map();


  public getDisplayMode(): string {
    return this.displayMode;
  }

  public setDisplayMode(displayMode) {
    this.displayMode = displayMode;
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
  public getSendAttachments(key): string {
    const sendAttachmentsMap = new Map();
    sendAttachmentsMap.set('FACT', 'SWIFTNet FileAct');
    sendAttachmentsMap.set('FAXT', 'Fax transfer');
    sendAttachmentsMap.set('EMAL', 'Email transfer');
    sendAttachmentsMap.set('MAIL', 'Postal delivery');
    sendAttachmentsMap.set('COUR', 'Courier delivery');
    sendAttachmentsMap.set('HOST', 'Host-to-Host (Proprietary bank channel)');
    sendAttachmentsMap.set('OTHR', 'Other delivery channel');
    return sendAttachmentsMap.get(key);
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
    prodStatCodeMap.set('C1', 'ADVISE');
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

  public getChargeStatus(key): any {
    const chargeStatusCodeObj = [
      {label: this.commonService.getTranslation('CHARGE_STATUS_01'), value: '01'},
      {label: this.commonService.getTranslation('CHARGE_STATUS_02'), value: '02'},
      {label: this.commonService.getTranslation('CHARGE_STATUS_03'), value: '03'},
      {label: this.commonService.getTranslation('CHARGE_STATUS_99'), value: '99'}
    ];
    const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
          obj[item[keyField]] = item;
          return obj;
   }, {});
    if (key !== '' && key !== null ) {
      const obj = arrayToObject(chargeStatusCodeObj, 'value');
      return obj[key].label;
    } else {
      return chargeStatusCodeObj;
    }
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
      return obj[key].label;
    } else {
      return chargeTypeCodeObj;
    }
  }

  public getRulesApplicable(key): string {
    const rulesApplicableMap = new Map();
    rulesApplicableMap.set('01', 'RULES_APPLICABLE_EUCP');
    rulesApplicableMap.set('02', 'RULES_APPLICABLE_EUCPURR');
    rulesApplicableMap.set('03', 'RULES_APPLICABLE_ISP');
    rulesApplicableMap.set('04', 'RULES_APPLICABLE_UCP');
    rulesApplicableMap.set('05', 'RULES_APPLICABLE_UCPURR');
    rulesApplicableMap.set('06', 'RULES_APPLICABLE_URDG');
    rulesApplicableMap.set('07', 'RULES_APPLICABLE_ISPR');
    rulesApplicableMap.set('08', 'RULES_APPLICABLE_OTHR');
    rulesApplicableMap.set('09', 'RULES_APPLICABLE_NONE');
    rulesApplicableMap.set('10', 'RULES_APPLICABLE_UCPR');
    rulesApplicableMap.set('99', 'RULES_APPLICABLE_OTHER');

    return rulesApplicableMap.get(key);
    }

  public getUndertakingText(key): string {
      const undertakingTextMap = new Map();
      undertakingTextMap.set('01', 'BANK_STANDARD');
      undertakingTextMap.set('02', 'BENEFICIARY_WORDING');
      undertakingTextMap.set('03', 'OUR_WORDING');
      undertakingTextMap.set('04', 'SAME_AS_SPECIFY');
      return undertakingTextMap.get(key);
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

  public getBankActionReqCode(key, prodStatCode): any {
    let  bankActionReqCodeObj = [];
    if (prodStatCode === '12') {
       bankActionReqCodeObj = [
        {label: this.commonService.getTranslation('AWAITING_DISPOSAL_INSTRUCTION'), value: '12'}
      ];
    } else if (prodStatCode === '11' || prodStatCode === '78' || prodStatCode === '79') {
      bankActionReqCodeObj = [
       {label: this.commonService.getTranslation('CONSENT_RESPONSE'), value: '07'}
     ];
    } else if (prodStatCode === '84' || prodStatCode === '26' || prodStatCode === '14' || prodStatCode === '15' || prodStatCode === '24') {
      bankActionReqCodeObj = [
      {label: this.commonService.getTranslation('CLEAN_RESPONSE'), value: '26'}
     ];
    } else if (prodStatCode === '06' || prodStatCode === '81') {
      bankActionReqCodeObj = [
       {label: this.commonService.getTranslation('CANCEL_RESPONSE'), value: '05'}
     ];
   } else if (prodStatCode === '08' || prodStatCode === '09') {
     bankActionReqCodeObj = [
     {label: this.commonService.getTranslation('CUSTOMER_INSTRUCTIONS'), value: '99'}
     ];
    } else if (prodStatCode === '31') {
      bankActionReqCodeObj = [
      {label: this.commonService.getTranslation('AMENDMENT_RESPONSE'), value: '03'}
      ];
    } else {
       bankActionReqCodeObj = [
      {label: this.commonService.getTranslation('CUSTOMER_INSTRUCTIONS'), value: '99'},
      {label: this.commonService.getTranslation('CONSENT_RESPONSE'), value: '07'},
      {label: this.commonService.getTranslation('CLEAN_RESPONSE'), value: '26'},
      {label: this.commonService.getTranslation('AMENDMENT_RESPONSE'), value: '03'},
      {label: this.commonService.getTranslation('CANCEL_RESPONSE'), value: '05'},
      {label: this.commonService.getTranslation('AWAITING_DISPOSAL_INSTRUCTION'), value: '12'}
    ];
  }
    const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
          obj[item[keyField]] = item;
          return obj;
   }, {});
    if (key !== '' && key !== null ) {
      const obj = arrayToObject(bankActionReqCodeObj, 'value');
      return obj[key].label;
    } else {
      return bankActionReqCodeObj;
    }
  }
  public getConfirmationEventMessage(event): string {
    let confirmationMessage = '';
    if (event === '24') {
      this.translate.get('REQUEST_FOR_SETTLEMENT_EVENT').subscribe((value: string) => {
        confirmationMessage = value;
      });
      } else if (event === '85') {
        this.translate.get('CLAIM_SETTLEMENT_EVENT').subscribe((value: string) => {
          confirmationMessage = value;
        });
      } else if (event === '81') {
        this.translate.get('CANCEL_AWAITING_COUNTERPARTY_RESPONSE_EVENT').subscribe((value: string) => {
          confirmationMessage = value;
        });
      } else if (event === '04') {
        this.translate.get('ACCEPTED_EVENT').subscribe((value: string) => {
          confirmationMessage = value;
        });
      } else if ( event === '13' || event === '05') {
        this.translate.get('PART_SETTLED_EVENT').subscribe((value: string) => {
          confirmationMessage = value;
        });
      } else if (event === '32') {
        this.translate.get('AMENDMENT_REFUSED_EVENT').subscribe((value: string) => {
          confirmationMessage = value;
        });
        }
    return confirmationMessage;
  }

}
