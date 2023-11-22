import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, Subscription } from 'rxjs';
import { ResolverService } from './../../../../../common/services/resolver.service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { FilelistService } from './../../../../../../app/corporate/trade/lc/initiation/services/filelist.service';

import { LendingCommonDataService } from '../../../common/service/lending-common-data-service';
import { FacilityDetailsService } from '../../../ln/initiation/services/facility-details.service';
import { LnrpnProductComponent } from '../lnrpn-product/lnrpn-product.component';
import { FCCFormGroup } from './../../../../../../app/base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../app/common/core/fcc-global-constants';
import { CodeData } from './../../../../../../app/common/model/codeData';
import { CommonService } from './../../../../../../app/common/services/common.service';
import { DropDownAPIService } from './../../../../../../app/common/services/dropdownAPI.service';
import { EventEmitterService } from './../../../../../../app/common/services/event-emitter-service';
import { FormModelService } from './../../../../../../app/common/services/form-model.service';
import { SessionValidateService } from './../../../../../../app/common/services/session-validate-service';
import { ProductStateService } from './../../../../../../app/corporate/trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../../../app/corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import {
  CustomCommasInCurrenciesPipe,
} from './../../../../../../app/corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FormControlService } from './../../../../../../app/corporate/trade/lc/initiation/services/form-control.service';
import { UtilityService } from './../../../../../../app/corporate/trade/lc/initiation/services/utility.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import {
  ConfirmationDialogComponent,
} from './../../../../trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { emptyCurrency } from './../../../../trade/lc/initiation/validator/ValidateAmt';

