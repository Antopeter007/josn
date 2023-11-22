import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { FilelistService } from '../../../app/corporate/trade/lc/initiation/services/filelist.service';
import { TranslateService } from '@ngx-translate/core';
import { CodeData } from '../model/codeData';
import { ProductStateService } from '../../../app/corporate/trade/lc/common/services/product-state.service';


@Injectable({
  providedIn: 'root'
})

export class LicenseHandlingService {
  contentType = 'Content-Type';
  tableColumns = [];
  contextPath: any;
  formModelArray = [];
  responseArray = [];
  codeData = new CodeData();
  columnsHeader = [];
  columnsHeaderData = [];
  name = 'name';
  required = 'required';
  maxlength = 'maxlength';
  type = 'type';
  columnsParam = 'columns';
  columnsHeaderDataParam = 'columnsHeaderData';
  linkedLicenseDetails: any;
  licenseOutStandingAmt: any;
  currency: any;
  option: any;
  subTnxTypeCode: any;
  isMaster = false;

  constructor(protected fileListSvc: FilelistService, protected translationService: TranslateService,
              protected commonService: CommonService, protected stateService: ProductStateService) {
  }

  handleLicenseTable(control: any, sectionForm: any, productCode: any, sectionName: any, master = false) {
    this.isMaster = master;
    this.handleFormLicense(control, sectionForm, productCode, sectionName);
  }

  handleFormLicense(control: any, sectionForm: any, productCode: any, sectionName: any) {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if ( mode !== FccGlobalConstant.INITIATE) {
    if (sectionForm.get(FccGlobalConstant.LINKEDLICENSES).value !== null &&
    sectionForm.get(FccGlobalConstant.LINKEDLICENSES).value !== '' &&
    sectionForm.get(FccGlobalConstant.LINKEDLICENSES).value !== undefined) {
      this.linkedLicenseDetails = sectionForm.get(FccGlobalConstant.LINKEDLICENSES).value;
      if (this.linkedLicenseDetails) {
      const licenseArray = [];
      const licenseJSON = JSON.parse(this.linkedLicenseDetails);
      if (licenseJSON.license.length > 0) {
        licenseJSON.license.forEach(element => {
          const selectedJson: { BO_REF_ID: any; LS_NUMBER: any, REF_ID: any, LS_LIAB_AMT: any, amount: any } = {
            BO_REF_ID: element.bo_ref_id,
            LS_NUMBER: element.ls_number,
            REF_ID: element.ls_ref_id,
            LS_LIAB_AMT: element.ls_os_amt,
            amount: element.ls_allocated_amt
          };
          licenseArray.push(selectedJson);
          const obj = {};
          obj[FccGlobalConstant.RESPONSE_DATA] = licenseArray;
          this.handleLicenseGrid(obj, control, sectionForm, productCode, sectionName);
        });
        } else if (Object.keys(licenseJSON[FccGlobalConstant.LICENSE]).length > 0 && licenseJSON.constructor === Object &&
              licenseJSON[FccGlobalConstant.LICENSE].ls_ref_id !== undefined && licenseJSON[FccGlobalConstant.LICENSE].ls_ref_id !== ''
                && licenseJSON[FccGlobalConstant.LICENSE].ls_ref_id !== null) {
            const selectedJson: { BO_REF_ID: any; LS_NUMBER: any, REF_ID: any, LS_LIAB_AMT: any, amount: any } = {
              BO_REF_ID: licenseJSON.license[FccGlobalConstant.BO_REF_ID],
              LS_NUMBER: licenseJSON.license[FccGlobalConstant.LS_NUMBER],
              REF_ID: licenseJSON.license[FccGlobalConstant.LS_REF_ID],
              LS_LIAB_AMT: licenseJSON.license[FccGlobalConstant.LS_OS_AMOUNT],
              amount: licenseJSON.license[FccGlobalConstant.LS_ALLOCATED_AMT]
            };
            licenseArray.push(selectedJson);
            const obj = {};
            obj[FccGlobalConstant.RESPONSE_DATA] = licenseArray;
            this.handleLicenseGrid(obj, control, sectionForm, productCode, sectionName);
        }
      }
      }
    }
  }

