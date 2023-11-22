import { FccGlobalConstant } from '../../../common/core/fcc-global-constants';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../common/services/common.service';
import { FCCFormGroup } from './../../../base/model/fcc-control.model';
import { MultiBankService } from './../../../common/services/multi-bank.service';
import { FccGlobalConstantService } from '../../../common/core/fcc-global-constant.service';
import { AccountLookupService } from '../../../common/services/accounts-lookup.service';
import { BulkMappingService } from '../../../common/services/bulk-mapping.service';
import { DropDownAPIService } from './../../../common/services/dropdownAPI.service';
import { FccTaskService } from './../../../common/services/fcc-task.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import moment from 'moment';




@Injectable({
  providedIn: 'root'
})
export class CashCommonDataService {
  emptyString = 'KEY_EMPTYSTRING';
  entityBankMap = new Map<string, any[]>();
  private readonly VALUE = 'value';
  constructor(protected translateService: TranslateService, protected http: HttpClient, protected commonService: CommonService,
    protected multiBankService: MultiBankService, protected fccGlobalConstantService: FccGlobalConstantService,
    protected accountLookupService: AccountLookupService, protected bulkMappingService: BulkMappingService,
    protected dropdownAPIService: DropDownAPIService,protected taskService: FccTaskService) { }

  public getStopChequeReasonParamData(response: any, bankName: string, language: string, elementId: any, product: string) {
    let stopChequeReasonList = [];
    const paramDetails = response.largeParamDetails;
    for (let i = 0; i < paramDetails.length; i++) {
      const keyDetails = paramDetails[i].largeParamKeyDetails;
      if (keyDetails.key_1 !== null) {
        if (keyDetails.key_1 !== '*' && keyDetails.key_2 === product && keyDetails.key_1 === bankName &&
          keyDetails.key_4 === language) {
          for (let j = 0; j < paramDetails[i].largeParamDataList.length; j++) {
            if (paramDetails[i].largeParamDataList[j].data_2 === FccGlobalConstant.CODE_Y) {
              if (stopChequeReasonList.length === FccGlobalConstant.ZERO) {
                stopChequeReasonList = [{ label: paramDetails[i].largeParamDataList[j].data_1,
                value: paramDetails[i].largeParamDataList[j].data_1 }];
              } else if (stopChequeReasonList.length > 0 && stopChequeReasonList[0].value !== '' ||
                          stopChequeReasonList[0].value !== null) {
                stopChequeReasonList.push({ label: paramDetails[i].largeParamDataList[j].data_1,
                value: paramDetails[i].largeParamDataList[j].data_1,
                id: elementId.concat('_').concat(paramDetails[i].largeParamDataList[j].data_1) });
              }
            }

          }
        } else if (keyDetails.key_1 === '*' && keyDetails.key_2 === product && keyDetails.key_4 === language) {
            for (let j = 0; j < paramDetails[i].largeParamDataList.length; j++) {
                if (stopChequeReasonList.length === FccGlobalConstant.ZERO) {
                  stopChequeReasonList = [{ label: paramDetails[i].largeParamDataList[j].data_1,
                  value: paramDetails[i].largeParamDataList[j].data_1 }];
                } else if (stopChequeReasonList.length > 0 && stopChequeReasonList[0].value !== '' ||
                            stopChequeReasonList[0].value !== null) {
                  stopChequeReasonList.push({ label: paramDetails[i].largeParamDataList[j].data_1,
                  value: paramDetails[i].largeParamDataList[j].data_1,
                  id: elementId.concat('_').concat(paramDetails[i].largeParamDataList[j].data_1) });
                }
            }
          }
      }
    }
    return stopChequeReasonList;
  }

  getDepositTypeList(paramDataList: any): any {
    return [...new Set(paramDataList.map(x => x.data_1))];
  }

  getTenorPeriodList(paramDataList: any, eventValue: any): any {
    const list = paramDataList.filter(value => (value.data_1 === eventValue)).map(a => a.data_4.concat(a.data_5));
    return [...new Set(list)];
  }

