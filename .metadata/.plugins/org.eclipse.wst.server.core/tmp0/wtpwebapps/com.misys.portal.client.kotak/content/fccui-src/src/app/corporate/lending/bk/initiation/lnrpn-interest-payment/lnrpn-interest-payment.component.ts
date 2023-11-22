import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subscription } from 'rxjs';

import { LnrpnProductComponent } from '../lnrpn-product/lnrpn-product.component';
import { FCCFormGroup } from './../../../../../../app/base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../../app/common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../../app/common/core/fcc-global-constants';
import { CommonService } from './../../../../../../app/common/services/common.service';
import { FileHandlingService } from './../../../../../../app/common/services/file-handling.service';
import { HideShowDeleteWidgetsService } from './../../../../../../app/common/services/hide-show-delete-widgets.service';
import { SessionValidateService } from './../../../../../../app/common/services/session-validate-service';
import { FccGlobalConfiguration } from './../../../../../common/core/fcc-global-configuration';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../common/services/form-model.service';
import { ListDefService } from './../../../../../common/services/listdef.service';
import { ResolverService } from './../../../../../common/services/resolver.service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from './../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from './../../../../trade/lc/initiation/services/filelist.service';
import { FormControlService } from './../../../../trade/lc/initiation/services/form-control.service';
import { UtilityService } from './../../../../trade/lc/initiation/services/utility.service';

