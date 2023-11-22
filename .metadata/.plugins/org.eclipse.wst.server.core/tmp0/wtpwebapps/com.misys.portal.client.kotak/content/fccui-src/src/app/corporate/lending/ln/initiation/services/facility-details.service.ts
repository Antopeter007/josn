import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CodeData } from './../../../../../common/model/codeData';
import { CommonService } from './../../../../../common/services/common.service';
import { TransactionDetailService } from './../../../../../common/services/transactionDetail.service';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';

/**
 * Facility Details service
 */
@Injectable({
  providedIn: 'root'
})
export class FacilityDetailsService {

  constructor(protected commonService: CommonService, protected stateService: ProductStateService,
              protected translateService: TranslateService, protected transactionDetailService: TransactionDetailService,
              protected currencyConverterPipe: CurrencyConverterPipe) { }

  private facilityDetailsObj: any;
  private selectedCurrency: any;
  private repricingFrequency: any;
  private borrowersObj: any;
  private riskTypesObj: any;
  private pricingOptionsObj: any;

  private currentBorrowerData: any;
  private currentBorrowerCurrenciesObj: any;
  private currentRiskTypeObj: any[] = [];
  private currentPricingOptionObj: any[] = [];
  private repricingdateValidation: any;
  private remittanceFlag: any;
  private remittanceFlagRepricing: any;
  referenceId: any = [];

  tableColumns = [];
  bkCurCode;
  totalAmtRepriced = 0 ;
  accountNumber: any = 'accountNumber';
  currency: any = 'currency';
  description: any = 'description';
  loansAdded: any;
  facilityName: any;
  itemArray = [];
  codeData = new CodeData();
  transactionSubscription: Subscription[] = [];
  pricingOptionLongDesc: any;
  innerControlArray = []; o;
  bulkLoanListOptions = [];
  totalNewLoanAmount = 0;

  setFacilityDetailsObj(value: any) {
    this.clearAllData();
    this.facilityDetailsObj = value;
    this.getBorrowersObj();
    this.getRiskTypeObj();
    this.getPricingOptionObj();
  }

  setSelectedCurrency(value: any) {
    this.selectedCurrency = value;
  }

  setRepricingFrequency(value: any) {
    this.repricingFrequency = value;
  }

  setRepricingdateValidation(value: any) {
    this.repricingdateValidation = value;
  }

  setRemittanceFlag(value: any) {
    this.remittanceFlag = value;
  }

  setRemittanceFlagRepricing(value: any) {
    this.remittanceFlagRepricing = value;
  }

  public getFacilityDetailsObj() {
    return this.facilityDetailsObj ? this.facilityDetailsObj : '';
  }

  public getSelectedCurrency() {
    return this.selectedCurrency ? this.selectedCurrency : '';
  }

  public getRepricingFrequency() {
    return this.repricingFrequency ? this.repricingFrequency : '';
  }

  private getBorrowersObj() {
    const borrowers = 'borrowers';
    if (this.getFacilityDetailsObj()[borrowers]) {
      this.borrowersObj = this.getFacilityDetailsObj()[borrowers];
    }
    return this.borrowersObj;
  }

  private getRiskTypeObj() {
    const riskTypes = 'riskTypes';
    if (this.getFacilityDetailsObj()[riskTypes]) {
      this.riskTypesObj = this.getFacilityDetailsObj()[riskTypes];
    }
    return this.riskTypesObj;
  }

  private getPricingOptionObj() {
    const pricingOptions = 'pricingOptions';
    if (this.getFacilityDetailsObj()[pricingOptions]) {
      this.pricingOptionsObj = this.getFacilityDetailsObj()[pricingOptions];
    }
    return this.pricingOptionsObj;
  }

  setCurrentBorrower(lnBorrowerID?: string) {
    if (this.borrowersObj) {
      this.borrowersObj.forEach(element => {
        if (element.borrowerId === lnBorrowerID) {
          this.currentBorrowerData = element;
        }
      });
    }
  }

  getCurrentBorrowerCurrencies() {
    const currencies = 'currencies';
    this.currentBorrowerCurrenciesObj = this.currentBorrowerData.has(currencies) ? this.currentBorrowerData.get(currencies) : [];
    return this.currentBorrowerCurrenciesObj;
  }

