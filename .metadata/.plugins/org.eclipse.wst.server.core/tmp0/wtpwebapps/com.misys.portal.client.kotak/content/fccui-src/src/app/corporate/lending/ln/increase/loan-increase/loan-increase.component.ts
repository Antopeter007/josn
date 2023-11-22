import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService } from 'primeng/api';

import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CodeDataService } from './../../../../../common/services/code-data.service';
import { CommonService } from './../../../../../common/services/common.service';
import { DropDownAPIService } from './../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { MultiBankService } from './../../../../../common/services/multi-bank.service';
import { ResolverService } from './../../../../../common/services/resolver.service';
import { SearchLayoutService } from './../../../../../common/services/search-layout.service';
import { SessionValidateService } from './../../../../../common/services/session-validate-service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LnProductComponent } from './../../../../lending/ln/initiation/ln-product/ln-product.component';
import { ProductStateService } from './../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from './../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from './../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from './../../../../trade/lc/initiation/services/utility.service';
import { LendingCommonDataService } from './../../../common/service/lending-common-data-service';
import { FacilityDetailsService } from './../../initiation/services/facility-details.service';
import { CorporateCommonService } from '../../../../../corporate/common/services/common.service';


@Component({
  selector: 'app-loan-increase',
  templateUrl: './loan-increase.component.html',
  styleUrls: ['./loan-increase.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LoanIncreaseComponent }]
})
export class LoanIncreaseComponent extends LnProductComponent implements OnInit, AfterViewInit {

  form: FCCFormGroup;
  module = `${this.translateService.instant('loanIncrease')}`;
  applDate: any;
  iso: any;
  intialOutstandingAmt: any;
  facilityAmount: any;
  maturityDate: any;
  dateFormat: any;
  repricingDate: any;
  riskTypeLimitAmt: any;
  borrowerLimitAmt: any;
  dateRequestParams: any = {};
  facilityID: any;
  lnRefID: any;
  corporateReferenceValueList: any;
  bankServerDate: any;
  bankServerDateObj: Date;

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
              protected stateService: ProductStateService, protected translateService: TranslateService,
              protected eventEmitterService: EventEmitterService, protected dropdownAPIService: DropDownAPIService,
              public fccGlobalConstantService: FccGlobalConstantService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              public datePipe: DatePipe, protected multiBankService: MultiBankService,
              protected facilityDetailsService: FacilityDetailsService, protected currencyConverterPipe: CurrencyConverterPipe,
              protected codeDataService: CodeDataService, protected lendingCommonDataService: LendingCommonDataService,
              protected corporateCommonService: CorporateCommonService,
    ) {
super(eventEmitterService, stateService, commonService, translateService, confirmationService,
customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
dialogRef, currencyConverterPipe);
}

  ngOnInit(): void {
    super.ngOnInit();
    window.scroll(0, 0);
    this.dateFormat = 'dd/MM/yyyy';
    this.commonService.applDateService.subscribe(res => {
      this.applDate = res;
      this.initializeFormGroup();
      this.setSubTnxTypeCode();
      const generaDetailsSection = this.stateService.getSectionData(FccGlobalConstant.LN_GENERAL_DETAILS);
      this.facilityID = generaDetailsSection.get('facilityID').value;
      if (this.stateService.getSectionData(
        'lnGeneralDetails', undefined, true, 'MASTERSTATE') && this.stateService.getSectionData(
          'lnGeneralDetails', undefined, true, 'MASTERSTATE').get('balanceOutstanding')) {
        this.intialOutstandingAmt = this.stateService
          .getSectionData('lnGeneralDetails', undefined, true, 'MASTERSTATE').get('balanceOutstanding').value;
      }else {
         this.intialOutstandingAmt = this.form.get('lnLiabAmt').value;
       }
      this.iso = this.form.get(FccGlobalConstant.CURRENCY).value;
      this.applDate = this.form.get('loanApplDate').value ? this.form.get('loanApplDate').value : this.applDate;
      this.maturityDate = this.form.get('loanMaturityDate').value;
      this.repricingDate = this.form.get('repricingDate').value;
      this.corporateReferenceValueList = this.form.get('loanDetailsReference').value;
      this.patchFieldValueAndParameters(this.form.get('loanApplDate'), this.applDate, {});
      this.patchFieldValueAndParameters(this.form.get('balanceOutstanding'),
            this.currencyConverterPipe.transform(this.commonService.replaceCurrency(
            this.form.get('balanceOutstanding').value),
            this.iso), {});
      const availableWithPendingLoans = 'availableWithPendingLoans';
      if (this.facilityDetailsService.getFacilityDetailsObj()[availableWithPendingLoans]){
        this.facilityAmount = this.facilityDetailsService.getFacilityDetailsObj()[availableWithPendingLoans];
      }
      const riskType = this.form.get('riskType').value;
      if (this.facilityDetailsService.getFacilityDetailsObj()[`borrowers`]) {
        this.facilityDetailsService.getFacilityDetailsObj()[`borrowers`][0].currencies.forEach(e => {
          if (e.currencyName === this.iso) {
            if (riskType) {
              this.riskTypeLimitAmt = e.riskTypeLimit[riskType];
            }
            this.borrowerLimitAmt = e[`borrowerLimit`];
          }
        });
      }
      if (this.lendingCommonDataService.isChangeIncreaseDate === false){
        this.patchFieldValueAndParameters(this.form.get('loanEffectiveDate'), new Date(), {});
      }

      this.form.get('balanceOutstanding').disable();
      this.form.get('balanceOutstanding').updateValueAndValidity();
      this.updateUserEntities();
      this.setBankServerDate();
    });
  }

     initializeFormGroup() {
      const sectionName = FccGlobalConstant.LN_INCREASE;
      this.form = this.stateService.getSectionData(sectionName);
      if (
        this.form &&
        this.form.controls &&
        this.form.controls.loanEffectiveDate &&
        this.utilityService.compareDateFields(
          this.bankServerDateObj,
          this.form.controls.loanEffectiveDate.value
        )
      ) {
        this.patchFieldValueAndParameters(
          this.form.get('loanEffectiveDate'),
          this.bankServerDateObj,
          {}
        );
      }
    }

    setBankServerDate() {
      if (this.commonService.isEmptyValue(this.form.get('amdDate').value)) {
        this.commonService.globalBankDate$.subscribe(
          date => {
            this.bankServerDateObj = date;
            this.bankServerDate = this.utilityService.transformDateFormat(this.bankServerDateObj);
            this.form.get('loanEffectiveDate')[this.params][FccGlobalConstant.MIN_DATE] = this.bankServerDateObj;
            this.populateBusinessDateForEffectiveDateField(this.bankServerDate);
            this.setEffectiveDateAsPerTheBusinessDayRule();
          }
        );
      } else {
        const dateParts = this.form.get('loanEffectiveDate').value ?? this.form.get('amdDate').value;
        this.populateBusinessDateForEffectiveDateField(dateParts);
        this.bankServerDateObj = this.utilityService.transformddMMyyyytoDate(dateParts);
      }
    }

    ngOnDestroy() {
      this.checkErrors();
      this.stateService.setStateSection(FccGlobalConstant.LN_INCREASE, this.form);
    }

    onChangeLnIncreaseAmount(){
      this.clearValidationAmt();
      const increasedAmt = this.form.get('lnIncreaseAmount').value;
      if (this.validateAmount(increasedAmt)){
              const increasedAmtM = parseFloat(this.commonService.replaceCurrency(increasedAmt));
              const outstandingAmt = parseFloat(this.commonService.replaceCurrency(this.intialOutstandingAmt));
              this.patchFieldValueAndParameters(this.form.get('balanceOutstanding'),
                  this.currencyConverterPipe.transform(
                    Number(increasedAmtM + outstandingAmt).toString(), this.iso), {});

              if (!this.form.get('lnIncreaseAmount').hasError('loanIncreaseAmountExceededlimit') &&
                  !this.form.get('lnIncreaseAmount').hasError('loanAmountTooBigThanBorrowerRiskTypeLimitAmtError')){
                this.patchFieldValueAndParameters(this.form.get('lnIncreaseAmount'),
                this.currencyConverterPipe.transform(
                  Number(increasedAmt).toString(), this.iso), {});
              }
      }

    }

     onBlurLnIncreaseAmount(){
       const increasedAmt = this.form.get('lnIncreaseAmount').value;
       this.validateAmount(increasedAmt);
    }

    validateAmount(amount: any){
      this.clearValidationAmt();
      if (amount === undefined || amount === null || amount === ''){
        this.setOriginalAmt();
        this.form.get('lnIncreaseAmount').setErrors({ amountNotNull: true });
        this.form.controls.lnIncreaseAmount.markAsDirty();
        this.form.controls.lnIncreaseAmount.markAsTouched();
        this.form.updateValueAndValidity();
        return false;
      }else if (parseFloat(amount) === 0){
        this.setOriginalAmt();
        this.form.get('lnIncreaseAmount').setErrors({ zeroamount: true });
        this.form.updateValueAndValidity();
        return false;
      }else if (parseFloat(amount) < 0){
        this.setOriginalAmt();
        this.form.get('lnIncreaseAmount').setErrors({ invalidAmt: true });
        this.form.updateValueAndValidity();
        return false;
      }else if (parseFloat(amount) > 0){

        if (parseFloat(this.commonService.replaceCurrency(amount)) > parseFloat(this.borrowerLimitAmt)){
          this.form.get('lnIncreaseAmount').setErrors(
            { loanAmountBiggerThanBorrowerLimit: { cur: this.iso,
              amt: this.currencyConverterPipe.transform(this.borrowerLimitAmt, this.iso) } });
          this.form.updateValueAndValidity();
          return true;
      }

        if (parseFloat(this.commonService.replaceCurrency(amount)) > parseFloat(this.facilityAmount)
          && parseFloat(this.facilityAmount) < parseFloat(this.riskTypeLimitAmt)){
            this.form.get('lnIncreaseAmount').setErrors(
              { loanIncreaseAmountExceededlimit: { cur: this.iso,
                amt: this.currencyConverterPipe.transform(this.facilityAmount, this.iso) } });
            this.form.updateValueAndValidity();
            return true;
        }
        if (parseFloat(this.commonService.replaceCurrency(amount)) > parseFloat(this.riskTypeLimitAmt)
        && parseFloat(this.riskTypeLimitAmt) < parseFloat(this.facilityAmount)){
          this.form.get('lnIncreaseAmount').setErrors(
            { loanAmountTooBigThanBorrowerRiskTypeLimitAmtError: { cur: this.iso,
              amt: this.currencyConverterPipe.transform(this.riskTypeLimitAmt, this.iso) } });
          this.form.updateValueAndValidity();
          return true;
        }
      }

      return true;

    }

    clearValidationAmt(){
      this.form.get('lnIncreaseAmount').clearValidators();
      this.form.updateValueAndValidity();
    }

    setOriginalAmt(){
      this.patchFieldValueAndParameters(this.form.get('balanceOutstanding'),
      this.currencyConverterPipe.transform(
        Number(this.commonService.replaceCurrency(this.intialOutstandingAmt)).toString(), this.iso), {});
    }

    onClickLoanEffectiveDate(event){
      if (event.value) {
        this.form.get('loanEffectiveDate').clearValidators();
        this.form.get('loanEffectiveDate').setErrors(null);
        this.form.updateValueAndValidity();
        this.setEffectiveDateAsPerTheBusinessDayRule();
        this.setAmendMentDate();
        this.lendingCommonDataService.isChangeIncreaseDate = true;
      } else {
        this.patchFieldValueAndParameters(this.form.get('loanEffectiveDate'), null, {});
        this.patchFieldValueAndParameters(this.form.get('amdDate'), null, {});
        this.form.get('loanEffectiveDate').markAsDirty();
        this.form.get('loanEffectiveDate').markAsTouched();
        this.form.get('loanEffectiveDate').setErrors({ required: true });
        this.form.updateValueAndValidity();
        return;
      }
    }

    onOpenLoanEffectiveDate(){
      (document.querySelector('.cdk-overlay-container') as HTMLElement).style.zIndex = '10000';
    }

    ngAfterViewInit(){
        const increasedAmt = this.form.get('lnIncreaseAmount').value;
        if (this.lendingCommonDataService.increaseAmtrrorsCheck ){
          this.validateAmount(increasedAmt);
        }
        if (this.form.get('loanEffectiveDate') && this.form.get('loanEffectiveDate').value) {
          const event = {
            value: this.form.get('loanEffectiveDate').value
          };
          this.onClickLoanEffectiveDate(event);
        }
    }

    checkErrors(){
      if ( this.form.get('lnIncreaseAmount').hasError('amountNotNull') ||
      this.form.get('lnIncreaseAmount').hasError('zeroamount') ||
      this.form.get('lnIncreaseAmount').hasError('invalidAmt') ||
      this.form.get('lnIncreaseAmount').hasError('loanIncreaseAmountExceededlimit')
    ) {
         this.lendingCommonDataService.increaseAmtrrorsCheck = true;
      }else{
        this.lendingCommonDataService.increaseAmtrrorsCheck = false;
      }
    }

    setEffectiveDateAsPerTheBusinessDayRule() {
      this.form.get('loanEffectiveDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
      let convertedEffectiveDate = this.form.get('loanEffectiveDate').value;
      if (convertedEffectiveDate !== '' && convertedEffectiveDate !== null && convertedEffectiveDate !== undefined) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        convertedEffectiveDate.setHours(0, 0, 0, 0);
        if (this.bankServerDateObj > convertedEffectiveDate){
          convertedEffectiveDate = this.form.get('loanEffectiveDate').value;
          this.form.get('loanEffectiveDate').markAsDirty();
          this.form.get('loanEffectiveDate').markAsTouched();
          this.form.get('loanEffectiveDate').setErrors({ effectiveDateGreaterThanSystemDate: {
            date : this.utilityService.transformDateFormat(convertedEffectiveDate)
          } });
          this.form.updateValueAndValidity();
          return;
        }
        convertedEffectiveDate = this.utilityService.transformDateFormat(
          convertedEffectiveDate);
      }else{
        this.form.get('loanEffectiveDate').markAsDirty();
        this.form.get('loanEffectiveDate').markAsTouched();
        this.form.get('loanEffectiveDate').setErrors({ required: true });
        this.form.updateValueAndValidity();
        return;
      }
      let effectiveDate = convertedEffectiveDate ? convertedEffectiveDate : this.applDate;
      if (effectiveDate &&
        this.utilityService.compareDateFields(this.bankServerDateObj,
          this.utilityService.transformddMMyyyytoDate(effectiveDate))) {
        effectiveDate = this.utilityService.transformDateFormat(this.bankServerDateObj);
      }
      if (this.form.get('pricingOptions').value !== '' && this.form.get('currency').value !== '' ) {
        this.dateRequestParams = {};
        this.dateRequestParams.dateToValidate = effectiveDate;
        this.dateRequestParams.isRepricingDate = 'N';
        this.dateRequestParams.boFacilityId = this.facilityID;
        this.dateRequestParams.currency = this.form.get('currency').value;
        this.dateRequestParams.pricingOptionName = this.form.get('pricingOptions').value;
        this.dateRequestParams.dealId = this.stateService.getSectionData(
          FccGlobalConstant.LN_GENERAL_DETAILS).get('dealID').value;
        this.dateRequestParams.operation = '';
        this.dateRequestParams.borrowerId = this.lnRefID;
        this.commonService.getValidateBusinessDate(this.dateRequestParams).subscribe((res) => {
          if (res) {
            let formattedDate = this.form.get('loanEffectiveDate').value;
            formattedDate = this.utilityService.transformDateFormat(formattedDate);
            if (formattedDate.toString() !== res.adjustedLocalizedDate.toString()) {
                  this.populateBusinessDateForEffectiveDateField(res.adjustedDate);
            }
          }
          const increaseeffectivedate = this.form.get('loanEffectiveDate').value;
          this.setAmendMentDate();
          if (increaseeffectivedate && (new Date(increaseeffectivedate).getTime() > this.bankServerDateObj.getTime())
            && new Date(increaseeffectivedate).getTime() <
            new Date(this.commonService.convertToDateFormat(this.applDate)).getTime()) {
            this.form.get('loanEffectiveDate').setErrors({
              loanIncreaseEffectiveDateValidation:
              {
                effectiveDate: this.datePipe.transform(increaseeffectivedate, this.dateFormat)
              }
            });
            this.form.get('loanEffectiveDate').markAsDirty();
            this.form.get('loanEffectiveDate').markAsTouched();
            this.form.updateValueAndValidity();
          } else if (this.repricingDate &&
            (new Date(this.commonService.convertToDateFormat(this.repricingDate)).getTime() >= this.bankServerDateObj.getTime())
            && (new Date(increaseeffectivedate) >=
              new Date(new Date(this.commonService.convertToDateFormat(this.repricingDate)).getTime()))) {
            this.form.get('loanEffectiveDate').setErrors({
              loanEffectiviedateWithRepricingDate:
              {
                effectiveDate: this.datePipe.transform(increaseeffectivedate, this.dateFormat),
                repricingDate: this.repricingDate
              }
            });
            this.form.get('loanEffectiveDate').markAsDirty();
            this.form.get('loanEffectiveDate').markAsTouched();
            this.form.updateValueAndValidity();
          } else if (this.maturityDate && new Date(increaseeffectivedate) >=
            new Date(new Date(this.commonService.convertToDateFormat(this.maturityDate)).getTime())) {
            this.form.get('loanEffectiveDate').setErrors({
              loanEffectiviedateWithMaturityDate:
              {
                effectiveDate: this.datePipe.transform(increaseeffectivedate, this.dateFormat),
                maturityDate: this.maturityDate
              }
            });
            this.form.get('loanEffectiveDate').markAsDirty();
            this.form.get('loanEffectiveDate').markAsTouched();
            this.form.updateValueAndValidity();
          }
        });
      }
    }

    populateBusinessDateForEffectiveDateField(response) {
      if (response) {
        const dateObject = this.utilityService.transformddMMyyyytoDate(response);
        const effectiveDateField = this.form.get('loanEffectiveDate').value;
        if (effectiveDateField ) {
            let formattedDate = effectiveDateField;
            formattedDate = this.utilityService.transformDateFormat(formattedDate);
            this.form.get('loanEffectiveDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING]
              = `${this.translateService.instant('effectiveDateBusinessDayValidationErrorMsg', {
                date: formattedDate
              })}`;
          }
        this.patchFieldValueAndParameters(this.form.get('loanEffectiveDate'), dateObject, {});
      }
    }

    initializeBorrowerRefID(){
      const internalReferenceList = this.multiBankService.getBorrowerReferenceInternalList();
      internalReferenceList.forEach(reference => {
        if (this.corporateReferenceValueList === reference.value) {
          this.lnRefID = reference.id;
        }
      });
    }

    updateUserEntities(){
      this.multiBankService.getCustomerBankDetailsAPI(FccGlobalConstant.PRODUCT_LN, '', FccGlobalConstant.REQUEST_INTERNAL).subscribe(
          res => {
            this.multiBankService.initializeLendingProcess(res);
            this.initializeBorrowerRefID();
            this.setEffectiveDateAsPerTheBusinessDayRule();
        });
      }

    setAmendMentDate(){
      const increaseeffectivedate = this.form.get('loanEffectiveDate').value;
      this.patchFieldValueAndParameters(this.form.get('amdDate'), this.utilityService.transformDateFormat(increaseeffectivedate), {});
      this.form.updateValueAndValidity();
    }

   setSubTnxTypeCode(){
    this.patchFieldValueAndParameters(this.form.get('subTnxTypeCode'), FccGlobalConstant.N003_INCREASE, {});
    this.form.updateValueAndValidity();
   }

   onKeydownLoanEffectiveDate(event){
    this.onClickLoanEffectiveDate(event);
  }

}