@Component({
  selector: 'app-lnrpn-interest-payment',
  templateUrl: './lnrpn-interest-payment.component.html',
  styleUrls: ['./lnrpn-interest-payment.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LnrpnInterestPaymentComponent }]
})
export class LnrpnInterestPaymentComponent extends LnrpnProductComponent implements OnInit {
  contextPath: string;
  tnxTypeCode: any;
  option: any;
  productCode: any;
  form: FCCFormGroup;
  mode: any;
  module = `${this.translateService.instant('lnrpnInterestPayment')}`;
  tableColumns = [];
  borefidValue: string;
  bkCurCode: string;
  interestPaymentDetails: any = [];
  totalProjectedEOCamtTotal: any = 0;
  totalAmountInterest: any = 0;
  interestPaymentAmount = new BehaviorSubject<any>(0);
  arr: any = [];

  interestPaymentLoanFlag: any;
  interestTableSubscription: Subscription[] = [];
  interestPaymentArray: any;
  subscription: Subscription;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected translateService: TranslateService, protected router: Router, protected leftSectionService: LeftSectionService,
              public dialogService: DialogService, public uploadFile: FilelistService, public deleteFile: CommonService,
              public downloadFile: CommonService, protected listService: ListDefService,
              protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
              public autoUploadFile: CommonService, protected fileListSvc: FilelistService,
              protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected eventEmitterService: EventEmitterService, protected stateService: ProductStateService,
              protected fileHandlingService: FileHandlingService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
              protected fccGlobalConfiguration: FccGlobalConfiguration) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileListSvc, dialogRef,
      currencyConverterPipe);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.borefidValue = this.stateService.getSectionData(
      FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('repricingOldLoanAliases').value;
    this.bkCurCode = this.stateService.getSectionData(
      FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('bkCurCode').value;
    this.initializeFormGroup();
    this.interestPaymentLoanFlag = this.stateService.getSectionData(
      FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('interestPaymentLoanFlag').value;
    this.getInterestPayments();
    this.setInterestPaymentData();
  }

  getInterestPayments() {
    this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    const paginatorParams = {};
    const filterValues = {};
    const borefid = 'borefid';
    filterValues[borefid] = this.borefidValue;
    const filterParams = JSON.stringify(filterValues);
    this.interestTableSubscription.push(
    this.listService.getTableData(
      'loan/listdef/customer/LN/inquiryLNInterestPayments', filterParams , JSON.stringify(paginatorParams))
      .subscribe(result => {
      this.interestPaymentDetails = result.rowDetails;
      this.setUpInterestPayment(result.rowDetails);
      this.setInterestPaymentData();
    }));
  }

  parseInterestDueAmtsData() {
    if ((!(this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW]) ||
    this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW].length === 0)
    && this.form.get('getInterestDueAmts') && this.form.get('getInterestDueAmts').value) {
      const getInterestDueAmts = JSON.parse(this.form.get('getInterestDueAmts').value);
      const getCycleStartDates = JSON.parse(this.form.get('getCycleStartDates').value);

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
              currency: this.bkCurCode,
              disable: false,
              current_cycle_start_date: item.date,
              totalProjectedEOCamt: item.amt,
            }));
        this.interestPaymentArray = interestArray;
      } else {
        if (getInterestDueAmts && getInterestDueAmts.loan_alias !== undefined) {
          const interestArray = [
            {
              alias: getInterestDueAmts.loan_alias,
              currency: this.bkCurCode,
              disable: false,
              current_cycle_start_date: getCycleStartDates.value,
              totalProjectedEOCamt: getInterestDueAmts.value
            }
          ];
          this.interestPaymentArray = interestArray;
        } else {
          this.interestPaymentArray = [];
        }
      }
      this.patchInterestDataForPayload(this.interestPaymentArray);
    } else if (this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] &&
    this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW].length > 0){
      const arr2 = this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW];
      this.patchInterestDataForPayload(arr2);
    }
  }


  mergeArray(a1, a2, key) {
    return a1.map(itm => ({
          ...a2.find((item) => (item[key] === itm[key]) && item),
          ...itm
      }));
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.LNRPN_INTEREST_PAYMENT;
    this.form = this.stateService.getSectionData(sectionName);
    this.form.updateValueAndValidity();
    this.setInterestPaymentData();
  }

  setInterestPaymentData() {
    if (this.mode === 'view') {
      const sectionForm: FCCFormGroup = this.stateService.getSectionData(FccGlobalConstant.LNRPN_INTEREST_PAYMENT, this.productCode);
      if (sectionForm.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].length > 0) {
        sectionForm.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        sectionForm.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
      this.stateService.setStateSection(FccGlobalConstant.LNRPN_INTEREST_PAYMENT, sectionForm);
    }
  }

  setUpInterestPayment(interestPaymentDetails){
    let interestPaymentData: any = [];
    if (interestPaymentDetails && interestPaymentDetails.length > 0) {
      interestPaymentData = this.interestPaymentDataSetter(interestPaymentDetails);
      if (this.interestPaymentLoanFlag === 'false') {
        this.patchFieldParameters(this.form.get('interestPayments'), { data: interestPaymentData });
        this.patchFieldParameters(this.form.get('interestPayments'), { hasData: true });
        this.calculateInterestPaymentAmountTotal(interestPaymentData);

        this.form.get('interestPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.CHECKBOX_REQUIRED] = false;
        this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.arr = interestPaymentData.map( res => ({
              alias: res.alias,
              current_cycle_start_date: res.current_cycle_start_date,
              totalProjectedEOCamt: res.totalProjectedEOCamt }));
        this.patchInterestDataForPayload(this.arr);
      } else if (this.interestPaymentLoanFlag === 'true') {
        const interestPaymentData2: any = [];
        interestPaymentData.forEach( (element: any) => {
          const amount = parseFloat(this.commonService.replaceCurrency(element.totalProjectedEOCamt.toString()));
          if (amount <= 0) {
            element[FccGlobalConstant.DISABLE] = true;
          } else {
            element[FccGlobalConstant.DISABLE] = false;
          }
          interestPaymentData2.push(element);
        });
        this.patchFieldParameters(this.form.get('interestPayments'), { data: interestPaymentData2 });
        this.patchFieldParameters(this.form.get('interestPayments'), { hasData: true });
        this.parseInterestDueAmtsData();
        this.setInterestPaymentInSelectedRow();
        this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        const totalAmountInterest = interestPaymentData2.reduce((accum, item) =>
        accum + parseFloat(this.commonService.replaceCurrency(item.totalProjectedEOCamt.toString())), 0);

        this.form.get('interestPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        if (totalAmountInterest > 0) {
          this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.CHECKBOX_REQUIRED] = true;
        } else {
          this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.CHECKBOX_REQUIRED] = false;
        }
      }

      this.patchExtraMethod();
    }
  }

  patchExtraMethod() {
    this.parseInterestDueAmtsData();
    this.setInterestPaymentInSelectedRow();
    if (this.totalProjectedEOCamtTotal <= 0) {
      this.patchFieldValueAndParameters(this.form.get('interestPayment'), 'N', {});
      this.form.get('interestPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true; // Hide-interest-payment-table
      this.form.updateValueAndValidity();
    } else if (this.totalProjectedEOCamtTotal > 0) {
      this.patchFieldValueAndParameters(this.form.get('interestPayment'), 'Y', {});
      this.form.get('interestPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true; // Hide-interest-payment-table
      this.form.updateValueAndValidity();
    }
  }


  findWithAttr(array, attr, obj) {
    for ( let i = 0; i < array.length; i += 1 ) {
      if (array[i][attr] === obj[attr]) {
        return i;
      }
    }
    return -1;
  }

  onFormTableRowSelect(event: any) {
    if (event && event.data) {
      const abc = event.data;
      if (this.findWithAttr(this.arr, 'alias', abc) === -1) {
        this.arr.push(abc);
      }
    }
    this.patchInterestDataForPayload(this.arr);
  }

  onFormTableRowUnSelect(event: any) {
    if ((event && event.data) && (this.arr.length > 0) && (this.findWithAttr(this.arr, 'alias', event.data) !== -1)) {
      const index = this.findWithAttr(this.arr, 'alias', event.data);
      this.arr.splice(index, 1);
    }
    this.patchInterestDataForPayload(this.arr);
  }


  onFormTableHeaderCheckboxToggle(event: any) {
    const checked = event.checked;
    if (checked) {
      const data = this.interestPaymentDataSetter(this.interestPaymentDetails);
      const positiveAmountData = data.filter(obj => {
        const amount = parseFloat(this.commonService.replaceCurrency(obj.totalProjectedEOCamt.toString()));
        if (amount > 0) {
          return obj;
        }
      }).map(item => {
        if (item) {
          return {
            alias: item.alias,
            currency: item.currency,
            disable: false,
            current_cycle_start_date: item.current_cycle_start_date,
            totalProjectedEOCamt: item.totalProjectedEOCamt,
          };
        }
      });
      this.patchInterestDataForPayload(positiveAmountData);
    } else if (!checked){
      this.patchInterestDataForPayload([]);
    }
  }

  patchInterestDataForPayload(arr) {
    if (arr && arr.length > 0) {

      arr = arr.map(item => ({
          alias: item.alias,
          currency: item.currency,
          disable: false,
          current_cycle_start_date: item.current_cycle_start_date,
          totalProjectedEOCamt: parseFloat(this.commonService.replaceCurrency(item.totalProjectedEOCamt.toString()))
        }));

      const newArray = this.interestPaymentArrayMap(arr);

      const arrayObj = arr.map(item => ({
          loanAlias: item.alias,
          interesteDueAmt: item.totalProjectedEOCamt,
          cycleStartDate: item.current_cycle_start_date // need to change start date
        }));
      const obj1 = {};
      const interestPayment = 'interestPayment';
      obj1[interestPayment] = arrayObj;
      this.patchFieldValueAndParameters(this.form.get('interestPaymentData'), JSON.stringify(obj1), {});
      this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = newArray;
      this.arr = newArray;
    } else if (arr && arr.length <= 0) {
      const obj1 = {};
      this.patchFieldValueAndParameters(this.form.get('interestPaymentData'), JSON.stringify(obj1), {});
      this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = [];
      this.arr = [];
    }
    this.calculateInterestPaymentAmountTotal(arr);
    this.checkBorrowerSettlementOnLoad();
  }


  interestPaymentArrayMap(arr: any) {
    return arr.map(item => ({
        alias: item.alias,
        currency: item.currency,
        disable: false,
        current_cycle_start_date: item.current_cycle_start_date,
        totalProjectedEOCamt: this.currencyConverterPipe.transform(item.totalProjectedEOCamt.toString(), item.currency)
      }));
  }

  interestPaymentDataSetter(interestPayments){
    const interestPaymentData = [];
    interestPayments.forEach(element => {
      const objMap: any = {};
      element.index.forEach((ele: any) => {
        if (ele.name !== '_group_id' && ele.name !== '_row_type') {
          if (ele.name === 'current_cycle_start_date') {
            objMap[ele.name] = this.commonService.decodeHtml(ele.value);
          }else{
            objMap[ele.name] = ele.value;
          }
        }
      });
      objMap[FccGlobalConstant.DISABLE] = true;
      interestPaymentData.push(objMap);
    });

    return interestPaymentData;
  }

  setInterestPaymentInSelectedRow() {
    if (this.interestPaymentArray && this.interestPaymentArray.length > 0) {
      const newArray = this.interestPaymentArrayMap(this.interestPaymentArray);
      this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.SELECTED_ROW] = newArray;
      this.calculateInterestPaymentAmountTotal(this.interestPaymentArray);
      this.arr = this.interestPaymentArray; // setting-selected-row-data-in-arr//
    }
  }

  calculateInterestPaymentAmountTotal(interestPaymentData){
    if (interestPaymentData && interestPaymentData.length > 0) {
      const totalProjectedEOCamtTotal = interestPaymentData.reduce((accum, item) =>
      accum + parseFloat(this.commonService.replaceCurrency(item.totalProjectedEOCamt.toString())), 0);
      this.totalProjectedEOCamtTotal = parseFloat(totalProjectedEOCamtTotal);
      this.patchFieldValueAndParameters(this.form.get('interestPayment'), 'Y', {});
    } else {
      this.totalProjectedEOCamtTotal = 0;
    }
    this.checkBorrowerSettlementOnLoad();
  }


  checkBorrowerSettlementOnLoad() {

    let totalLoanAmount2 = 0;
    let totalPrincipalAmount2 = 0;
    let increaseAmountWidget2 = 0;


    if (this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('totalNewLoanAmount').value){
      const totalLoanAmount =
      this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('totalNewLoanAmount').value.split(' ');
      totalLoanAmount2 = parseFloat(this.commonService.replaceCurrency(totalLoanAmount[1].toString()));
    }

    if (this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('principalPayment').value){
      const totalPrincipalAmount =
      this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('principalPayment').value.split(' ');
      totalPrincipalAmount2 = parseFloat(this.commonService.replaceCurrency(totalPrincipalAmount[1].toString()));
    }
    if (this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('increaseAmount').value){
      const increaseAmountWidget =
      this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('increaseAmount').value.split(' ');
      increaseAmountWidget2 = parseFloat(this.commonService.replaceCurrency(increaseAmountWidget[1].toString()));
    }

    const netCashflow = this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).get('netCashFlow').value;

    if (this.form.get('borrowerSettlement') && !(totalLoanAmount2 > 0 || totalPrincipalAmount2 > 0)) {
      this.patchFieldValueAndParameters(this.form.get('borrowerSettlement'), 'Y', {});
    }

    if (netCashflow === 'true' && increaseAmountWidget2) {
      if (increaseAmountWidget2 > 0 && increaseAmountWidget2 <= this.totalProjectedEOCamtTotal){
        this.patchFieldValueAndParameters(this.form.get('borrowerSettlement'), 'N', {});
        this.form.get('borrowerSettlement')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      }else{
        this.form.get('borrowerSettlement')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = false;
      }
    }

    this.checkLoanInterestDetailsAmount();
  }

  checkLoanInterestDetailsAmount() {
    if (this.totalProjectedEOCamtTotal <= 0) {
      if (this.interestPaymentLoanFlag === 'false') {
        this.form.get('interestPayments')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true; // hiding-interest-payment-table
      }
      this.patchFieldValueAndParameters(this.form.get('interestPayment'), 'N', {});
      this.form.get('interestPayment')[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      this.form.updateValueAndValidity();
    }
   }

  ngOnDestroy() {
    if (this.interestTableSubscription && this.interestTableSubscription.length > 0){
      this.interestTableSubscription.forEach(sub => {
        sub.unsubscribe();
      });
    }
    this.stateService.setStateSection(FccGlobalConstant.LNRPN_INTEREST_PAYMENT, this.form);
  }
}