  setSwinglineData(swinglineVal: string) {
    this.currentRiskTypeObj = [];
    this.currentPricingOptionObj = [];
    if (this.riskTypesObj) {
      this.riskTypesObj.forEach(element => {
        if (element.isSwingline === swinglineVal) {
          this.currentRiskTypeObj.push(element);
        }
      });
    }
    if (this.pricingOptionsObj) {
      this.pricingOptionsObj.forEach(element => {
        if (element.isSwingLinePricingOption === swinglineVal) {
          this.currentPricingOptionObj.push(element);
        }
      });
    }
  }

  getRiskTypes() {
    return this.currentRiskTypeObj;
  }

  getPricingOptions() {
    return this.currentPricingOptionObj;
  }

  getRepricingdateValidation() {
    return this.repricingdateValidation;
  }

  getRemittanceFlag() {
    return this.remittanceFlag;
  }

  getRemittanceFlagRepricing() {
    return this.remittanceFlagRepricing;
  }

  getColumns() {
    this.tableColumns = [];
    this.tableColumns = [
              {
                field: 'accountNumber',
                header: `${this.translateService.instant('accountNumber')}`,
                width: '33%'
              },
              {
                field: 'currency',
                header: `${this.translateService.instant('currency')}`,
                width: '33%'
              },
              {
                field: 'description',
                header: `${this.translateService.instant('description')}`,
                width: '33%'
              }];
    return this.tableColumns;
  }
  buildTable(sectionForm) {
    const sectionFormq = JSON.parse(sectionForm.value.repricingOldLoansReq);
    const newLoansData = [];
    this.totalNewLoanAmount = 0;
    if (Array.isArray(sectionFormq)) {
      sectionFormq.forEach((loan) => {
        this.prepareNewLoanData(loan, newLoansData);
      });
    } else {
      this.prepareNewLoanData(sectionFormq, newLoansData);
    }
    const totalNewAmt = `${this.bkCurCode} ${this.currencyConverterPipe.transform(this.totalNewLoanAmount.toString(), this.bkCurCode)}`;
    sectionForm.get('totalNewLoanAmount')[FccGlobalConstant.VALUE] = totalNewAmt;
    sectionForm.get('totalNewLoanAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    return {
      newTableData : { columns: this.getColumnsNewLoan(), data: newLoansData }
    };
  }

  private prepareNewLoanData(sectionFormq: any, newLoansData: any[]) {
    const attachmentResultObj = {
      bankReference: sectionFormq.ref_id,
      loanType: sectionFormq.pricing_option,
      ccy: sectionFormq.ln_cur_code,
      newAmount: sectionFormq.ln_amt,
      rollOverDate: sectionFormq.repricing_date
    };
    if (sectionFormq && sectionFormq.ref_id && this.findIdInList(sectionFormq.ref_id)) {
      newLoansData.push(attachmentResultObj);
      this.totalNewLoanAmount = this.totalNewLoanAmount + Number(this.commonService.replaceCurrency(attachmentResultObj.newAmount));
    }
  }

  findIdInList(refId): boolean{
    const index = this.referenceId.indexOf(refId.toString());
    if (index > -1 ){
      return false;
    }else {
      return true;
    }
  }

  getColumnsNewLoan() {
    return [
      {
        field: 'bankReference',
        header: `${this.translateService.instant('channelReference')}`,
        width: '25%',
      },
      {
        field: 'loanType',
        header: `${this.translateService.instant('loanType')}`,
        width: '15%',
      },
      {
        field: 'ccy',
        header: `${this.translateService.instant('ccy')}`,
        width: '15%',
      },
      {
        field: 'newAmount',
        header: `${this.translateService.instant('newAmount')}`,
        width: '20%',
        align: 'right'
      },
      {
        field: 'rollOverDate',
        header: `${this.translateService.instant('rollOverDate')}`,
        width: '15%',
      }
    ];
  }