  handleLicenseGrid(response: any, fieldControl: any, sectionForm: any, productCode: any, sectionName: any) {
    let existingArr = [];
    this.licenseOutStandingAmt = response.responseData[0][FccGlobalConstant.LS_LIAB_AMT];
    existingArr = sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS];
    if (existingArr?.length > 0) {
      for (let i = 0; i < response.responseData.length; i++) {
        for (let j = 0; j < existingArr.length; j++) {
          if (response.responseData[i].REF_ID === existingArr[j].REF_ID) {
            break;
          } else if (j === existingArr.length - 1) {
              existingArr.push(response.responseData[i]);
          }
        }
      }
      sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS] = existingArr;
      this.stateService.setStateSection(sectionName, sectionForm, this.isMaster);
      sectionForm.updateValueAndValidity();
    } else {
      sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS] = response.responseData;
      this.stateService.setStateSection(sectionName, sectionForm, this.isMaster);
      sectionForm.updateValueAndValidity();
    }
    this.stateService.getSectionData(sectionName);
    this.formModelArray = sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SUBCONTROLSDETAILS];
    this.columnsHeader = [];
    this.columnsHeaderData = [];
    this.formateResult(sectionForm);
    fieldControl[FccGlobalConstant.PARAMS][this.columnsParam] = this.columnsHeader;
    fieldControl[FccGlobalConstant.PARAMS][this.columnsHeaderDataParam] = this.columnsHeaderData;
    sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = this.responseArray;
    this.updateDataArray(sectionForm, productCode);
    sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.MESSAGE1] =
      `${this.translationService.instant('Allocatedamountexceed')}`;
    sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.MESSAGE2] =
      `${this.translationService.instant('SumofAllocatedLicenseamount')}`;
    sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.TRASH_ACTION] = 'pi-trash';
    sectionForm.updateValueAndValidity();
    sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    const sessionArr = sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.SESSIONCOLS];
    if (sessionArr.length === 0) {
      sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
  }

  formateResult(sectionForm: any) {
    const sessionCols = 'sessionCols';
    for (let i = 0; i < this.formModelArray.length; i++) {
      let key: any;
      key = Object.keys(this.formModelArray[i]);
      key = key[0];
      this.columnsHeader.push(key);
      const headerdata = this.translationService.instant(key);
      this.columnsHeaderData.push(headerdata);
    }
    this.responseArray = sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][sessionCols];
    for (let i = 0; i < this.responseArray.length; i++) {
      for (let j = 0; j < this.columnsHeader.length; j++) {
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j],
          { value: this.getValue(this.responseArray[i][this.columnsHeader[j]]), writable: true });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Type',
          { value: this.getType(this.columnsHeader[j]), writable: false });
        Object.defineProperty(this.responseArray[i], this.columnsHeader[j] + 'Status',
          { value: this.getEditStatus(this.columnsHeader[j]), writable: false });
      }
    }
  }


  getValue(val: any) {
    if (val) {
      return val;
    } else {
      return '';
    }
  }

  getType(key) {
    let retuntype;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][FccGlobalConstant.NAME].toString()) {
          retuntype = this.formModelArray[i][key][FccGlobalConstant.TYPE];
        }
      } catch (e) {
      }
    }
    return retuntype;
  }
  getEditStatus(key) {
    let retuntype;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][FccGlobalConstant.NAME].toString()) {
          retuntype = this.formModelArray[i][key][FccGlobalConstant.EDIT_STATUS];
        }
      } catch (e) {
      }
    }
    return retuntype;
  }

  setCurrencyForLicense(productCode: any) {
    const operation = this.commonService.getQueryParametersFromKey('operation');
    switch (productCode) {
      case FccGlobalConstant.PRODUCT_LC: {
      if (operation === 'LIST_INQUIRY' && this.stateService.getSectionData('amountChargeDetails').get('currency').value.value !== null &&
        this.stateService.getSectionData('amountChargeDetails').get('currency').value.value !== '' &&
        this.stateService.getSectionData('amountChargeDetails').get('currency').value.value !== undefined) {
        this.currency = this.stateService.getSectionData('amountChargeDetails').get('currency').value.value;
      }
      break;
      }
      case FccGlobalConstant.PRODUCT_TF: {
        const tfAmountSection = this.stateService.getSectionData(FccGlobalConstant.TF_AMOUNT_DETAILS);
        if ((operation === FccGlobalConstant.PREVIEW || operation === FccGlobalConstant.LIST_INQUIRY) &&
        tfAmountSection && tfAmountSection !== null &&
        this.commonService.isNonEmptyValue(tfAmountSection.get(FccGlobalConstant.CURRENCY).value.value) &&
        tfAmountSection.get(FccGlobalConstant.CURRENCY).value.value !== '') {
          this.currency = tfAmountSection.get(FccGlobalConstant.CURRENCY).value.value;
        }
        break;
      }
      case FccGlobalConstant.PRODUCT_FT: {
        const ftAmountSection = this.stateService.getSectionData(FccGlobalConstant.FT_TRADE_GENERAL_DETAILS);
        if ((operation === FccGlobalConstant.PREVIEW || operation === FccGlobalConstant.LIST_INQUIRY) &&
        ftAmountSection && ftAmountSection !== null &&
        this.commonService.isNonEmptyValue(ftAmountSection.get(FccGlobalConstant.CURRENCY).value.value) &&
        ftAmountSection.get(FccGlobalConstant.CURRENCY).value.value !== '') {
          this.currency = ftAmountSection.get(FccGlobalConstant.CURRENCY).value.value;
        }
        break;
      }
      case FccGlobalConstant.PRODUCT_BG: {
        const uiUndertaking = this.stateService.getSectionData(FccGlobalConstant.UI_UNDERTAKING_DETAILS);
        if ((operation === FccGlobalConstant.PREVIEW || operation === FccGlobalConstant.LIST_INQUIRY)
         && uiUndertaking && uiUndertaking !== null && uiUndertaking !== undefined &&
        this.commonService.isNonEmptyValue(uiUndertaking.get(FccGlobalConstant.UI_UNDERTAKING_AMT_CHARGE_DETAILS).
        get(FccGlobalConstant.BG_CUR_CODE).value.value)) {
          this.currency = uiUndertaking.get(FccGlobalConstant.UI_UNDERTAKING_AMT_CHARGE_DETAILS).
          get(FccGlobalConstant.BG_CUR_CODE).value.value;
        }
        break;
      }
      case FccGlobalConstant.PRODUCT_IC: {
        if (operation === 'LIST_INQUIRY' &&
        this.stateService.getSectionData('amountDetails' , FccGlobalConstant.PRODUCT_IC , true ).get('currency').value !== null &&
          this.stateService.getSectionData('amountDetails').get('currency').value !== '' &&
          this.stateService.getSectionData('amountDetails').get('currency').value !== undefined) {
          this.currency = this.stateService.getSectionData('amountDetails').get('currency').value;
        }
        break;
      }
      case FccGlobalConstant.PRODUCT_EC: {
        if ((operation === FccGlobalConstant.PREVIEW || operation === FccGlobalConstant.LIST_INQUIRY) &&
        this.stateService.getSectionData('ecpaymentAmountDetails').get('currency').value.value !== null &&
        this.stateService.getSectionData('ecpaymentAmountDetails').get('currency').value.value !== '' &&
        this.stateService.getSectionData('ecpaymentAmountDetails').get('currency').value.value !== undefined) {
        this.currency = this.stateService.getSectionData('ecpaymentAmountDetails').get('currency').value.value;
      } else if (this.stateService.getSectionData('ecpaymentAmountDetails').get('currency').value.currencyCode !== null &&
        this.stateService.getSectionData('ecpaymentAmountDetails').get('currency').value.currencyCode !== '' &&
        this.stateService.getSectionData('ecpaymentAmountDetails').get('currency').value.currencyCode !== undefined) {
        this.currency = this.stateService.getSectionData('ecpaymentAmountDetails').get('currency').value.currencyCode;
      }
        break;
      }
      case FccGlobalConstant.PRODUCT_EL: {
      this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
      this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
      if (this.stateService.getSectionNames().indexOf('assignmentConditions') > -1 &&
      ((this.subTnxTypeCode !== undefined && this.subTnxTypeCode !== null &&
        this.subTnxTypeCode === FccGlobalConstant.N003_ASSIGNEE ) ||
      (this.option !== undefined && this.option !== null && this.option === FccGlobalConstant.OPTION_ASSIGNEE))) {
        const assignmentConditions = this.stateService.getSectionData('assignmentConditions');
        if ( assignmentConditions &&
          assignmentConditions.get('currency').value !== '' &&
          assignmentConditions.get('currency').value !== null &&
          assignmentConditions.get('currency').value !== undefined) {
            this.currency = assignmentConditions.get('currency').value;
          }
      } else if (this.stateService.getSectionNames().indexOf('transferDetails') > -1 &&
      ((this.subTnxTypeCode !== undefined && this.subTnxTypeCode !== null &&
        this.subTnxTypeCode === FccGlobalConstant.N003_TRANSFER) ||
      (this.option !== undefined && this.option !== null && this.option === FccGlobalConstant.OPTION_TRANSFER))) {
        const transferDetails = this.stateService.getSectionData('transferDetails');
        if (transferDetails &&
          transferDetails.get('currency').value !== '' &&
          transferDetails.get('currency').value !== null &&
          transferDetails.get('currency').value !== undefined) {
            this.currency = transferDetails.get('currency').value;
        }
      } else {
        const amountChargeDetails = this.stateService.getSectionData('amountChargeDetails');
        if (amountChargeDetails &&
          amountChargeDetails.get('currency').value !== '' &&
          amountChargeDetails.get('currency').value !== undefined &&
          amountChargeDetails.get('currency').value !== null) {
          this.currency = amountChargeDetails.get('currency').value;
        }
      }
      break;
      }
      default: break;
    }
  }

  updateDataArray(sectionForm: any, productCode: any) {
    const data = 'data';
    const finalArr = [];
    const lsRefId = 'ls_ref_id';
    const lsAllocatedAmt = 'ls_allocated_amt';
    this.setCurrencyForLicense(productCode);
    if ( sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== '' &&
    sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== null &&
    sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data] !== undefined) {
     const licenseArr = sectionForm.get(FccGlobalConstant.LICENSE)[FccGlobalConstant.PARAMS][data];
     for (let i = 0; i < licenseArr.length; i++) {
      const obj = {};
      obj[lsRefId] = licenseArr[i].REF_ID;
      obj[lsAllocatedAmt] = licenseArr[i].amount;
      licenseArr[i].currency = this.currency;
      finalArr.push(obj);
      }
     let obj2 = {};
     obj2[FccGlobalConstant.LICENSE] = finalArr;
     obj2 = JSON.stringify(obj2);
     sectionForm.get(FccGlobalConstant.LINKEDLICENSES).setValue(obj2);
  }
}

}