  getCurrencyList(paramDataList: any, eventValue: any, selectedDT: any): any {
    const tpNum = eventValue.substr(0, eventValue.length - 1);
    const tpCode = eventValue.substr(eventValue.length - 1);
    const curList = paramDataList.filter(value => value.data_1 === selectedDT && value.data_4 === tpNum && value.data_5 === tpCode)
    .map(a => a.data_6);
    return [...new Set(curList)];
  }

  getMaturityInstList(paramDataList: any, selectedDT: any): any {
    const tds = 'TDS';
    let miList;
    if (this.commonService.isNonEmptyValue(selectedDT)) {
      miList = paramDataList.filter(value => value.data_1 === selectedDT && value.data_2 === tds).map(a => a.data_3);
    }
    else {
      miList = paramDataList.filter(value => value.data_2 === tds).map(a => a.data_3);
    }
    return [...new Set(miList)];
  }

  getMaturityCreditEnable(paramDataList: any, selectedDT: any, maturityInst: any): any {
    const tds = 'TDS';
    let maturityCreditEnable;
    if (this.commonService.isNonEmptyValue(selectedDT)) {
      maturityCreditEnable = paramDataList.filter(
          value => value.data_1 === selectedDT && value.data_2 === tds && value.data_3 === maturityInst).map(a => a.data_5);
    }
    return maturityCreditEnable;
  }

  patchFieldParameters(control: any, params: object) {
    if (control == null || control === undefined) {
      return;
    }
    control.params = Object.assign(control.params, params);
    Object.keys(params).forEach(element => {
      if ('updateOptions' in control && element === 'options') {
        control.updateOptions();
      }
    });
  }

  loadBankList(form: FCCFormGroup, elementId: string, entityKey: string, disableBankDropdown = true): FCCFormGroup {
    let elementValue = form.get(elementId)?.value;
    let bankDisplay = false;
    if (elementValue === null) {
      elementValue = FccGlobalConstant.EMPTY_STRING;
    }
    if (!elementValue.length) {
      let bankList = [];
      let entity = '';
      this.multiBankService.getCustomerBankDetailsAPI(FccGlobalConstant.PRODUCT_FT,
        FccGlobalConstant.FT_TPT,
        FccGlobalConstant.REQUEST_INTERNAL).subscribe((result) => {
        if(result?.items?.length > 0) {
          result.items.forEach((item) => {
            bankList = [];
            item.banks.forEach((bank) => {
              const bankDetails: {label: string, value: any} = {
                label: this.commonService.decodeHtml(bank.bankShortName),
                value: {
                  label: this.commonService.decodeHtml(bank.bankShortName),
                  value: this.commonService.decodeHtml(bank.bankName),
                  shortName: this.commonService.decodeHtml(bank.bankShortName)
                }
              };
              bankList.push(bankDetails);
              entity = item.entityShortName;
            });
            if (bankList?.length > 1) {
              bankDisplay = true;
            }
            this.entityBankMap.set(entity, bankList);
          });
          const banks = this.entityBankMap.get(form.get(entityKey)?.value?.shortName);
          if (this.commonService.isEmptyValue(form.get(entityKey).value)) {
            this.patchFieldParameters(form.get(elementId), { options: [] });
            if (form.get(entityKey)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
              form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = disableBankDropdown;
            }
          } else {
            this.patchFieldParameters(form.get(elementId), { options: [...banks] });
          }
          if(banks?.length === 0){
            form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
          } else if(banks?.length === 1){
            form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
            form.get(elementId).setValue(banks[0].value);
          } else {
            if (bankDisplay) {
              form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
              form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
              if (form.get(entityKey)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) {
                form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = disableBankDropdown;
              }
            } else {
              form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
              form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
            }
          }
          form.updateValueAndValidity();
        }
      });
      return form;
    }
  }