  retrivingOldData(sectionForm: FCCFormGroup, fieldName: string, sectionName: string) {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if ( mode !== FccGlobalConstant.INITIATE) {
      if (fieldName === 'interestPayments') {
        this.retriveInterestPaymentData(sectionForm, sectionName);
      } else if (fieldName === 'feeCycleTable') {
        this.retriveFeeCycleTable(sectionForm, sectionName);
      } else {
        this.retrivingOldLoanData(sectionForm);
      }
    }
  }
  retriveFeeCycleTable(sectionForm: any, sectionName: string) {
    let tmpArray = [];
    if (sectionForm.get('feeListRead') && sectionForm.get('feeListRead').value) {
      if (Array.isArray(JSON.parse(sectionForm.get('feeListRead').value))
          && JSON.parse(sectionForm.get('feeListRead').value).length > 0) {
        tmpArray = JSON.parse(sectionForm.get('feeListRead').value);
        sectionForm.get('feeCycleTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        sectionForm.get('feeCycleTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = tmpArray;
        sectionForm.get('feeCycleTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = tmpArray;
      } else if (typeof JSON.parse(sectionForm.get('feeListRead').value) === 'object') {
        tmpArray.push(JSON.parse(sectionForm.get('feeListRead').value));
        sectionForm.get('feeCycleTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        sectionForm.get('feeCycleTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = tmpArray;
        sectionForm.get('feeCycleTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = tmpArray;
      }
    } else {
      sectionForm.get('feeCycleTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    this.stateService.setStateSection(sectionName, sectionForm);
    sectionForm.updateValueAndValidity();

  }
  retriveInterestPaymentData(sectionForm: any, sectionName: string) {
    let interestPaymentArray = [];
    if (sectionForm.get('getInterestDueAmts') && sectionForm.get('getInterestDueAmts').value) {
      const getInterestDueAmts = JSON.parse(sectionForm.get('getInterestDueAmts').value);
      const getCycleStartDates = JSON.parse(sectionForm.get('getCycleStartDates').value);
      const bkCurCode = this.stateService.getSectionData(
        FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('bkCurCode').value;

      if (Array.isArray(getInterestDueAmts)) {
        const interestDueAmts = getInterestDueAmts.map(item => ({
            loan_alias: item.loan_alias,
            amt: parseFloat(item.value).toFixed(FccGlobalConstant.LENGTH_2)
          }));
        const cycleStartDates = getCycleStartDates.map(item => ({
            loan_alias: item.loan_alias,
            date: item.value
          }));
        const interestArray1 = this.mergeArray(interestDueAmts, cycleStartDates, 'loan_alias');

        const interestArray = interestArray1.map((item) => ({
              alias: item.loan_alias,
              currency: bkCurCode,
              totalProjectedEOCamt: item.amt,
            }));
        interestPaymentArray = interestArray;
      } else {
        if (getInterestDueAmts && getInterestDueAmts.loan_alias !== undefined) {
          const interestArray = [
            {
              alias: getInterestDueAmts.loan_alias,
              currency: bkCurCode,
              totalProjectedEOCamt: getInterestDueAmts.value
            }
          ];
          interestPaymentArray = interestArray;
        }
      }
      if (interestPaymentArray && interestPaymentArray.length > 0) {
        sectionForm.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        sectionForm.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = interestPaymentArray;
        sectionForm.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = interestPaymentArray;
      } else {
        sectionForm.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.stateService.setStateSection(sectionName, sectionForm);
      sectionForm.updateValueAndValidity();
      this.stateService.getSectionData(sectionName);
      sectionForm.updateValueAndValidity();
    }
  }

  mergeArray(a1, a2, key) {
    return a1.map(itm => ({
          ...a2.find((item) => (item[key] === itm[key]) && item),
          ...itm
      }));
  }

  retrivingOldLoanData(sectionForm: any) {
    const referenceList = [];
    const updatedBulkLoanData = [];
    if (sectionForm.get('childRefIDs') && sectionForm.get('childRefIDs').value ) {
      const refObj = JSON.parse(sectionForm.get('childRefIDs').value);
      if (Array.isArray(refObj.cross_reference)) {
        refObj.cross_reference.forEach((refList) => {
          const selectedData = ['child_ref_id'];
          const obj = {};
          Object.keys(refList).forEach((element) => {
            selectedData.forEach((key) => {
              if (element === key) {
                obj[FccGlobalConstant.CHANNELREF] = refList[element];
              }
            });
          });
          referenceList.push(obj);
        });
      } else if (typeof refObj.cross_reference === 'object') {
        const selectedData = ['child_ref_id'];
        const obj = {};
        selectedData.forEach((key) => {
          obj[FccGlobalConstant.CHANNELREF] = refObj.cross_reference[key];
        });
        referenceList.push(obj);
      }
    }
    this.referenceId = [];
    referenceList.forEach(element => {
      const refID = element[FccGlobalConstant.CHANNELREF];
      this.referenceId.push(refID);
      if (sectionForm.get('repricingOldLoansReq') && sectionForm.get('repricingOldLoansReq').value ) {
        const refObj = JSON.parse(sectionForm.get('repricingOldLoansReq').value);
        if (Array.isArray(refObj)) {
          refObj.forEach(responseObj => {
            if (refID === responseObj[FccGlobalConstant.CHANNELREF]) {
              this.prepareDisplayableData(responseObj, updatedBulkLoanData);
            }
          });
        } else if (refID === refObj[FccGlobalConstant.CHANNELREF]) {
          this.prepareDisplayableData(refObj, updatedBulkLoanData);
        }
      }
    });
    this.bulkLoanListOptions = [];
    this.totalAmtRepriced = 0;
    this.itemArray = [];
    if (updatedBulkLoanData.length > 0) {
      updatedBulkLoanData.forEach(obj => this.setBulkLoanListOptions(obj));
    }
    const headerLabel = `${this.translateService.instant('selectedLoans')} | ${this.facilityName}`;
    this.bulkLoanListOptions = [
      {
        header: headerLabel,
        data: this.itemArray
      }
    ];
    const totalAmtRepricedWithCur = `${
      this.bkCurCode
    } ${this.currencyConverterPipe.transform(
      String(this.totalAmtRepriced),
      this.bkCurCode
    )}`;
    sectionForm.get('bulkLoansList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = this.bulkLoanListOptions;
    sectionForm.get('totalRepricedAmt')[FccGlobalConstant.VALUE] = totalAmtRepricedWithCur;
    const tmpData = this.buildTable(sectionForm);
    sectionForm.get('newLoansTable')[FccGlobalConstant.PARAMS] = {
      ...sectionForm.get('newLoansTable')[FccGlobalConstant.PARAMS],
      columns: tmpData.newTableData[`columns`],
      data: tmpData.newTableData[`data`] };
    if (this.totalAmtRepriced > this.totalNewLoanAmount) {
      const pricipalPayment = `${
        this.bkCurCode
      } ${this.currencyConverterPipe.transform(
        (this.totalAmtRepriced - this.totalNewLoanAmount).toString(),
        this.bkCurCode
      )}`;
      sectionForm.get('principalPayment')[FccGlobalConstant.VALUE] = pricipalPayment;
      sectionForm.get('principalPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    } else if (this.totalAmtRepriced < this.totalNewLoanAmount) {
      const increaseAmount = `${
        this.bkCurCode
      } ${this.currencyConverterPipe.transform(
        (this.totalNewLoanAmount - this.totalAmtRepriced).toString(),
        this.bkCurCode
      )}`;
      sectionForm.get('increaseAmount')[FccGlobalConstant.VALUE] = increaseAmount;
      sectionForm.get('increaseAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
  }

  private prepareDisplayableData(refObj: any, updatedBulkLoanData: any[]) {
    this.facilityName = refObj.bo_facility_name;
    this.bkCurCode = refObj.bkCurCode;
    const selectedData = ['bo_ref_id', 'ln_cur_code', 'ln_liab_amt', 'repricing_date',
      'ref_id', 'effective_date', 'repricing_frequency', 'fx_conversion_rate'];
    const obj = {};
    selectedData.forEach(key => {
      Object.keys(refObj).forEach(ele => {
        if (ele === key) {
          obj[ele] = refObj[ele];
        }
      });
    });
    this.pricingOptionLongDesc = refObj.pricing_option;
    updatedBulkLoanData.push(obj);
  }

  getCodeData(pricingOption: string){
    this.codeData.codeId = FccGlobalConstant.CODEDATA_PRICING_OPTION_CODES_C030;
    this.codeData.productCode = FccGlobalConstant.PRODUCT_LN;
    this.codeData.subProductCode = '';
    this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
      localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
    this.transactionSubscription.push(
      this.commonService
        .getCodeDataDetails(this.codeData)
        .subscribe((response) => {
          response.body.items.forEach((responseValue) => {
            if (responseValue.value === pricingOption) {
              this.pricingOptionLongDesc = responseValue.longDesc;
            }
          });
        })
    );
  }

  setBulkLoanListOptions(outstandingAliasInfo: any) {
    this.itemArray.push({
      options: this.getNestedAccordion(this.pricingOptionLongDesc, outstandingAliasInfo),
      nestedAccordion: true,
      labelStyle: ['label-header']
    });
  }

  protected getNestedAccordion(pricingOption: string, outstandingAliasInfo: any) {
    this.innerControlArray = [];
    const subHeaderLabel = `${pricingOption} | ${outstandingAliasInfo.bo_ref_id}`;
    const amt = this.commonService.replaceCurrency(String(outstandingAliasInfo.ln_liab_amt));
    const valueupdated = this.currencyConverterPipe.transform(amt, outstandingAliasInfo.ln_cur_code);
    this.totalAmtRepriced += Number(this.commonService.replaceCurrency(valueupdated));
    this.bkCurCode = outstandingAliasInfo.ln_cur_code;
    const subDescLabel = `${outstandingAliasInfo.ln_cur_code} ${outstandingAliasInfo.ln_liab_amt}`;
    for (const [key, loanValue] of Object.entries(outstandingAliasInfo)) {
      if (key !== 'bo_ref_id' && key !== 'ln_cur_code' && key !== 'ln_liab_amt'
          && key !== 'repricing_frequency') {
        this.innerControlArray.push({
          label: `${this.translateService.instant(key)}`,
          value: loanValue,
          valueStyle: ['fieldvalue']
        });
      }
      if (key === 'repricing_frequency') {
        this.innerControlArray.push({
          label: `${this.translateService.instant(key)}`,
          value: this.translateService.instant(`repricingFrequency_${loanValue}`),
          valueStyle: ['fieldvalue']
        });
      }
    }
    return [{ header: subHeaderLabel, data: this.innerControlArray, description: subDescLabel }];
  }

  handleRemInstTable(control: any, sectionForm: any, productCode: any, sectionName: any) {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    let currencyVal;
    let remInstAccountNoVal;
    let remInstDescriptionVal;
    let remInst = {};
    if (sectionForm.get('remittanceInstructions') && sectionForm.get('remittanceInstructions').value) {
      remInst = JSON.parse( sectionForm.get('remittanceInstructions').value);
      sectionForm.get('remInstAccountNo')[FccGlobalConstant.VALUE] = remInst[`account_no`];
      sectionForm.get('remInstDescription')[FccGlobalConstant.VALUE] = remInst[`description`];
    }
    if ( mode !== FccGlobalConstant.INITIATE) {
      if ((sectionForm.get('currency') && sectionForm.get('currency').value) ||
          (sectionForm.get('bkCurCode') && sectionForm.get('bkCurCode').value)) {
        currencyVal = sectionForm.get('bkCurCode') ?
                      sectionForm.get('bkCurCode').value :
                      sectionForm.get('currency').value.shortName;
      }
      if (sectionForm.get('remInstAccountNo') && sectionForm.get('remInstAccountNo').value) {
        remInstAccountNoVal = sectionForm.get('remInstAccountNo').value;
      }
      if (sectionForm.get('remInstDescription') && sectionForm.get('remInstDescription').value) {
        remInstDescriptionVal = sectionForm.get('remInstDescription').value;
      }
      if (currencyVal && (remInstAccountNoVal || remInstDescriptionVal || remInstDescriptionVal)) {
        const dataArray = [];
        const selectedJson: { accountNumber: any, currency: any, description: any } = {
          accountNumber: remInstAccountNoVal,
          currency: currencyVal,
          description: remInstDescriptionVal
        };
        dataArray.push(selectedJson);
        const obj = {};
        obj[FccGlobalConstant.RESPONSE_DATA] = dataArray;
        this.handleRemInstGrid(obj, control, sectionForm, productCode, sectionName);
      }
    }
  }

  handleRemInstGrid(response: any, fieldControl: any, sectionForm: any, productCode: any, sectionName: any) {
    sectionForm.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.COLUMNS] = this.getColumns();
    this.stateService.setStateSection(sectionName, sectionForm);
    sectionForm.updateValueAndValidity();
    // }
    this.stateService.getSectionData(sectionName);
    sectionForm.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = response.responseData;
    if (response && response.responseData && response.responseData.length > 0) {
      sectionForm.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = response.responseData[0];
    }
    sectionForm.updateValueAndValidity();
    sectionForm.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    const sessionArr = sectionForm.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.COLUMNS];
    if (sessionArr.length === 0) {
      sectionForm.get('remittanceInst')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
  }

  clearAllData() {
    this.facilityDetailsObj = undefined;
    this.selectedCurrency = undefined;
    this.repricingFrequency = undefined;
    this.borrowersObj = undefined;
    this.riskTypesObj = undefined;
    this.pricingOptionsObj = undefined;
    this.currentBorrowerData = undefined;
    this.currentBorrowerCurrenciesObj = undefined;
    this.currentRiskTypeObj = [];
    this.currentPricingOptionObj = [];
    this.repricingdateValidation = undefined;
    this.remittanceFlag = undefined;
    this.remittanceFlagRepricing = undefined;
  }
}
