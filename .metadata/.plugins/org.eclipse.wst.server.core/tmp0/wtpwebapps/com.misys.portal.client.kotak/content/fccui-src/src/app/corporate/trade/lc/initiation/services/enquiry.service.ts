import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { ProductParams } from '../../../../../common/model/params-model';
import { CommonService } from './../../../../../common/services/common.service';
import { LegalTextService } from './../../../../../common/services/legal-text.service';
import { ReauthService } from './../../../../../common/services/reauth.service';

@Injectable({
  providedIn: 'root'
})



export class EnquiryService {



constructor(protected translateService: TranslateService, protected http: HttpClient,
            protected legalTextService: LegalTextService, protected commonService: CommonService,
            protected reauthService: ReauthService) { }

getDisplayTabs(allTabs, tnxTypeCode, tnxStatCode, modelObj) {
  const fetchTempItems = [];
  const finalTab = [];
  const filteredTabs = this.getTabSection(allTabs, tnxTypeCode, tnxStatCode, modelObj);
  const arrOfStr = filteredTabs;
  for (let i = 0; i < allTabs.length; i++) {
    const keys = Object.keys(allTabs[i]);
    const keyName = keys[0];
    const widgetKeyArray = allTabs[i];
    const res = arrOfStr.indexOf(keyName);
    if (res > -1) {
      fetchTempItems.push(widgetKeyArray);
    }
  }
  fetchTempItems.forEach((element) => {
    const keys = Object.keys(element);
    const getPropObj = keys[0];
    const finalObj = element[getPropObj];
    finalTab.push({
          label: `${this.translateService.instant(finalObj.label)}`,
          id: finalObj.id,
          title: finalObj.title,
          child: finalObj.child
        });
  });
  return finalTab;
}

getTabSection(allTabs, tnxTypeCode, tnxStatCode, modelObj) {
  let resultOfTabs;
  for (let i = 0; i < modelObj.length; i++) {
    const tnxKey = Object.keys(modelObj[i]);
    const tnxKeyName = tnxKey[0];
    if ( tnxTypeCode === tnxKeyName) {
       const obj = modelObj[i][tnxTypeCode];
       for (let j = 0; j < obj.length; j++) {
        const tnxStat = Object.keys(obj[j]);
        const tnxstatName = tnxStat[0];
        if (tnxStatCode === tnxstatName) {
          resultOfTabs = obj[j][tnxStatCode];
          const arrOfTabs = resultOfTabs;
          // return this.createObjOfTab(arrOfTabs, allTabs);
          return arrOfTabs;
        }
      }
    }
  }
}

// LC model is configured in server side.
// replace switch case with single method call #getEnquiryModelFromAPI() after
// all other products are moved to server
 getEnquiryModel(productCode: any, subProductCode?: any) {
    return this.getEnquiryModelFromAPI(productCode, subProductCode).toPromise();
}

approveForm(e, tnxId, responseDetails, eTag?: string) {
  let reauthData: any;
  switch (responseDetails.productCode) {
    case FccGlobalConstant.PRODUCT_LC:
    case FccGlobalConstant.PRODUCT_LI:
    case FccGlobalConstant.PRODUCT_EL:
    case FccGlobalConstant.PRODUCT_SR:
    case FccGlobalConstant.PRODUCT_SG:
    case FccGlobalConstant.PRODUCT_SI:
    case FccGlobalConstant.PRODUCT_BG:
    case FccGlobalConstant.PRODUCT_BR:
      reauthData = {
        action: FccGlobalConstant.APPROVE,
        tnxNumber: tnxId,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        currency: responseDetails.currency,
        beneficiaryName: responseDetails.beneName,
        amount: responseDetails.amount,
        expiryDate: responseDetails.expDate,
        lcmode: responseDetails.tnxMode,
        lcmodeother: responseDetails.tnxModeText,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        subProductCode: responseDetails.subProductCode,
        executionDate: responseDetails.issueDate,
        bankReference: responseDetails.bankReference,
        assigneeName: responseDetails.assigneeName,
        transactionAmount: responseDetails.transactionAmount,
        expiryType: responseDetails.expiryType,
        secondBeneficiaryName: responseDetails.secondBeneficiaryName,
        subTnxTypeCode : responseDetails.subTnxTypeCode,
        companyName: responseDetails.companyName
      };
      break;
    case FccGlobalConstant.PRODUCT_IC:
    case FccGlobalConstant.PRODUCT_EC:
      reauthData = {
        action: FccGlobalConstant.APPROVE,
        tnxNumber: tnxId,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        currency: responseDetails.currency,
        beneficiaryName: responseDetails.beneName,
        amount: responseDetails.amount,
        expiryDate: responseDetails.expDate,
        lcmode: responseDetails.tnxMode,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        bankReference: responseDetails.bankReference,
        ecTermCode: responseDetails.ecTermCode,
        ecTenorType: responseDetails.ecTenorType,
        subProductCode: responseDetails.subProductCode,
        subTnxTypeCode: responseDetails.subTnxTypeCode
      };
      break;
    case FccGlobalConstant.PRODUCT_IR:
      reauthData = {
      action: FccGlobalConstant.APPROVE,
      tnxNumber: tnxId,
      entity: responseDetails.entity,
      id: responseDetails.channelId,
      bankReference: responseDetails.bankReference,
      remitterName: responseDetails.remitterName,
      currency: responseDetails.currency,
      remittanceAmount: responseDetails.remittanceAmount,
      tnxType: responseDetails.tnxType,
      productCode: responseDetails.productCode,
      remittanceDate: responseDetails.remittanceDate,
      subTnxTypeCode: responseDetails.subTnxTypeCode,
      remittanceType: responseDetails.remittanceType
      };
      break;
      case FccGlobalConstant.PRODUCT_TD:
      reauthData = {
        action: FccGlobalConstant.APPROVE,
        tnxNumber: tnxId,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        bankReference: responseDetails.bankReference,
        currency: responseDetails.currency,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        subProductCode: responseDetails.subProductCode,
        amount: responseDetails.transactionAmount,
        withdrawalAmount: responseDetails.withdrawalAmount,
        orderingAccount: responseDetails.orderingAccount,
        creditAccount: responseDetails.creditAccount,
        additionalFields: responseDetails.additionalFields,
        depositType: responseDetails.depositType,
        issuingBankName: responseDetails.issuingBankName,
        maturitydate: responseDetails.maturitydate
      };
      break;
    case FccGlobalConstant.PRODUCT_TF:
      reauthData = {
        action: FccGlobalConstant.APPROVE,
        tnxNumber: tnxId,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        bankReference: responseDetails.bankReference,
        amount: responseDetails.amount,
        currency: responseDetails.currency,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        subProductCode: responseDetails.subProductCode
      };
      break;
    case FccGlobalConstant.PRODUCT_FT:
      if(responseDetails.subProductCode !== FccGlobalConstant.FT_TINT && 
        responseDetails.subProductCode !== FccGlobalConstant.FT_TTPT){
          reauthData = {
            action: FccGlobalConstant.APPROVE,
            tnxNumber: tnxId,
            applicantName: responseDetails.applicantName,
            id: responseDetails.channelId,
            bank: responseDetails.bank,
            transferFrom: responseDetails.transferFrom,
            beneficiaryName: responseDetails.beneficiaryName,
            beneficiaryAccount: responseDetails.beneficiaryAccount,
            bankReference: responseDetails.bankReference,
            currency: responseDetails.currency,
            tnxType: responseDetails.tnxType,
            productCode: responseDetails.productCode,
            subProductCode: responseDetails.subProductCode,
            amount: responseDetails.amount,
            ftType: responseDetails.ftType,
            orderingCurrency: responseDetails.orderingCurrency,
            orderingAccount: responseDetails.orderingAccount,
            transfereeAccount: responseDetails.transfereeAccount,
            executionDate: responseDetails.executionDate,
            transferDate: responseDetails.transferDate,
            entity: responseDetails.entity,
            additionalFields: responseDetails.additionalFields,
            recurringEnabled: this.recurringPaymentEnable(responseDetails),
            recurringStartDate:this.recurringStartDate(responseDetails)
            };
      } else {
        reauthData = {
          action: FccGlobalConstant.APPROVE,
          tnxNumber: tnxId,
          entity: responseDetails.entity,
          id: responseDetails.channelId,
          bankReference: responseDetails.bankReference,
          currency: responseDetails.currency,
          tnxType: responseDetails.tnxType,
          productCode: responseDetails.productCode,
          subProductCode: responseDetails.subProductCode,
          amount: responseDetails.amount,
          ftType: responseDetails.ftType,
          orderingCurrency: responseDetails.orderingCurrency,
          orderingAccount: responseDetails.orderingAccount,
          transfereeAccount: responseDetails.transfereeAccount,
          executionDate: responseDetails.executionDate
          };
      }
      break;
    case FccGlobalConstant.PRODUCT_BG:
      reauthData = {
        action: FccGlobalConstant.APPROVE,
        tnxNumber: tnxId,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        bankReference: responseDetails.bankReference,
        currency: responseDetails.currency,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        subProductCode: responseDetails.subProductCode,
        amount: responseDetails.amount,
        bgType: responseDetails.bgType,
        orderingCurrency: responseDetails.orderingCurrency,
        orderingAccount: responseDetails.orderingAccount,
        transfereeAccount: responseDetails.transfereeAccount,
        executionDate: responseDetails.executionDate
      };
      break;
    case FccGlobalConstant.PRODUCT_LN:
      reauthData = {
        action: FccGlobalConstant.APPROVE,
        tnxNumber: tnxId,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        currency: responseDetails.currency,
        beneficiaryName: responseDetails.beneName,
        amount: responseDetails.amount,
        expiryDate: responseDetails.expDate,
        lcmode: responseDetails.tnxMode,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        subProductCode: responseDetails.subProductCode,
        executionDate: responseDetails.issueDate,
        bankReference: responseDetails.bankReference,
        assigneeName: responseDetails.assigneeName,
        transactionAmount: responseDetails.transactionAmount,
        expiryType: responseDetails.expiryType,
        secondBeneficiaryName: responseDetails.secondBeneficiaryName,
        subTnxTypeCode : responseDetails.subTnxTypeCode,
        companyName: responseDetails.companyName,
        facilityType : responseDetails.facilityType,
      };
      break;
    case FccGlobalConstant.PRODUCT_BK:
      switch (responseDetails.subProductCode) {
        case FccGlobalConstant.SUB_PRODUCT_LNRPN:
          reauthData = {
            action: FccGlobalConstant.APPROVE,
            tnxNumber: tnxId,
            entity: responseDetails.entity,
            id: responseDetails.channelId,
            currency: responseDetails.currency,
            amount: responseDetails.amount,
            tnxType: responseDetails.tnxType,
            productCode: responseDetails.productCode,
            subProductCode: responseDetails.subProductCode,
            transactionAmount: responseDetails.transactionAmount,
            subTnxTypeCode : responseDetails.subTnxTypeCode,
            companyName: responseDetails.companyName,
            facilityType : responseDetails.facilityType
          };
          break;
        case FccGlobalConstant.SUB_PRODUCT_BLFP:
          reauthData = {
            action: FccGlobalConstant.APPROVE,
            tnxNumber: tnxId,
            entity: responseDetails.entity,
            id: responseDetails.channelId,
            currency: responseDetails.currency,
            amount: responseDetails.amount,
            tnxType: responseDetails.tnxType,
            productCode: responseDetails.productCode,
            subProductCode: responseDetails.subProductCode,
            transactionAmount: responseDetails.transactionAmount,
            subTnxTypeCode : responseDetails.subTnxTypeCode,
            companyName: responseDetails.companyName
          };
          break;
        default:
          break;
      }
      break;
    case FccGlobalConstant.PRODUCT_SE:
        reauthData = {
          action: FccGlobalConstant.APPROVE,
          tnxNumber: tnxId,
          entity: responseDetails.entity,
          id: responseDetails.channelId,
          bankReference: responseDetails.bankReference,
          tnxType: responseDetails.tnxType,
          productCode: responseDetails.productCode,
          subProductCode: responseDetails.subProductCode,
          orderingAccount: responseDetails.orderingAccount,
          additionalFields: responseDetails.additionalFields,
          issuingBankName: responseDetails.issuingBankName,
          topic: responseDetails.topic,
          subTopic: responseDetails.subTopic,
        };
        break;
    default:
      break;
  }
  reauthData.eTag = eTag;
  this.legalTextService.openLegalTextDiaglog(reauthData);

}

returnForm(e: any, tnxId: any, comment: any, responseDetails: any, eTag?: string ) {
  let reauthData: any;
  switch (responseDetails.productCode) {
    case FccGlobalConstant.PRODUCT_LC:
    case FccGlobalConstant.PRODUCT_LI:
    case FccGlobalConstant.PRODUCT_EL:
    case FccGlobalConstant.PRODUCT_SR:
    case FccGlobalConstant.PRODUCT_SI:
    case FccGlobalConstant.PRODUCT_BG:
    case FccGlobalConstant.PRODUCT_BR:
      reauthData = {
        action: FccGlobalConstant.RETURN,
        tnxNumber: tnxId,
        rejectComment: comment,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        currency: responseDetails.currency,
        beneficiaryName: responseDetails.beneName,
        amount: responseDetails.amount,
        expiryDate: responseDetails.expDate,
        lcmode: responseDetails.tnxMode,
        lcmodeother: responseDetails.tnxModeText,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        applicantName: responseDetails.applicantName,
        executionDate: responseDetails.issueDate,
        bankReference: responseDetails.bankReference,
        assigneeName: responseDetails.assigneeName,
        transactionAmount: responseDetails.transactionAmount,
        expiryType: responseDetails.expiryType,
        secondBeneficiaryName: responseDetails.secondBeneficiaryName,
        subTnxTypeCode : responseDetails.subTnxTypeCode,
        companyName: responseDetails.companyName
      };
      break;
    case FccGlobalConstant.PRODUCT_IC:
    case FccGlobalConstant.PRODUCT_EC:
      reauthData = {
        action: FccGlobalConstant.RETURN,
        tnxNumber: tnxId,
        rejectComment: comment,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        currency: responseDetails.currency,
        beneficiaryName: responseDetails.beneName,
        amount: responseDetails.amount,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        ecTermCode: responseDetails.ecTermCode,
        ecTenorType: responseDetails.ecTenorType,
        subTnxTypeCode : responseDetails.subTnxTypeCode
      };
      break;
    case FccGlobalConstant.PRODUCT_SG:
      reauthData = {
        action: FccGlobalConstant.RETURN,
        tnxNumber: tnxId,
        rejectComment: comment,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        beneficiaryName: responseDetails.beneName,
        expiryDate: responseDetails.expDate,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        amount: responseDetails.amount,
        currency: responseDetails.currency
      };
      break;
    case FccGlobalConstant.PRODUCT_IR:
      reauthData = {
        action: FccGlobalConstant.RETURN,
        tnxNumber: tnxId,
        rejectComment: comment,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        bankReference: responseDetails.bankReference,
        remitterName: responseDetails.remitterName,
        currency: responseDetails.currency,
        remittanceAmount: responseDetails.remittanceAmount,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        remittanceDate: responseDetails.remittanceDate,
        remittanceType: responseDetails.remittanceType
      };
      break;
    case FccGlobalConstant.PRODUCT_TF:
      reauthData = {
        action: FccGlobalConstant.RETURN,
        tnxNumber: tnxId,
        rejectComment: comment,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        bankReference: responseDetails.bankReference,
        currency: responseDetails.currency,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        amount: responseDetails.amount,
        subProductCode: responseDetails.subProductCode
      };
      break;
    case FccGlobalConstant.PRODUCT_FT:
      if(responseDetails.subProductCode !== FccGlobalConstant.FT_TINT && 
        responseDetails.subProductCode !== FccGlobalConstant.FT_TTPT){
          reauthData = {
            action: FccGlobalConstant.RETURN,
            tnxNumber: tnxId,
            rejectComment: comment,
            applicantName: responseDetails.applicantName,
            id: responseDetails.channelId,
            bank: responseDetails.bank,
            transferFrom: responseDetails.transferFrom,
            beneficiaryName: responseDetails.beneficiaryName,
            beneficiaryAccount: responseDetails.beneficiaryAccount,
            bankReference: responseDetails.bankReference,
            currency: responseDetails.currency,
            tnxType: responseDetails.tnxType,
            productCode: responseDetails.productCode,
            subProductCode: responseDetails.subProductCode,
            amount: responseDetails.amount,
            ftType: responseDetails.ftType,
            orderingCurrency: responseDetails.orderingCurrency,
            orderingAccount: responseDetails.orderingAccount,
            transfereeAccount: responseDetails.transfereeAccount,
            executionDate: responseDetails.executionDate,
            transferDate: responseDetails.transferDate,
            entity: responseDetails.entity
            };
      } else {
        reauthData = {
          action: FccGlobalConstant.RETURN,
          tnxNumber: tnxId,
          rejectComment: comment,
          entity: responseDetails.entity,
          id: responseDetails.channelId,
          bankReference: responseDetails.bankReference,
          currency: responseDetails.currency,
          tnxType: responseDetails.tnxType,
          productCode: responseDetails.productCode,
          subProductCode: responseDetails.subProductCode,
          amount: responseDetails.amount,
          ftType: responseDetails.ftType,
          orderingCurrency: responseDetails.orderingCurrency,
          orderingAccount: responseDetails.orderingAccount,
          transfereeAccount: responseDetails.transfereeAccount,
          executionDate: responseDetails.executionDate
        };
      }
      break;
    case FccGlobalConstant.PRODUCT_BG:
      reauthData = {
        action: FccGlobalConstant.RETURN,
        tnxNumber: tnxId,
        rejectComment: comment,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        bankReference: responseDetails.bankReference,
        currency: responseDetails.currency,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        subProductCode: responseDetails.subProductCode,
        amount: responseDetails.amount,
        bgType: responseDetails.bgType,
        orderingCurrency: responseDetails.orderingCurrency,
        orderingAccount: responseDetails.orderingAccount,
        transfereeAccount: responseDetails.transfereeAccount,
        executionDate: responseDetails.executionDate
      };
      break;
    case FccGlobalConstant.PRODUCT_LN:
      reauthData = {
        action: FccGlobalConstant.RETURN,
        tnxNumber: tnxId,
        rejectComment: comment,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        currency: responseDetails.currency,
        beneficiaryName: responseDetails.beneName,
        amount: responseDetails.amount,
        expiryDate: responseDetails.expDate,
        lcmode: responseDetails.tnxMode,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        subProductCode: responseDetails.subProductCode,
        executionDate: responseDetails.issueDate,
        bankReference: responseDetails.bankReference,
        assigneeName: responseDetails.assigneeName,
        transactionAmount: responseDetails.transactionAmount,
        expiryType: responseDetails.expiryType,
        secondBeneficiaryName: responseDetails.secondBeneficiaryName,
        subTnxTypeCode : responseDetails.subTnxTypeCode,
        companyName: responseDetails.companyName,
        facilityType : responseDetails.facilityType
      };
      break;
    case FccGlobalConstant.PRODUCT_BK:
      switch (responseDetails.subProductCode) {
        case FccGlobalConstant.SUB_PRODUCT_LNRPN:
          reauthData = {
            action: FccGlobalConstant.RETURN,
            tnxNumber: tnxId,
            entity: responseDetails.entity,
            rejectComment: comment,
            id: responseDetails.channelId,
            currency: responseDetails.currency,
            amount: responseDetails.amount,
            tnxType: responseDetails.tnxType,
            productCode: responseDetails.productCode,
            subProductCode: responseDetails.subProductCode,
            transactionAmount: responseDetails.transactionAmount,
            subTnxTypeCode : responseDetails.subTnxTypeCode,
            companyName: responseDetails.companyName,
            facilityType : responseDetails.facilityType
          };
          break;
        case FccGlobalConstant.SUB_PRODUCT_BLFP:
          reauthData = {
            action: FccGlobalConstant.RETURN,
            tnxNumber: tnxId,
            entity: responseDetails.entity,
            rejectComment: comment,
            id: responseDetails.channelId,
            currency: responseDetails.currency,
            amount: responseDetails.amount,
            tnxType: responseDetails.tnxType,
            productCode: responseDetails.productCode,
            subProductCode: responseDetails.subProductCode,
            transactionAmount: responseDetails.transactionAmount,
            subTnxTypeCode : responseDetails.subTnxTypeCode,
            companyName: responseDetails.companyName
          };
          break;
        default:
          break;
      }
      break;
      case FccGlobalConstant.PRODUCT_TD:
      reauthData = {
        action: FccGlobalConstant.RETURN,
        tnxNumber: tnxId,
        rejectComment: comment,
        entity: responseDetails.entity,
        id: responseDetails.channelId,
        bankReference: responseDetails.bankReference,
        currency: responseDetails.currency,
        tnxType: responseDetails.tnxType,
        productCode: responseDetails.productCode,
        amount: responseDetails.transactionAmount,
        subProductCode: responseDetails.subProductCode,
        orderingAccount: responseDetails.orderingAccount,
        creditActNo: responseDetails.creditActNo,
        additionalFields: responseDetails.additionalFields,
        depositType: responseDetails.depositType,
        issuingBankName: responseDetails.issuingBankName,
        maturitydate: responseDetails.maturitydate,
        withdrawalAmount: responseDetails.withdrawalAmount
      };
      break;
      case FccGlobalConstant.PRODUCT_SE:
        reauthData = {
          action: FccGlobalConstant.RETURN,
          tnxNumber: tnxId,
          rejectComment: comment,
          entity: responseDetails.entity,
          id: responseDetails.channelId,
          bankReference: responseDetails.bankReference,
          tnxType: responseDetails.tnxType,
          productCode: responseDetails.productCode,
          subProductCode: responseDetails.subProductCode,
          orderingAccount: responseDetails.orderingAccount,
          additionalFields: responseDetails.additionalFields,
          issuingBankName: responseDetails.issuingBankName,
          topic: responseDetails.topic,
          subTopic: responseDetails.subTopic
        };
        break;
    default:
      break;
  }
  reauthData.eTag = eTag;
  this.reauthService.reauthenticate(reauthData, FccGlobalConstant.reAuthComponentKey);
}

public checkinit = (valueCheck) => {
  if (valueCheck.indexOf(',') > -1){
    return parseInt(valueCheck.replace(',', ''), 10);
  }else{
    return parseInt(valueCheck, 10);
  }
};
public getButtonPermissionForLive(buttonItemListTmp, prodStatCode, repricingDate, lnLiabAmt, underRepricing,
                                  subPoductCode, lnStatus, lnAccessType, TSCode, selectedDate, repricingFrequency, isAmendRestricted) {

    const splitDate = this.commonService.convertToDateFormat(repricingDate);
    const checkDate = splitDate.getTime() >= (new Date().getTime() + (selectedDate * 86400));
    const data = buttonItemListTmp.map((e) => {
      let stat = false;
      switch (e.buttonName) {
        case 'LNrollover':
          stat = (prodStatCode !== FccGlobalConstant.N005_PURGED && prodStatCode !== FccGlobalConstant.N005_CLOSED
          && checkDate && this.checkinit(lnLiabAmt) > 0 && underRepricing === FccGlobalConstant.UNDER_REPRICING_FLAG_N &&
          subPoductCode !== FccGlobalConstant.LN_SWG && lnStatus === FccGlobalConstant.LN_STATUS_A &&
          lnAccessType !== FccGlobalConstant.LN_ACCESS_TYPE_B &&
          (TSCode === undefined ? true : TSCode)) && (repricingFrequency !== undefined && repricingFrequency !== '');
          e.render = stat;
          return e;

        case 'LNincrease':
          stat = (prodStatCode !== FccGlobalConstant.N005_PURGED && prodStatCode !== FccGlobalConstant.N005_CLOSED &&
          lnStatus === FccGlobalConstant.LN_STATUS_A && lnAccessType !== FccGlobalConstant.LN_ACCESS_TYPE_B
          && underRepricing === FccGlobalConstant.UNDER_REPRICING_FLAG_N);
          e.render = stat;
          return e;

        case 'LNrepayment':
          stat = (prodStatCode !== FccGlobalConstant.N005_PURGED && prodStatCode !== FccGlobalConstant.N005_CLOSED &&
          lnStatus === FccGlobalConstant.LN_STATUS_A && lnAccessType !== FccGlobalConstant.LN_ACCESS_TYPE_B
          && underRepricing === FccGlobalConstant.UNDER_REPRICING_FLAG_N);
          e.render = stat;
          return e;

        case 'SearchAmendment':
          stat = (prodStatCode !== FccGlobalConstant.N006_CANCELLED) && (!isAmendRestricted)
            && (prodStatCode != FccGlobalConstant.N005_PROVISIONAL) && (prodStatCode !== FccGlobalConstant.N005_WORDING_UNDER_REVIEW)
            && (prodStatCode !== FccGlobalConstant.N005_FINAL_WORDING);
          e.render = stat;
          return e;

        default:
          return { ...e, disable: false };
      }
    });
    return data;

}


public getButtonPermission(tnxTypeCode, allButtons, txnStatusButtons, prodStatCode) {

  const buttonItemList = allButtons;

  let buttonPermission = new Map();
  let txnButtons;

  const permission = 'permission';
  const render = 'render';
  const buttonType = 'buttonType';

  if (txnStatusButtons !== undefined) {
  for (let i = 0; i < txnStatusButtons.length; i++) {
    const txnstatus = Object.keys(txnStatusButtons[i]);

    if (txnstatus.indexOf(String(tnxTypeCode)) !== -1) {
      txnButtons = txnStatusButtons[i][tnxTypeCode];
      txnButtons.forEach(txnButoon => {
        buttonPermission.set(txnButoon[permission], false);
      });
    }
  }
}
  this.commonService.getButtonPermission(buttonPermission).subscribe(buttonPermissionResult => {
    buttonPermission = buttonPermissionResult;
    if (txnButtons !== undefined) {
      txnButtons.forEach(buttonObj => {
        if (buttonPermission.get(buttonObj[permission]) === true) {
          if ((buttonObj[buttonType] === FccGlobalConstant.AMENDMENT && prodStatCode !== FccGlobalConstant.N005_PURGED
            && prodStatCode !== FccGlobalConstant.N005_EXPIRE
            && prodStatCode !== FccGlobalConstant.N005_WORDING_UNDER_REVIEW
            && prodStatCode !== FccGlobalConstant.N005_FINAL_WORDING
            && prodStatCode !== FccGlobalConstant.N005_PROVISIONAL))
          {
            buttonObj[render] = true;
          }
          buttonItemList.splice(buttonItemList.length + 1, 0, buttonObj);
        }
      });
    }
  });
  return buttonItemList;
}

/**
 * fetch enquiry model from API
 *
 */
public getEnquiryModelFromAPI(productCode: string, subProductCode?: string) {
  const params: ProductParams = {
    type: FccGlobalConstant.MODEL_ENQUIRY,
    productCode,
    subProductCode
  };
  return this.commonService.getProductModel(params);
}

recurringPaymentEnable(data:any){
  let recurringPaymentEnabled;
  if (data.additionalFields !== undefined){
    const additionalFields = data.additionalFields;
    additionalFields.forEach(element => {
      if (element.name === 'recurring_payment_enabled'){
        recurringPaymentEnabled = element.value;
      }
    });
  }
  return recurringPaymentEnabled;
}

recurringStartDate(data:any) {
  let recurringStartDate;
  if (data.additionalFields !== undefined){
  const additionalFields = data.additionalFields;
  additionalFields.forEach(element => {
    if (element.name === 'recurring_start_date'){
        recurringStartDate = element.value;
      }
    });
  }
  return recurringStartDate;
}

}