@Component({
  selector: 'app-create-loan',
  templateUrl: './create-new-loan-dialog.component.html',
  styleUrls: ['./create-new-loan-dialog.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: CreateNewLoanDialogComponent }]
})
export class CreateNewLoanDialogComponent extends LnrpnProductComponent implements OnInit, OnDestroy {
  dir: string = localStorage.getItem('langDir');
  form: FCCFormGroup;
  module: 'Create Loan';
  tableColumns = [];
  pricingOptions = [];
  codeData = new CodeData();
  facilityDetails: any;
  repricingFrequency: any = [];
  productCode: any;
  checkboxChecked = false;
  loanEffectiveDate: any = 'loanEffectiveDate';
  isEffectiveDateFlag = false;
  loanEffectiveDateErrors: any;
  loanMaturityDateErrors: any;
  repricingDatesValidationInprocess: boolean;
  isRepricingDateFlag: boolean;
  validAmt: any;
  facilityEffectiveDate: string;
  facilityMaturityDate: string;
  facilityExpiryDate: string;
  data: any;
  amtVal: any;
  amountErrors: any;
  validateAmountWithrepricingDate: Subject<any> = new Subject<any>();
  commitmentDataWithrepricingDate: Subject<any> = new Subject<any>();
  iso: any;
  currencyData: any[];
  repricingdateValidation: any;
  savedResponseSubscription: Subscription[] = [];
  existingOldLoans: any;
  reqSent: boolean;
  borrowerID: any;
  currentLoan: any;
  createdLoanData: any[];
  mode: any;
  btndisable = 'btndisable';
  showSpinner: boolean;
  btnClicked: boolean;
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;

  constructor(
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected commonService: CommonService,
    protected datePipe: DatePipe,
    protected activatedRoute: ActivatedRoute,
    protected dropDownAPIservice: DropDownAPIService,
    protected translateService: TranslateService,
    protected matDialogRef: MatDialogRef<CreateNewLoanDialogComponent>,
    protected lendingService: LendingCommonDataService,
    protected facilityDetailsService: FacilityDetailsService,
    protected utilityService: UtilityService,
    protected sessionValidation: SessionValidateService,
    @Inject(MAT_DIALOG_DATA) data,
    protected eventEmitterService: EventEmitterService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected stateService: ProductStateService,
    public dialogService: DialogService, protected confirmationService: ConfirmationService,
    protected searchLayoutService: SearchLayoutService,
    protected resolverService: ResolverService, protected dialogRef: DynamicDialogRef, protected fileListSvc: FilelistService
  ) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileListSvc, dialogRef,
      currencyConverterPipe);
    this.data = data;
  }


  ngOnInit(): void {
    this.showSpinner = true;
    this.btnClicked = false;
    this.facilityDetails = this.facilityDetailsService.getFacilityDetailsObj();
    this.facilityEffectiveDate = this.facilityDetails.effectiveDate;
    this.facilityExpiryDate = this.facilityDetails.expiryDate;
    this.facilityMaturityDate = this.facilityDetails.maturityDate;
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;}
    });
    this.initializeFormGroup();
    this.productCode = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.PRODUCT
    );
    if (this.commonService.referenceId === undefined) {
      sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    }
    this.subscribeSavedResponse();
    this.subscribeErrorResponse();
  }
  initializeFormGroup() {
    if (this.data.responseObject && this.data.responseObject.length > 0) {
      this.setSwinglineDrawdownCodes(this.data.responseObject[0].risk_type);
      this.formModelService.getSubSectionModelAPI().subscribe((model) => {
        const dialogModel = model[FccGlobalConstant.CREATE_LOAN_MODEL];
        this.form = this.formControlService.getFormControls(dialogModel);
        this.getPricingOptions(this.facilityDetailsService.getPricingOptions());
        this.form.get('create')[FccGlobalConstant.PARAMS][
          FccGlobalConstant.PARENT_STYLE_CLASS
        ] = this.getCreateBtnStyleClass();
        this.form.get('cancel')[FccGlobalConstant.PARAMS][
          FccGlobalConstant.PARENT_STYLE_CLASS
        ] = this.getCancelBtnStyleClass();
        this.form.get('create')[FccGlobalConstant.PARAMS][
          FccGlobalConstant.layoutClass
        ] = this.getCreateLayoutStyleClass();
        this.form.get('cancel')[FccGlobalConstant.PARAMS][
          FccGlobalConstant.layoutClass
        ] = this.getCancelLayoutStyleClass();
        this.processBulkData();
        this.populateValuesOnLoad();
        this.form.get('rollOverDate').disable();
      });
    }
  }
  getCurrencies(){
    const ccy = this.data.curObject;
    this.patchFieldParameters(this.form.get('currency'), {
      options: ccy,
    });
    this.patchFieldValueAndParameters(this.form.get('currency'), ccy[0].value, {});
  }
  populateValuesOnLoad() {
    if (this.facilityDetails && this.facilityDetails.borrowers && this.facilityDetails.borrowers.length > 0
      && this.data.responseObject && this.data.responseObject.length > 0){
      const borrower = this.facilityDetails.borrowers.filter(refDetails =>
        refDetails.fccReference === this.data.responseObject[0].borrower_reference);

      if (borrower && borrower[0] && borrower[0].fccReference === this.data.responseObject[0].borrower_reference) {
        this.currencyData = [];
        this.borrowerID = borrower[0].borrowerId;
        borrower[0].currencies.forEach(currencyDetails => {
          if (currencyDetails && currencyDetails.id === this.data.responseObject[0].ln_cur_code){
            const selectedRisk = currencyDetails.riskType.filter(risk => risk === this.data.responseObject[0].risk_type)[0];
            let selectedRiskLimit;
            if (selectedRisk) {
              selectedRiskLimit = currencyDetails.riskTypeLimit[selectedRisk];
            }
            const ccy = {
              id: currencyDetails.id,
              limit: currencyDetails.limit,
              borrowerlimit: currencyDetails.borrowerLimit,
              borrowerCcylimit: currencyDetails.borrowerCurrencyLimit,
              limitWithPend: currencyDetails.limitWithPending,
              limitFXRate: currencyDetails.limitFXRate,
              riskType: selectedRisk,
              riskTypeLimit: selectedRiskLimit,
              swinglineLimit: currencyDetails.swinglineLimit,
              sublimitRisklimit: currencyDetails.sublimitRisklimit
            };
            const index = this.currencyData.findIndex(curr => (curr.id === ccy.id && curr.riskType === ccy.riskType));
            if (index < 0 && selectedRisk){
            this.currencyData.push(ccy);
            }
          }
        });
      }
      if ( this.data.responseObject && this.data.responseObject.length > 0 && this.data.responseObject[0].risk_type) {
        const riskType = {
          label: this.data.responseObject[0].risk_type,
          value: this.data.responseObject[0].risk_type
        };

        this.patchFieldParameters(this.form.get('riskType'), {
          options: [riskType]
        });
        this.patchFieldValueAndParameters(this.form.get('riskType'), riskType.value, {});
        this.form.get('riskType').disable();
      }
      this.repricingdateValidation = this.facilityDetailsService.getRepricingdateValidation();
      this.patchFieldValueAndParameters(this.form.get('repricingdateValidation'), this.repricingdateValidation, {});
      this.populateRepricingFrequency();
      if (
        this.data.bulkLoanDataToPopup &&
        this.data.bulkLoanDataToPopup.length > 0 &&
        this.data.bulkLoanDataToPopup[0].repricing_date
      ) {
        const facilityEffectiveDate =
          this.utilityService.transformddMMyyyytoDate(
            this.data.bulkLoanDataToPopup[0].repricing_date
          );
        this.patchFieldValueAndParameters(
          this.form.get('loanEffectiveDate'),
          facilityEffectiveDate,
          {}
        );
      }
      if (this.facilityDetailsService.loansAdded && this.facilityDetailsService.loansAdded.ln_tnx_record){
        this.existingOldLoans = this.facilityDetailsService.loansAdded;
        if (this.data.isFromEdit && this.data.editLoan) {
          this.populateDataOnEdit();
        } else if (this.existingOldLoans && this.existingOldLoans.ln_tnx_record && this.existingOldLoans.ln_tnx_record.length > 0){
          this.form.get('loanDetails')[FccGlobalConstant.PARAMS].inputData = this.buildTopBanner(this.existingOldLoans.ln_tnx_record);
          this.buildTable(this.facilityDetailsService.loansAdded.ln_tnx_record);
        }
      }
      this.form.get('loanEffectiveDate').disable();
      this.showSpinner = false;
    }
  }
  populateDataOnEdit(){
    if (this.data.isFromEdit && this.data.editLoan
      && (this.facilityDetailsService.loansAdded && this.facilityDetailsService.loansAdded.ln_tnx_record && this.data.isFromEdit)) {
      this.existingOldLoans = this.facilityDetailsService.loansAdded;
      if (this.existingOldLoans && this.existingOldLoans.ln_tnx_record && this.existingOldLoans.ln_tnx_record.length > 0){
        const index = this.existingOldLoans.ln_tnx_record.findIndex(loan => loan.ref_id === this.data.editLoan.bankReference);
        this.currentLoan = this.existingOldLoans.ln_tnx_record[index];
        this.patchModel(this.currentLoan);
        this.removeSelectedRow(index);
      }
    }
  }
  patchModel(loanObject){
    const facilityMaturityDate = this.utilityService.transformddMMyyyytoDate(loanObject.maturity_date);
    this.patchFieldValueAndParameters(this.form.get('loanMaturityDate'), facilityMaturityDate, {});
    this.patchFieldValueAndParameters(this.form.get('amount'), loanObject.ln_amt, {});
    this.onBlurAmount();
    this.patchFieldValueAndParameters(this.form.get('pricingOptions'), loanObject.pricing_option, {});
    this.patchFieldValueAndParameters(this.form.get('rollOverFrequency'), loanObject.repricing_frequency, {});
    const pricingOption = {
      value : loanObject.pricing_option
    };
    const rollOverFreq = {
      value : loanObject.repricing_frequency
    };
    this.onClickPricingOptions(pricingOption);
    this.onClickRollOverFrequency(rollOverFreq);
    const facilityRepricingDate = this.utilityService.transformddMMyyyytoDate(loanObject.repricing_date);
    this.patchFieldValueAndParameters(this.form.get('rollOverDate'), facilityRepricingDate, {});
    this.form.get('create')[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] = `${this.translateService.instant('apply')}`;
  }

  onKeyupAmount() {
    this.amtVal = this.form.get('amount').value;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, this.amtVal, this.iso, 
        this.currencyDecimalplacesZero, 
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }
  
  /*validation on change of amount field*/
  onBlurAmount() {
    this.setAmountLengthValidator('amount');
    this.validateAmountWithrepricingDate.next();
    this.commitmentDataWithrepricingDate.next();
    this.amtVal = this.form.get('amount').value;
    this.iso = this.form.get('currency').value.shortName;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, this.amtVal, this.iso, 
        this.currencyDecimalplacesZero, 
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    const currencyVal = this.form.get('currency').value;
    if (currencyVal && currencyVal !== '') {
      if (this.amtVal === null || this.amtVal === undefined || this.amtVal === '') {
        this.form.get('amount').setErrors({ amountNotNull: true });
        this.amountErrors = this.form.get('amount').errors;
        return;
      }
      if (this.amtVal <= 0) {
        this.form.get('amount').setErrors({ amountCanNotBeZero: true });
        this.amountErrors = this.form.get('amount').errors;
        return;
      }
      this.validateLoanAmount();
      if (this.validAmt && this.iso !== '') {
        const amt = this.commonService.replaceCurrency(this.form.get('amount').value);
        const valueupdated = this.currencyConverterPipe.transform(amt, this.iso);
        this.form.get('amount').setValue(valueupdated);
        this.form.get('amount').updateValueAndValidity();
      }
      this.amountErrors = this.form.get('amount').errors;
    }
  }

  /**
   * Validates the data entered as the Loan Amount.
   */
  validateLoanAmount() {
    if (this.form.get('amount')) {
      this.validAmt = true;
      this.form.get('amount').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      const loanAmountWidget = this.form.get('amount');

      const currency = this.form.get('currency');
      const selectedRiskType = this.form.get('riskType').value;
      if (currency.value === null || currency.value === undefined || currency.value === '') {
        this.form.get('amount').setValidators(emptyCurrency);
      }
      if (currency && currency.value) {
        // Below variables are arrays
        let limit = 0;
        let borrowerCcylimitAmt = 0;
        let borrowerLevelLimitAmt = 0;
        let riskTypeLimitAmt = 0;
        let limitWithPendingLoans = 0;
        let swinglineLimit = 0;
        let sublimitRisklimit = 0;
        let limitAmountToDisplay = 0;
        let oldAmtValue = 0;
        if (this.existingOldLoans && this.existingOldLoans.ln_tnx_record &&
          this.existingOldLoans.ln_tnx_record.length > 0) {
          this.existingOldLoans.ln_tnx_record.forEach((loanRec) => {
            if (this.findRefId(loanRec.ref_id)) {
              oldAmtValue =
                oldAmtValue +
                parseFloat(this.commonService.replaceCurrency(loanRec.ln_amt));
            }
          });
        }
        if (this.currencyData && this.currencyData.length > 0){
          const seletedLoansValue = this.getAmountToRollover();
          if (seletedLoansValue && seletedLoansValue > 0){
              this.currencyData.forEach(item => {
              if (currency.value.shortName === item.id && item.riskType === selectedRiskType) {
                  limit =
                  item.limit ? (Number(item.limit) + seletedLoansValue) > oldAmtValue
                      ? (Number(item.limit) + seletedLoansValue) - oldAmtValue
                      : 0 : 0;
                  borrowerCcylimitAmt = item.borrowerCcylimit ?
                    (Number(item.borrowerCcylimit) + seletedLoansValue) > oldAmtValue
                      ? (Number(item.borrowerCcylimit) + seletedLoansValue) - oldAmtValue
                      : 0 : 0;
                  borrowerLevelLimitAmt = item.borrowerlimit ?
                    (Number(item.borrowerlimit) + seletedLoansValue) > oldAmtValue
                      ? (Number(item.borrowerlimit) + seletedLoansValue) - oldAmtValue
                      : 0 : 0;
                  swinglineLimit = item.swinglineLimit ?
                    (Number(item.swinglineLimit) + seletedLoansValue) > oldAmtValue
                      ? (Number(item.swinglineLimit) + seletedLoansValue) - oldAmtValue
                      : 0 : 0;
                  limitWithPendingLoans = item.limitWithPend ?
                    (Number(item.limitWithPend) + seletedLoansValue) > oldAmtValue
                      ? (Number(item.limitWithPend) + seletedLoansValue) - oldAmtValue
                      : 0 : 0;
                  riskTypeLimitAmt = item.riskTypeLimit ?
                    (Number(item.riskTypeLimit) + seletedLoansValue) > oldAmtValue
                      ? (Number(item.riskTypeLimit) + seletedLoansValue) - oldAmtValue
                      : 0 : 0;
                  sublimitRisklimit = item.sublimitRisklimit ?
                    (Number(item.sublimitRisklimit) + seletedLoansValue) > oldAmtValue
                      ? (Number(item.sublimitRisklimit) + seletedLoansValue) - oldAmtValue
                      : 0 : 0;
                }
            });
          }
        }
        // Set the max limit initially.
        limitAmountToDisplay = limit;
        if (currency.value.shortName && this.amtVal) {
          const amt = this.commonService.replaceCurrency(this.amtVal);
          const valueupdated = this.customCommasInCurrenciesPipe.transform(amt, currency.value.shortName);
          this.form.get('amount').setValue(valueupdated);
        }
        if (loanAmountWidget && loanAmountWidget.value) {
          const amountValue = this.commonService.replaceCurrency(loanAmountWidget.value);
          if (amountValue > borrowerLevelLimitAmt && (borrowerLevelLimitAmt < limitAmountToDisplay)) {
            // validate borrower level limit
            limitAmountToDisplay = borrowerLevelLimitAmt;

            let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
            limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
              limitAmountToDisplayUpdated.toString(), currency.value.currencyCode);

            if (borrowerLevelLimitAmt <= 0) {
              this.form.get('amount').setErrors({ noAmountForBorrowerLimitError: true });
              this.validAmt = false;
            } else {
              this.form.get('amount').setErrors(
                { loanAmountTooBigThanBorrowerLimitAmtError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
              );
              this.validAmt = false;
            }
          }
          if ((selectedRiskType) && (amountValue > riskTypeLimitAmt)
              && (riskTypeLimitAmt < limitAmountToDisplay)) {
            // validate risk type limit
            limitAmountToDisplay = riskTypeLimitAmt;
            let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
            limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
              limitAmountToDisplayUpdated.toString(), currency.value.shortName);
            if (riskTypeLimitAmt <= 0) {
              if (this.facilityDetails.type === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
                this.form.get('amount').setErrors({ noAmountForSwingRiskLimitError: true });
              } else {
                this.form.get('amount').setErrors({ noAmountForRiskLimitError: true });
              }
              this.validAmt = false;
            } else {
              this.form.get('amount').setErrors(
                {
                  loanAmountTooBigThanBorrowerRiskTypeLimitAmtError: {
                    cur: currency.value.shortName,
                    amt: limitAmountToDisplayUpdated
                  }
                }
              );
              this.validAmt = false;
            }
          }
          if (swinglineLimit && (amountValue > swinglineLimit)) {
            // validate Swingline global limit
            if (swinglineLimit < limitAmountToDisplay) {
              limitAmountToDisplay = swinglineLimit;
              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                limitAmountToDisplayUpdated.toString(), currency.value.shortName);
              if (swinglineLimit <= 0) {
                if (this.facilityDetails.type === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
                  this.form.get('amount').setErrors({ noAmountForSwinglineLimitError: true });
                } else {
                  this.form.get('amount').setErrors({ noAmountForLoanSublimitLimitError: true });
                }
                this.validAmt = false;
              } else {
                if (this.facilityDetails.type === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
                  this.form.get('amount').setErrors(
                    { loanAmountTooBigThanSwinglineLimitAmtError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                  );
                } else {
                  this.form.get('amount').setErrors(
                    { loanAmountTooBigLoanSublimitAmtError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                  );
                }
                this.validAmt = false;
              }
            }
          }
          if (this.facilityDetails.type === FccGlobalConstant.LN_REQUEST_TYPE_SWNG && sublimitRisklimit &&
            (amountValue > sublimitRisklimit)) {
            // validate Swingline risk limit
            if (sublimitRisklimit < limitAmountToDisplay) {
              limitAmountToDisplay = sublimitRisklimit;
              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
              limitAmountToDisplayUpdated.toString(), currency.value.shortName);
              if (swinglineLimit <= 0) {
                this.form.get('amount').setErrors({ noAmountForSublimitRiskLimitError: true });
                this.validAmt = false;
              } else {
                this.form.get('amount').setErrors(
                  { loanAmountTooBigThanSublimitRiskAmtError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                );
                this.validAmt = false;
              }
            }
          }

          if (borrowerCcylimitAmt && (amountValue > borrowerCcylimitAmt)) {
            // validate currency limit
            if (borrowerCcylimitAmt < limitAmountToDisplay) {
              limitAmountToDisplay = borrowerCcylimitAmt;
              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                limitAmountToDisplayUpdated.toString(), currency.value.shortName);
              if (borrowerCcylimitAmt <= 0) {
                this.form.get('amount').setErrors({ noAmountForCurrencyLimitError: { cur: currency.value.shortName } });
                this.validAmt = false;
              } else {
                this.form.get('amount').setErrors(
                  { loanAmountTooBigThanBorrowerCcyLimitAmtError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                );
                this.validAmt = false;
              }
            }
          }
          if (limit && (amountValue > limit)) {
            // validate global limit
            if (limit <= limitAmountToDisplay) {
              limitAmountToDisplay = limit;
              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                limitAmountToDisplayUpdated.toString(), currency.value.shortName);
              if (limitAmountToDisplay === 0) {
                this.form.get('amount').setErrors({ facilityFullyDrawnError: true });
                this.validAmt = false;
              } else {
                if (this.facilityDetails.type === FccGlobalConstant.LN_REQUEST_TYPE_SWNG) {
                  this.form.get('amount').setErrors(
                    { swinglineLoanAmountTooBigError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                  );
                } else {
                  this.form.get('amount').setErrors(
                    { loanAmountTooBigError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                  );
                }
                this.validAmt = false;
              }
            }
          }

          if (limitWithPendingLoans && (amountValue > limitWithPendingLoans)){
            // validate facility available limit with pending loans.
            if (limitWithPendingLoans <= limitAmountToDisplay) {
              limitAmountToDisplay = limitWithPendingLoans;
              let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
              limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                limitAmountToDisplayUpdated.toString(), currency.value.shortName);
              if (limitAmountToDisplay <= 0) {
                this.form.get('amount').setErrors({ facilityFullyDrawnErrorWithPend: true });
                this.validAmt = false;
              } else {
                this.form.get('amount').setErrors(
                  { loanAmountTooBigWithPendError: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                );
                this.validAmt = false;
              }
            }
          }
        }
        if (this.facilityDetails.type !== FccGlobalConstant.LN_REQUEST_TYPE_SWNG
           && this.form.get('repricingdateValidation').value === 'true') {
          this.isLoanAmountGreaterThanCommitmentAmount(oldAmtValue);
          this.commitmentDataWithrepricingDate.subscribe(commitmentData => {
            this.form.get('create')[FccGlobalConstant.PARAMS][this.btndisable] = false;
            this.form.updateValueAndValidity();
            if (commitmentData && commitmentData.get('limitViolated')) {
              const commitmentAmount = commitmentData.get('limitAmount');
              if ((parseFloat(commitmentAmount) + oldAmtValue) <= limitAmountToDisplay) {
                limitAmountToDisplay = parseFloat(commitmentAmount);
                let limitAmountToDisplayUpdated = this.commonService.replaceCurrency(limitAmountToDisplay.toString());
                limitAmountToDisplayUpdated = this.currencyConverterPipe.transform(
                  limitAmountToDisplayUpdated.toString(), currency.value.shortName);
                if (limitAmountToDisplay <= 0) {
                  this.form.get('amount').setErrors({ commitmentScheduleFullyDrawnError: true });
                  this.validAmt = false;
                } else {
                  this.form.get('amount').setErrors(
                    { commitmentScheduleAmountErrorForDrawdown: { cur: currency.value.shortName, amt: limitAmountToDisplayUpdated } }
                  );
                  this.validAmt = false;
                }
              }
            }
          });
        }
      }
    }
  }

  onClickPricingOptions(event) {
    if (event.value !== undefined) {
      this.form.get('rollOverDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
      this.form.get('loanMaturityDate').disable();
      this.populateRepricingFrequency();
      this.facilityDetails.pricingOptions.forEach(element => {
        if (this.form.get('pricingOptions').value === element.id) {
          this.updatePricingOptionDependentFields(element);
        }
      });
    }
  }

  requestToValidateDate(dateForValidate): any{
    const dateRequestParams: any = {};
    dateRequestParams.dateToValidate = dateForValidate;
    dateRequestParams.isRepricingDate = 'Y';
    dateRequestParams.boFacilityId = this.facilityDetails.facilityId;
    dateRequestParams.currency = this.form.get('currency').value.shortName;
    dateRequestParams.pricingOptionName = this.form.get('pricingOptions').value;
    dateRequestParams.dealId = this.facilityDetails.dealId;
    dateRequestParams.operation = '';
    dateRequestParams.borrowerId = this.borrowerID;
    return dateRequestParams;
  }


  updatePricingOptionDependentFields(element) {
    // Pricing option based Loan Maturity Date
    if (element && this.form.get('loanMaturityDate') && !this.form.get('loanMaturityDate').value) {
      this.form.get('loanMaturityDate').disable();
    }
    if (element.maturityDateMandatory === 'Y') {
      this.form.get('loanMaturityDate').enable();
      this.setMandatoryField(this.form, 'loanMaturityDate', true);
      if (!this.form.get('loanMaturityDate').value && this.facilityMaturityDate) {
        const facilityMaturityDate = this.utilityService.transformddMMyyyytoDate(this.facilityMaturityDate);
        this.patchFieldValueAndParameters(this.form.get('loanMaturityDate'), facilityMaturityDate, {});
      }
    } else if (element.maturityDateMandatory === 'N') {
      this.form.get('loanMaturityDate').disable();
      this.form.get('loanMaturityDate').setValue('');
      this.setMandatoryField(this.form, 'loanMaturityDate', false);
    }
    this.validateLoanMaturityDate();

    // Pricing Option based Match Funding
    if (this.form.get('matchFunding')) {
      if (element.matchFundedIndicator && element.matchFundedIndicator === 'Y') {
        this.patchFieldValueAndParameters(this.form.get('matchFunding'), 'Y', {});
      } else {
        this.patchFieldValueAndParameters(this.form.get('matchFunding'), 'N', {});
      }
    }
    if (this.form.get('loanMaturityDate') && this.form.get('loanMaturityDate').errors) {
      this.form.get('loanMaturityDate').markAsDirty();
      this.form.get('loanMaturityDate').markAsTouched();
      this.loanMaturityDateErrors = this.form.get('loanMaturityDate').errors;
    }
    this.populateRepricingFrequency();
  }

  /*
   * This method validates the past dates for effective date field.
   */
  pastDateValidationForEffectiveDate() {
    const currentServerDate = new Date();
    currentServerDate.setHours(0, 0, 0, 0);
    const selectedEffectiveDate = this.form.get('loanEffectiveDate').value;

    if (!this.form.get('effectiveDateHiddenField').value) {
      this.patchFieldValueAndParameters(this.form.get('effectiveDateHiddenField'), currentServerDate, {});
    }

    this.repricingDatesValidationInprocess = false;

    if (!this.repricingDatesValidationInprocess) {
      // checks the calculated effecitbe dtae is smaller or equals to entered date.
      if (selectedEffectiveDate < this.form.get('effectiveDateHiddenField').value) {
        this.repricingDatesValidationInprocess = true;
        return false;
      }
    }
    this.repricingDatesValidationInprocess = false;
    return true;
  }

  /**
   * Validates the data entered as the Maturity Date.
   */
  validateLoanMaturityDate() {
    if (!this.form.get('loanMaturityDate').value) {
      return true;
    }
    this.form.get('loanMaturityDate').setErrors(null);

    const thisObject = this.form.get('loanMaturityDate');

    // Test that the loan maturity date is less than or equal to the
    // facility maturity date
    const facMatDate = this.utilityService.transformddMMyyyytoDate(this.facilityMaturityDate);
    if (!this.utilityService.compareDateFields(facMatDate, thisObject.value)) {
      this.form.get('loanMaturityDate').setErrors(
        {
          loanMatDateGreaterThanFacMatDateError: {
            date: this.utilityService.transformDateFormat(
              thisObject.value),
            facMatDate: this.facilityMaturityDate
          }
        }
      );
    }

    // Test that the loan maturity date is greater than or equal to the loan
    // effective date
    const loanEffDate = this.form.get('loanEffectiveDate');
    if (thisObject && loanEffDate && thisObject.value && loanEffDate.value) {
      if (this.utilityService.compare(thisObject.value, loanEffDate.value) <= 0) {
        this.form.get('loanMaturityDate').setErrors(
          {
            loanMatDateLessThanLoanEffDateError: {
              date: this.utilityService.transformDateFormat(thisObject.value),
              loanEffDate: this.utilityService.transformDateFormat(loanEffDate.value)
            }
          }
        );
      }
    }
    // Test that the loan maturity date is greater than  or equal to the repricing date
    const repricingDate = this.form.get('rollOverDate');
    if (thisObject && repricingDate && thisObject.value && repricingDate.value) {
      if (this.utilityService.compareDateFields(repricingDate.value, thisObject.value)) {
        this.form.get('loanMaturityDate').setErrors(
          {
            loanMatDateGreaterThanLoanRepDateError: {
              date: this.utilityService.transformDateFormat(thisObject.value),
              repricingDate: this.utilityService.transformDateFormat(repricingDate.value)
            }
          }
        );
      }
    }
    if (this.form.get('loanMaturityDate') && this.form.get('loanMaturityDate').errors) {
      this.form.get('loanMaturityDate').markAsDirty();
      this.form.get('loanMaturityDate').markAsTouched();
      this.loanMaturityDateErrors = this.form.get('loanMaturityDate').errors;
    }
  }

  onClickLoanMaturityDate(event) {
    if (event.value) {
      this.patchFieldValueAndParameters(this.form.get('loanMaturityDate'), event.value, {});
      this.calculateRepricingDate();
      this.validateLoanMaturityDate();
      this.validateLoanRepricingDate();
    }
  }

  onClickRollOverFrequency(event) {
    if (event.value) {
      if (this.form.get('repricingdateValidation').value === 'true') {
        this.form.get('create')[FccGlobalConstant.PARAMS][this.btndisable] = true;
        this.form.updateValueAndValidity();
      }
      this.form.get('rollOverDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
      this.calculateRepricingDate();
      this.onClickRepricingDate();
      this.validateLoanRepricingDate();
      this.onBlurAmount();
    }
  }

  onClickRepricingDate() {
    if (this.form.get('rollOverDate') && this.form.get('rollOverDate').value) {
      if (this.isRepricingDateFlag && this.checkPastDateOfCalenderForRepricingDate()) {
        this.setRepricingDateAsPerTheBusinessDayRule();
      } else {
        this.isRepricingDateFlag = true;
      }
      if (this.form.get('repricingdateValidation').value === 'true') {
        if (this.validAmt) {
          this.form.get('amount').setErrors(null);
        }
      }
    }
  }

  /**
   * Validate the data entered as the Repricing Date.
   */
  validateLoanRepricingDate() {
    if (!this.form.get('rollOverDate').value) {
      return true;
    }
    const repricingDate = this.form.get('rollOverDate');
    if (repricingDate && repricingDate.value) {
      // Test that the loan Repricing date is greater than or equal to the loan effective date
      const loanEffDate = this.form.get('loanEffectiveDate');
      if (loanEffDate && loanEffDate.value !== '' && this.utilityService.compareDateFields( loanEffDate.value, repricingDate.value)) {
        this.form.get('rollOverDate').setErrors(
          {
            loanRepricingDateGreaterThanLoanEffDateError: {
              date: this.utilityService.transformDateFormat(repricingDate.value),
              loanEffDate: this.utilityService.transformDateFormat(loanEffDate.value)
            }
          }
        );
      }

      // Test that the loan Repricing date is less than or equal to the loan maturity date
      const lnMatDate = this.form.get('loanMaturityDate');
      if (lnMatDate && lnMatDate.value !== '' && this.utilityService.compareDateFields(repricingDate.value, lnMatDate.value)) {
        this.form.get('rollOverDate').setErrors(
          {
            loanRepricingDateLessThanLoanMatDateError: {
              date: this.utilityService.transformDateFormat(repricingDate.value),
              lnMatDate: this.utilityService.transformDateFormat(lnMatDate.value)
            }
          }
        );
      }

      const facMatDate = this.utilityService.transformddMMyyyytoDate(this.facilityMaturityDate);
      if (this.utilityService.compareDateFields(repricingDate.value, facMatDate)) {
        this.form.get('rollOverDate').setErrors(
          {
            loanRepricingDateLessThanFacMatDateError: {
              date: this.utilityService.transformDateFormat(repricingDate.value),
              facMatDate: this.facilityMaturityDate
            }
          }
        );
      }
      if (this.form.get('rollOverDate') && this.form.get('rollOverDate').value && this.form.get('rollOverDate').errors) {
        this.form.get('rollOverDate').markAsDirty();
        this.form.get('rollOverDate').markAsTouched();
      }
    }
  }


  /**
   * Calculate the Repricing Date
   */
  calculateRepricingDate() {
    const effDate = this.form.get('loanEffectiveDate');
    if (this.form.get('loanEffectiveDate').value) {
      if (this.form.get('rollOverFrequency')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS].length !== 0) {
        this.form.get('rollOverFrequency').enable();
        this.setMandatoryField(this.form, 'rollOverFrequency', true);
        if (this.form.get('rollOverFrequency').value) {
          this.form.get('rollOverDate').disable();
          this.setMandatoryField(this.form, 'rollOverDate', true);
          this.patchFieldValueAndParameters(this.form.get('rollOverDate'), this.addDates(effDate), {});
          this.setRepricingDateAsPerTheBusinessDayRule();
          this.form.get('rollOverDate').updateValueAndValidity();
        }
      }
    }
  }

  /**
   * Date addition utility
   */
  addDates(date) {
    if (date.value && this.form.get('rollOverFrequency').value) {
      const frequency = this.form.get('rollOverFrequency').value;
      let frequencyNo;
      let frequencyMultiplier;
      let frequencyMultiplierFullForm;

      if (this.form.get('rollOverFrequency').value.length > 0) {
        frequencyNo = frequency.substring(0, frequency.length - 1);
        frequencyMultiplier = frequency.substring(frequency.length - 1, frequency.length);
      }

      if (frequencyMultiplier === 'W') {
        frequencyMultiplierFullForm = 'week';
      } else if (frequencyMultiplier === 'M') {
        frequencyMultiplierFullForm = 'month';
      } else if (frequencyMultiplier === 'Y') {
        frequencyMultiplierFullForm = 'year';
      } else if (frequencyMultiplier === 'D') {
        frequencyMultiplierFullForm = 'day';
      }
      return this.utilityService.addToDate(date.value, frequencyMultiplierFullForm, parseInt(frequencyNo, 10));
    }
  }

  /**
   * this method makes the ajax call to get the business date from loan iq
   */
  setRepricingDateAsPerTheBusinessDayRule() {
    let convertedRepricingDate = this.form.get('rollOverDate').value;
    if (convertedRepricingDate !== '' && convertedRepricingDate !== null && convertedRepricingDate !== undefined) {
      convertedRepricingDate = this.utilityService.transformDateFormat(convertedRepricingDate);
    }
    if (this.form.get('pricingOptions').value !== '' && convertedRepricingDate !== '' && this.form.get('currency').value !== '' ) {
      const dateRequestParams = this.requestToValidateDate(convertedRepricingDate);
      this.commonService.getValidateBusinessDate(dateRequestParams).subscribe((res) => {
        if (res) {
          let formattedDate = this.form.get('rollOverDate').value;
          formattedDate = this.utilityService.transformDateFormat(formattedDate);
          if (formattedDate.toString() === res.adjustedLocalizedDate.toString()) {
            this.isRepricingDateFlag = true;
          } else if (formattedDate) {
            this.isRepricingDateFlag = false;
            this.form.get('rollOverDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] =
              `${this.translateService.instant('repricingDateBusinessDayValidationErrorMsg', {
                date: formattedDate
              })}`;
          }
          this.populateBusinessDateForRepricing(res);
        }
      });
    }
  }

  /**
   * This method render the loan iq business date for repricing
   */
  populateBusinessDateForRepricing(response) {
    if (response) {
      const repricingDate = this.utilityService.transformddMMyyyytoDate(response.adjustedLocalizedDate);
      this.patchFieldValueAndParameters(this.form.get('rollOverDate'), repricingDate, {});
    }
  }

  checkPastDateOfCalenderForRepricingDate() {
    const selectedDate = this.form.get('rollOverDate').value;
    const selectedEffectiveDate = this.form.get('loanEffectiveDate').value;
    if (selectedDate > selectedEffectiveDate) {
      return true;
    } else {
      return false;
    }
  }

  checAmountAgainstCurreny() {
    if (this.form.get('currency').value !== null && this.form.get('currency').value !== undefined
      && this.form.get('currency').value !== '') {
      if (this.form.get('amount').value <= 0) {
        this.form.get('amount').setValue('');
        return;
      }
    }
  }

  getCreateBtnStyleClass() {
    if (localStorage.getItem('langDir') === 'rtl') {
      return 'createButton-Parent createButtonArabic';
    } else {
      return 'createButton-Parent createButton';
    }
  }
  getCancelBtnStyleClass() {
    if (localStorage.getItem('langDir') === 'rtl') {
      return 'createButton-Parent cancelArabic';
    } else {
      return 'createButton-Parent cancel';
    }
  }

  getCancelLayoutStyleClass() {
    if (localStorage.getItem('langDir') === 'rtl') {
      return 'p-col-10 ';
    } else {
      return 'p-col-11 ';
    }
  }

  setSwinglineDrawdownCodes(riskType: string) {
    if (riskType === 'SWNG') {
      this.facilityDetailsService.setSwinglineData('Y');
    } else {
      this.facilityDetailsService.setSwinglineData('N');
    }
  }

  getPricingOptions(options) {
    if (this.pricingOptions && this.pricingOptions.length > 0){
      this.patchFieldParameters(this.form.get('pricingOptions'), { options: this.pricingOptions });
    } else {
      this.pricingOptions = [];
      let pricingFlag = false;
      this.codeData.codeId = FccGlobalConstant.CODEDATA_PRICING_OPTION_CODES_C030;
      this.codeData.productCode = this.productCode;
      this.codeData.subProductCode = '';
      this.codeData.language =
        localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null
          ? localStorage.getItem(FccGlobalConstant.LANGUAGE)
          : '';
      this.commonService
        .getCodeDataDetails(this.codeData)
        .subscribe((response) => {
          response.body.items.forEach((responseValue) => {
            options.forEach((ele) => {
              if (
                responseValue.value === ele.id &&
                responseValue.language === this.codeData.language
              ) {
                Object.keys(this.pricingOptions).forEach((keys) => {
                  if (
                    this.pricingOptions[keys][FccGlobalConstant.VALUE] ===
                    responseValue.value
                  ) {
                    pricingFlag = true;
                  }
                });
                if (!pricingFlag) {
                  this.pricingOptions.push({
                    label: responseValue.longDesc,
                    value: responseValue.value,
                  });
                }
              }
            });
          });
          this.patchFieldParameters(this.form.get('pricingOptions'), {
            options: this.pricingOptions,
          });
          /**
           * If there is only one pricing option associated with the selected facility set
           * this as default selected in the select box
           */
          if (this.pricingOptions.length === 1) {
            this.form
              .get('pricingOptions')
              .setValue(this.pricingOptions[0].value);
            this.form.get('pricingOptions').updateValueAndValidity();
            this.onClickPricingOptions(this.pricingOptions[0]);
          } else {
            this.form.get('pricingOptions').updateValueAndValidity();
          }
          this.form.updateValueAndValidity();
        });
    }
  }

  getCreateLayoutStyleClass() {
    if (localStorage.getItem('langDir') === 'rtl') {
      return 'p-col-2 ';
    } else {
      return 'p-col-1 ';
    }
  }

  populateRepricingFrequency() {
    if (this.facilityDetails.pricingOptions) {
      const selectedPricingOption = this.facilityDetails.pricingOptions.filter(
        (element) => element.id === this.form.get('pricingOptions').value
      );
      if (selectedPricingOption && selectedPricingOption[0]) {
        const element = selectedPricingOption[0];
        if (this.form.get('pricingOptions').value === element.id) {
          this.repricingFrequency = [];
          if (element.repricingFrequencies.length === 0) {
            const mandatoryFields = ['rollOverFrequency', 'rollOverDate'];
            this.setMandatoryFields(this.form, mandatoryFields, false);
            this.patchFieldValueAndParameters(
              this.form.get('rollOverDate'),
              null,
              {}
            );
            this.patchFieldValueAndParameters(
              this.form.get('rollOverFrequency'),
              null,
              {}
            );
            this.patchFieldParameters(this.form.get('rollOverFrequency'), {
              options: [],
            });
            this.form.get('rollOverDate').disable();
            this.form.get('rollOverFrequency').disable();
          } else {
            element.repricingFrequencies.forEach((ele) => {
              if (this.data && this.data.frequencyCodeData) {
                const filteredData = this.data.frequencyCodeData.filter(
                  (responseValue) =>
                    responseValue.shortDesc === ele.name &&
                    responseValue.language === this.codeData.language
                );
                if (filteredData && filteredData.length > 0) {
                  this.repricingFrequency.push({
                    label: ele.desc,
                    value: ele.id,
                  });
                }
              }
            });
            this.patchFieldParameters(this.form.get('rollOverFrequency'), {
              options: this.repricingFrequency,
            });
            // if there is only one repricing frequency associated with
            // pricing option set this as default selected in the select box
            if (element.repricingFrequencies.length === 1) {
              this.form
                .get('rollOverFrequency')
                .setValue(element.repricingFrequencies[0].value);
              this.form.get('rollOverFrequency').disable();
              this.form.updateValueAndValidity();
            } else {
              this.form.get('rollOverFrequency').enable();
              this.form.get('rollOverFrequency').updateValueAndValidity();
              this.form.updateValueAndValidity();
            }
          }
        }
      }
    }
  }

  onClickCreateAnotherLoan() {
    if (this.form.get('createAnotherLoan').value === 'Y'){
      this.checkboxChecked = true;
    }else {
      this.checkboxChecked = false;
    }
  }

  isExpiredFacility(){
    if (this.facilityDetails && this.facilityDetails.status){
      return this.facilityDetails.status === FccGlobalConstant.expired;
    }else {
      return false;
    }
  }
  onClickCreate(){
    this.btnClicked = true;
    if (!this.reqSent){
      this.showSpinner = true;
      const loanAmount = parseFloat(this.commonService.replaceCurrency(this.form.get('amount').value));
      let oldAmtValue = loanAmount;
      const controlArray = [
        this.form.get('loanMaturityDate'),
        this.form.get('rollOverFrequency'),
        this.form.get('rollOverDate'),
        this.form.get('pricingOptions'),
        this.form.get('amount')
      ];
      this.checkMandatoryEmptyFields(controlArray);
      if (
        this.existingOldLoans &&
        this.existingOldLoans.ln_tnx_record &&
        this.existingOldLoans.ln_tnx_record.length > 0
      ) {
        this.existingOldLoans.ln_tnx_record.forEach((loanRecord) => {
          if (this.findRefId(loanRecord.ref_id)) {
            oldAmtValue =
              oldAmtValue +
              parseFloat(this.commonService.replaceCurrency(loanRecord.ln_amt));
          }
        });
      }
      this.amountErrors = this.form.get('amount').errors;
      this.loanMaturityDateErrors = this.form.get('loanMaturityDate').errors;
      const rollOverFreqError = this.form.get('rollOverFrequency').errors;
      const rollOverError = this.form.get('rollOverDate').errors;
      if (this.amountErrors || this.loanMaturityDateErrors || rollOverFreqError || rollOverError){
        this.showSpinner = false;
        return;
      }
      if (this.isExpiredFacility() && oldAmtValue > this.getAmountToRollover()){
        this.showSpinner = false;
        const dir = localStorage.getItem('langDir');
        const locaKeyValue = this.translateService.instant('increaseErrorOnExpiredFacility');
        const expiredFacDialog = this.dialogService.open(ConfirmationDialogComponent, {
          header: `${this.translateService.instant('message')}`,
          width: '35em',
          styleClass: 'fileUploadClass',
          style: { direction: dir },
          data: { locaKey: locaKeyValue,
            showOkButton: true,
            showNoButton: false,
            showYesButton: false
          },
          baseZIndex: 10010,
          autoZIndex: true
        });
        expiredFacDialog.onClose.subscribe(() => {
          //eslint : no-empty-function
        });
      }
      if (oldAmtValue > this.getAmountToRollover() && !this.isExpiredFacility()){
        this.showSpinner = false;
        const dir = localStorage.getItem('langDir');
        const locaKeyValue = this.translateService.instant('amountGreaterThanOldLoan');
        const increaseDialogRef = this.dialogService.open(ConfirmationDialogComponent, {
          header: `${this.translateService.instant('LBL_CONFIRM')}`,
          width: '35em',
          styleClass: 'fileUploadClass',
          style: { direction: dir },
          data: { locaKey: locaKeyValue },
          baseZIndex: 100100,
          autoZIndex: true
        });
        increaseDialogRef.onClose.subscribe((result: any) => {
          if (result.toLowerCase() === 'yes') {
            this.showSpinner = true;
            this.validateAmountData();
          }
        });
      } else if (oldAmtValue <= this.getAmountToRollover()){
        this.showSpinner = false;
        this.validateAmountData();
      }
    }
  }

  protected checkMandatoryEmptyFields(controlArray: AbstractControl[]) {
    if (controlArray && controlArray.length > 0){
      controlArray.forEach(control => {
        if (control.status !== 'DISABLED' && control[FccGlobalConstant.PARAMS]
        && control[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] &&
          control[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] === true
          && this.commonService.isEmptyValue(control.value)) {
            control.setErrors({ required: true });
            control.markAsDirty();
            control.markAsTouched();
          }
      });
    }
  }
  validateAmountData() {
    const data = this.patchNewLoanData(false);
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingNewLoans
    .setValue(JSON.stringify(data));
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingNewLoans.markAsDirty();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingNewLoans.markAsTouched();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingNewLoans.updateValueAndValidity();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.createLNButton.markAsDirty();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.createLNButton.markAsTouched();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.createLNButton.updateValueAndValidity();
    this.eventEmitterService.onNewLoanSave();
    this.responseSubscription(false);
  }

  responseSubscription(isFromDelete) {
    this.savedResponseSubscription.push(
      this.commonService.savedResponse$.subscribe(res => {
      if (res){
        this.btnClicked = false;
        const tableRecord = res.body.product_file_set.ln_tnx_record;
        let newArray;
        if (tableRecord){
          if (tableRecord.length > 0) {
            newArray = tableRecord;
          }else {
            newArray = [tableRecord];
          }
        }
        this.setResponse(newArray);
        this.form.get('loanDetails')[FccGlobalConstant.PARAMS].inputData = this.buildTopBanner(newArray);
        this.buildTable(newArray);
        this.form.get('create')[FccGlobalConstant.PARAMS][this.btndisable] = false;
        this.form.updateValueAndValidity();
        if (this.checkboxChecked){
          this.data.editLoan = undefined;
          this.data.isFromEdit = false;
          this.form.reset();
          this.initializeFormGroup();
        }
        if (!isFromDelete){
          if (this.checkboxChecked){
            this.patchFieldValueAndParameters(this.form.get('createAnotherLoan'), 'Y', {});
            const myDiv = document.getElementById('uiCreateLoanDialog');
            myDiv.scrollTop = 0;
          }else {
            this.onClickCancel();
          }
        }
        this.showSpinner = false;
    }
    }, () => {
      this.showSpinner = false;
    })
    );
    this.subscribeErrorResponse();
  }
  buildTopBanner(newArray): any[]{
    const amountToRollover = this.getAmountToRollover();
    const totalNewLoanAmount = this.getTotalNewLoanAmount(newArray);
    const bannerArray = [
      {
        key: `${this.translateService.instant('amountToRollOver')}`,
        fieldType: 'amount',
        value: this.currencyConverterPipe.transform(amountToRollover.toString(), this.iso),
        currency: this.data.bkCurCode
      }];
    if (totalNewLoanAmount > 0){
        bannerArray.push({
          key: `${this.translateService.instant('totalNewLoanAmount')}`,
          fieldType: 'amount',
          value: this.currencyConverterPipe.transform(totalNewLoanAmount.toString(), this.iso),
          currency: this.data.bkCurCode
        },
        {
          key: (amountToRollover > totalNewLoanAmount) ?
          `${this.translateService.instant('principalPayment')}` : `${this.translateService.instant('increaseAmount')}`,
          fieldType: 'amount',
          value: (amountToRollover > totalNewLoanAmount) ?
          this.currencyConverterPipe.transform((amountToRollover - totalNewLoanAmount).toString(), this.iso) :
          this.currencyConverterPipe.transform((totalNewLoanAmount - amountToRollover).toString(), this.iso),
          currency: this.data.bkCurCode
        });
      }
    return bannerArray;
  }
  buildTable(newArray){
    const arrLength = newArray ? newArray.length : 0;
    this.createdLoanData = [];
    if (newArray && arrLength > 1){
      newArray.forEach((loan) => {
        const attachmentResultObj = {
          bankReference: loan.ref_id,
          loanType: loan.pricing_option,
          ccy: loan.ln_cur_code,
          newAmount: loan.ln_amt,
          rollOverDate: loan.repricing_date
        };
        if (this.findRefId(loan.ref_id)){
          this.createdLoanData.push(attachmentResultObj);
        }
      });
      if (this.createdLoanData.length > 0) {
        this.patchFieldParameters(this.form.get('createdLoanTable'), {
          columns: this.getColumns(),
        });
        this.patchFieldParameters(this.form.get('createdLoanTable'), {
          data: this.createdLoanData,
        });
        this.patchFieldParameters(this.form.get('createdLoanTable'), {
          hasData: true,
        });
      } else {
        this.form.get('createdLoanTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.patchFieldParameters(this.form.get('createdLoanTable'), {
          columns: []
        });
        this.patchFieldParameters(this.form.get('createdLoanTable'), { hasData: false });
      }
    }else {
      this.form.get('createdLoanTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.patchFieldParameters(this.form.get('createdLoanTable'), {
        columns: []
      });
      this.patchFieldParameters(this.form.get('createdLoanTable'), { hasData: false });
    }
  }

  getAmountToRollover(): any {
    let amountToRollover: any = 0;
    this.data.bulkLoanDataToPopup.forEach(loan => {
      amountToRollover = amountToRollover + Number(this.commonService.replaceCurrency(loan.ln_liab_amt));
    });
    return amountToRollover;
  }

  onClickTrashIcon(event, key, index) {
    if (this.createdLoanData && this.createdLoanData.length > 1){
      const dir = localStorage.getItem('langDir');
      const locaKeyValue = this.translateService.instant('deleteConfirmationMsg');
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        header: `${this.translateService.instant('deleteFile')}`,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: { locaKey: locaKeyValue },
        baseZIndex: 10010,
        autoZIndex: true
      });
      dialogRef.onClose.subscribe((result: any) => {
        if (result.toLowerCase() === 'yes') {
          this.removeSelectedRow(index);
          this.setDataToGeneralSection();
          this.eventEmitterService.onNewLoanSave();
          this.form.get('create')[FccGlobalConstant.PARAMS][this.btndisable] = true;
          this.form.updateValueAndValidity();
          this.responseSubscription(true);
        }
      });
    } else {
      const dir = localStorage.getItem('langDir');
      const locaKeyValue = this.translateService.instant('cannotDelinkLoanAsItIsLastLoan');
      const deleteAllDialog = this.dialogService.open(ConfirmationDialogComponent, {
        header: `${this.translateService.instant('message')}`,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: { locaKey: locaKeyValue,
          showOkButton: true,
          showCancelButton: true,
          showNoButton: false,
          showYesButton: false
        },
        baseZIndex: 10010,
        autoZIndex: true
      });
      deleteAllDialog.onClose.subscribe(() => {
        //eslint : no-empty-function
      });
    }
  }

  removeSelectedRow(index) {
    if (this.existingOldLoans
      && this.existingOldLoans.ln_tnx_record && this.existingOldLoans.ln_tnx_record.length > 0 ){
      const loanArray = this.existingOldLoans.ln_tnx_record;
      this.existingOldLoans.ln_tnx_record.splice(index, 1);
      this.buildTable(loanArray);
      this.form.get('loanDetails')[FccGlobalConstant.PARAMS].inputData = this.buildTopBanner(loanArray);
    }
  }

  findRefId(refId): boolean{
    const index = this.data.bulkLoanDataToPopup.findIndex(loan => loan.ref_id === refId.toString());
    if (index > -1 ){
      return false;
    }else {
      return true;
    }
  }

  getTotalNewLoanAmount(loanTableArray): any {
    let totalNewLoanAmount: any = 0;
    loanTableArray.forEach(loan => {
      if (this.findRefId(loan.ref_id)){
        totalNewLoanAmount = totalNewLoanAmount + Number(this.commonService.replaceCurrency(loan.ln_amt));
      }
    });
    return totalNewLoanAmount;
  }

  processBulkData() {
    const amountToRollover = this.getAmountToRollover();
    const facDetailArray = [
      {
        key: `${this.translateService.instant('amountToRollOver')}`,
        fieldType: 'amount',
        value: this.currencyConverterPipe.transform(amountToRollover.toString(), this.iso),
        currency: this.data.bkCurCode
      },
    ];
    this.form.get('loanDetails')[FccGlobalConstant.PARAMS].inputData =
      facDetailArray;
    if (this.data.curObject){
      this.getCurrencies();
    }
  }

  setDataToGeneralSection() {
    const data = this.patchNewLoanData(true);
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingNewLoans
    .setValue(JSON.stringify(data));
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingNewLoans.markAsDirty();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingNewLoans.markAsTouched();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingNewLoans.updateValueAndValidity();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansReq
    .setValue(JSON.stringify(data));
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansReq.markAsDirty();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansReq.markAsTouched();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansReq.updateValueAndValidity();
  }

  setResponse(data) {
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansInitiate
    .setValue(JSON.stringify(data));
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansInitiate.markAsDirty();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansInitiate.markAsTouched();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansInitiate.updateValueAndValidity();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansReq
    .setValue(JSON.stringify(data));
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansReq.markAsDirty();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansReq.markAsTouched();
    this.stateService.getSectionData(FccGlobalConstant.LNRPN_GENERAL_DETAILS).controls.repricingOldLoansReq.updateValueAndValidity();
  }

  onClickCancel() {
    if (this.data.isFromEdit && this.data.editLoan && this.existingOldLoans) {
      const index = this.existingOldLoans.ln_tnx_record.findIndex(loan => loan.ref_id === this.data.editLoan.bankReference);
      if (index < 0){
        this.existingOldLoans.ln_tnx_record.push(this.currentLoan);
      }
      const removeIndex = this.existingOldLoans.ln_tnx_record.findIndex(loan => loan.bankReference === this.data.editLoan.bankReference);
      if (removeIndex > -1){
        this.existingOldLoans.ln_tnx_record.splice(removeIndex, 1);
      }
    }
    this.facilityDetailsService.loansAdded = this.existingOldLoans;
    this.showSpinner = false;
    this.matDialogRef.close({ data: this.existingOldLoans });
  }

  getColumns() {
    this.tableColumns = [];
    this.tableColumns = [
      {
        field: 'bankReference',
        header: `${this.translateService.instant('customerReference')}`,
        width: '25%',
      },
      {
        field: 'loanType',
        header: `${this.translateService.instant('pricingOptions')}`,
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
        direction: 'right',
      },
      {
        field: 'rollOverDate',
        header: `${this.translateService.instant('rollOverDate')}`,
        width: '15%',
      }
    ];
    return this.tableColumns;
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  isLoanAmountGreaterThanCommitmentAmount(oldAmtValue) {
    const repricingDate = this.form.get('rollOverDate').value;
    const loanAmount = this.form.get('amount').value;
    const returnData = new Map();
    returnData.set('limitViolated', false);
    if (repricingDate !== '' && loanAmount) {
      this.getCommitmentScheduleAmount(oldAmtValue);
      this.validateAmountWithrepricingDate.subscribe(commitmentData => {
        if (commitmentData) {
          const commitmentAmount = commitmentData.commitmentSchAmount;
          const commitmentScheduled = commitmentData.commitmentScheduled;

          if (commitmentScheduled && commitmentScheduled === 'true'
            && ((parseFloat(this.form.get('amount').value.replace(/,/g, '')) + oldAmtValue ) > parseFloat(commitmentAmount))) {
            returnData.set('limitViolated', true);
            returnData.set('limitAmount', commitmentAmount);
            this.commitmentDataWithrepricingDate.next(returnData);
          } else {
            this.commitmentDataWithrepricingDate.next();
          }
        }
      });
    }
  }
  getCommitmentScheduleAmount(oldAmtValue) {
    let repricingDateValue = this.form.get('rollOverDate').value;
    if (this.dir === 'rtl') {
      repricingDateValue = this.datePipe.transform(repricingDateValue, this.utilityService.getRawDateFormat(), '', 'ar');
    } else {
      repricingDateValue = this.datePipe.transform(repricingDateValue, this.utilityService.getRawDateFormat());
    }
    if (this.form.get('currency') && this.form.get('currency').value && this.facilityDetails && this.facilityDetails.facilityId
      && repricingDateValue && this.form.get('amount') && this.form.get('amount').value ) {
      this.reqSent = true;
      const requestParams = {
        facilityId: this.facilityDetails.facilityId,
        rolloverDate: repricingDateValue,
        facilityCurrency: this.facilityDetails.mainCurrency,
        loanCurrency: this.form.get('currency').value.shortName,
        loanAmount: (parseFloat(this.form.get('amount').value.replace(/,/g, '')) + oldAmtValue)
      };
      this.commonService.getCommitmentScheduledValues(requestParams).subscribe((res) => {
        if (res) {
          this.validateAmountWithrepricingDate.next(res.body);
          this.reqSent = false;
          if (this.btnClicked){
            this.onClickCreate();
          }
        }
      });
    }
  }

  patchNewLoanData(isFromCancel: boolean){
    let obj1;
    let newLoan;
    if (!isFromCancel && this.data.responseObject && this.data.responseObject.length > 0){
      const amt = this.commonService.replaceCurrency(this.form.get('amount').value);
      const valueupdated = this.customCommasInCurrenciesPipe.transform(amt, this.data.bkCurCode);
      newLoan = {
        new_loan_ref_id: (this.data.isFromEdit && this.data.editLoan) ? this.currentLoan.ref_id : '',
        new_loan_tnx_id: (this.data.isFromEdit && this.data.editLoan) ? this.currentLoan.tnx_id : '',
        new_loan_entity: this.data.responseObject[0].entity,
        new_loan_our_ref: this.form.get('customerReference').value,
        new_loan_deal_name: this.data.responseObject[0].bo_deal_name,
        new_loan_deal_id: this.data.responseObject[0].bo_deal_id,
        new_loan_facility_name: this.data.responseObject[0].bo_facility_name,
        new_loan_facility_id: this.data.responseObject[0].bo_facility_id,
        new_loan_pricing_option: this.form.get('pricingOptions').value,
        new_loan_ccy: this.data.bkCurCode,
        new_loan_outstanding_amt: valueupdated,
        new_loan_effective_date: this.form.get('loanEffectiveDate').value,
        new_loan_maturity_date: this.form.get('loanMaturityDate').value,
        new_loan_borrower_reference: this.data.responseObject[0].borrower_reference,
        new_loan_repricing_frequency: this.form.get('rollOverFrequency').value,
        new_loan_repricing_date: this.form.get('rollOverDate').value,
        new_loan_repricing_riskType: this.form.get('riskType').value,
        new_loan_fcn: this.facilityDetails.fcn,
        new_loan_matchFunding: this.data.responseObject[0].match_funding,
        new_fx_conversion_rate: this.data.responseObject[0].fx_conversion_rate,
        new_fac_cur_code: this.data.bkCurCode,
        rem_inst_description: '',
        rem_inst_location_code: '',
        rem_inst_servicing_group_alias: '',
        rem_inst_account_no: ''
      };
    }
    if (this.existingOldLoans && this.existingOldLoans.ln_tnx_record
      && this.existingOldLoans.ln_tnx_record.length > 0) {
      obj1 = {};
      const lnTnxRecord = 'ln_tnx_record';
      obj1[lnTnxRecord] = [];
      this.existingOldLoans.ln_tnx_record.forEach(oldLoan => {
        if (this.findRefId(oldLoan.ref_id)){
          const formattedOldLoan = {
            new_loan_ref_id: oldLoan.ref_id,
            new_loan_tnx_id:  oldLoan.tnx_id,
            new_loan_entity: oldLoan.entity,
            new_loan_our_ref: oldLoan.cust_ref_id,
            new_loan_deal_name: oldLoan.bo_deal_name,
            new_loan_deal_id: oldLoan.bo_deal_id,
            new_loan_facility_name: oldLoan.bo_facility_name,
            new_loan_facility_id: oldLoan.bo_facility_id,
            new_loan_pricing_option: oldLoan.pricing_option,
            new_loan_ccy: this.data.bkCurCode,
            new_loan_outstanding_amt: oldLoan.ln_amt,
            new_loan_effective_date: oldLoan.effective_date,
            new_loan_maturity_date: oldLoan.maturity_date,
            new_loan_borrower_reference: oldLoan.borrower_reference,
            new_loan_repricing_frequency: oldLoan.repricing_frequency,
            new_loan_repricing_date:  oldLoan.repricing_date,
            new_loan_repricing_riskType: oldLoan.risk_type,
            new_loan_fcn: this.facilityDetails.fcn,
            new_loan_matchFunding: oldLoan.match_funding,
            new_fx_conversion_rate: oldLoan.fx_conversion_rate,
            new_fac_cur_code: this.data.bkCurCode,
            rem_inst_description: '',
            rem_inst_location_code: '',
            rem_inst_servicing_group_alias: '',
            rem_inst_account_no: ''
          };
          obj1.ln_tnx_record.push(formattedOldLoan);
        }
      });
      if (!isFromCancel){
        obj1.ln_tnx_record.push(newLoan);
      }
    } else {
      obj1 = {};
      const lnTnxRecord = 'ln_tnx_record';
      if (newLoan){
        obj1[lnTnxRecord] = [newLoan];
      }
    }
    return obj1;
  }

  get savedResponse$(): Observable<any>{
    return this.commonService.savedResponse$;
  }

  get errorResponse$(): Observable<any>{
    return this.commonService.errorResponse$;
  }
  subscribeSavedResponse(){
    this.savedResponseSubscription.push(this.savedResponse$.subscribe(res => {
      if (res && res.body.product_file_set){
        this.existingOldLoans = res.body.product_file_set;
        this.facilityDetailsService.loansAdded = res.body.product_file_set;
      }
    }));
  }
  subscribeErrorResponse(){
    this.savedResponseSubscription.push(this.errorResponse$.subscribe(res => {
      if (res){
        this.showSpinner = false;
        this.onClickCancel();
      }
    }));
  }

  ngOnDestroy(): void {
    this.form.get('rollOverDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
    this.commonService.addedResponse(null);
    if (this.savedResponseSubscription && this.savedResponseSubscription.length > 0){
      this.savedResponseSubscription.forEach(sub => {
        sub.unsubscribe();
      });
    }
    this.onClickCancel();
    this.existingOldLoans = null;
  }
}