  loadEntity(form: FCCFormGroup, elementId: string, bankKey: string): FCCFormGroup {
    let elementValue = form.get(elementId).value;
    if (this.commonService.isEmptyValue(elementValue)) {
      elementValue = FccGlobalConstant.EMPTY_STRING;
    }
    if (!elementValue.length) {
      const entityDataArray = [];
      if (form.get(elementId)['options'].length === 0) {
        this.commonService.getFormValues(this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.userEntities)
          .subscribe(result => {
            result.body.items.forEach(value => {
              const entity: { label: string; value: any } = {
                label: this.commonService.decodeHtml(value?.shortName),
                value: {
                  label: this.commonService.decodeHtml(value?.shortName),
                  name: this.commonService.decodeHtml(value?.name),
                  shortName: this.commonService.decodeHtml(value?.shortName),
                  country: this.commonService.decodeHtml(value?.country),
                  id: this.commonService.decodeHtml(value?.id)
                }
              };
              entityDataArray.push(entity);
            });
            entityDataArray.sort((a, b) => {
              const x = a.label.toLowerCase();
              const y = b.label.toLowerCase();
              if (x < y) {
                return -1;
              }
              if (x > y) {
                return 1;
              }
              return 0;
            });
            this.patchFieldParameters(form.get(elementId), { options: entityDataArray });
            const valObj = this.dropdownAPIService.getDropDownFilterValueObj(entityDataArray, elementId, form);
    if (valObj && valObj[this.VALUE] && !this.taskService.getTaskEntity())
     {
       form.get(elementId).patchValue(valObj[this.VALUE]); 
       this.multiBankService.setCurrentEntity(valObj[this.VALUE].name);
       }
    form.updateValueAndValidity();
            if(entityDataArray.length === 0){
              form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]=false;
              form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED]=false;
              form.get(elementId).setErrors(null);
              form.get(elementId).clearValidators();
            } else if(entityDataArray.length === 1){
              form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]=true;
              form.get(elementId).setValue(entityDataArray[0].value);
              form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
              if(elementId === FccGlobalConstant.BK_ENTITY){
                this.bulkMappingService.getDropdownValues(form, 
                  this.commonService.isnonEMptyString(form.get(FccGlobalConstant.BK_ENTITY).value) ?
                  form.get(FccGlobalConstant.BK_ENTITY).value.shortName : '*');
              }
              form.get(FccGlobalConstant.FT_ENTITY_NAME).setValue(entityDataArray[0]?.value?.name);
              form = this.loadBankList(form, bankKey, elementId, false);
            } else {
              form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]=true;
            }
          });
      }
    }
    return form;
  }

  getTransferFromLookup(form){
    const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    const subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    const entityName = form.get(FccGlobalConstant.FT_ENTITY).value;
    const bankName = form.get(FccGlobalConstant.FT_BANK).value;
    this.accountLookupService.fetchAccountDetails(form, productCode, subProductCode, entityName, 
      bankName,FccGlobalConstant.USER_ACCOUNT);
  }

  getBulkTransferFromLookup(form, entity, bank, subProductCode){
    const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    const entityName = form.get(entity).value;
    const bankName = form.get(bank).value;
    this.accountLookupService.fetchAccountDetails(form, productCode, subProductCode, entityName, 
      bankName,FccGlobalConstant.USER_ACCOUNT);
  }

  getTranserToLookup(form){
    const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    const subProductCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_PRODUCT_CODE);
    const entityName = form.get(FccGlobalConstant.FT_ENTITY).value;
    const bankName = form.get(FccGlobalConstant.FT_BANK).value;
    this.accountLookupService.fetchBeneficiaryDetails(form, productCode, subProductCode, 
      entityName, bankName, FccGlobalConstant.BENEACCOUNTS);   
  }
  
  checkAmountValidation(issuingBank, currency, accountId){
      const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
      const reqURl =
       `${this.fccGlobalConstantService.pabAmountValidationUrl}`;
      const params = new HttpParams({
        fromObject: {
          issuingBank,
          currency,
          accountId
        }
      });
      return this.http.get<any>(
        reqURl,
        { headers, params }
      );
    }
  

  getHolidayCutoff( currency?: string, amount?: string, subProductCode?: string, bankShortName?: string, timezone?: string){
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqURl = `${this.fccGlobalConstantService.holidayCutOffs}`;
    const holidayAndCutoffPayload = {
      issueDate: timezone ? moment().tz(timezone).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD'),
      amount,
      currency,
      subProductCode,
      isHolidayCutoffValid: true,
      bankShortName: bankShortName || ''
    };
    
    return this.http.post<any>(reqURl, holidayAndCutoffPayload, { headers } );
  }
}
