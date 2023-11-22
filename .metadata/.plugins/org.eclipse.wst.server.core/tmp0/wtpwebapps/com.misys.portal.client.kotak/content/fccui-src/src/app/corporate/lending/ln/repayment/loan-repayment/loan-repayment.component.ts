import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { InterestDetailsPopupComponent } from '../../../bk/initiation/interest-details-popup/interest-details-popup.component';
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


@Component({
  selector: 'app-loan-repayment',
  templateUrl: './loan-repayment.component.html',
  styleUrls: ['./loan-repayment.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: LoanRepaymentComponent }]
})
export class LoanRepaymentComponent extends LnProductComponent implements OnInit, AfterViewInit {


  form: FCCFormGroup;
  module = `${this.translateService.instant('loanRepayment')}`;
  applDate: any;
  intialOutstandingAmt: any;
  iso: any;
  maturityDate: any;
  dateFormat: any;
  repricingDate: any;
  dateRequestParams: any = {};
  subscriptionArray: Subscription[] = [];
  facilityID: any;
  lnRefID: any;
  corporateReferenceValueList: any;
  interestDueAmount: any;
  val: any;
  amountErrors: any;
  validAmt: boolean;
  showspinner: boolean;
  displayPaymentTypes = false;
  principalPaymentMandatory: any;
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
              public dialogService: DialogService
    ) {
super(eventEmitterService, stateService, commonService, translateService, confirmationService,
customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
dialogRef, currencyConverterPipe);
}

  ngOnInit(): void {
    super.ngOnInit();
    window.scroll(0, 0);
    this.showspinner = true;
    this.dateFormat = 'dd/MM/yyyy';
    const interpolateParams = 'interpolateParams';
    this.subscriptionArray.push(this.commonService.applDateService.subscribe(res => {
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
      } else {
        this.intialOutstandingAmt = this.form.get('lnLiabAmt').value;
      }
      this.iso = this.form.get(FccGlobalConstant.CURRENCY).value;
      this.applDate = this.form.get('loanApplDate').value ? this.form.get('loanApplDate').value : this.applDate;
      this.maturityDate = this.form.get('loanMaturityDate').value;
      this.repricingDate = this.form.get('repricingDate').value;
      this.corporateReferenceValueList = this.form.get('loanDetailsReference').value;
      this.patchFieldValueAndParameters(this.form.get('loanApplDate'), this.applDate, {});
      this.patchFieldValueAndParameters(this.form.get('balanceOutstanding'),
      this.currencyConverterPipe.transform(this.commonService.replaceCurrency(this.form.get('balanceOutstanding').value),
        this.iso), {});
      let interestDueDate = this.form.get('lnInterestPaymentDate').value;
      if (!interestDueDate || interestDueDate === null || interestDueDate === '') {
        this.form.get('lnInterestPaymentDate').setValue(this.utilityService.transformDateFormat(this.bankServerDateObj));
        this.form.get('interestDue')[interpolateParams] = {
          key: this.translateService.instant('asPer', { date: this.utilityService.transformDateFormat(this.bankServerDateObj) }) };
      } else {
        interestDueDate = this.utilityService.transformDateFormat(
        this.utilityService.transformddMMyyyytoDate(interestDueDate));
        this.form.get('interestDue')[interpolateParams] = {
          key: this.translateService.instant('asPer', { date: interestDueDate })
        };
      }
      this.form.updateValueAndValidity();
      if (this.lendingCommonDataService.isChangePaymentDate === false){
          this.patchFieldValueAndParameters(this.form.get('loanEffectiveDate'), this.bankServerDateObj, {});
      }
      if (this.form.get('repaymentDate') && !(this.form.get('repaymentDate').value)) {
        this.patchFieldValueAndParameters(this.form.get('repaymentDate'), new Date(), {});
      }
      this.form.get('balanceOutstanding').disable();
      this.form.get('balanceOutstanding').updateValueAndValidity();
      this.updateUserEntities();
    }));
  }


     initializeFormGroup() {
      const sectionName = FccGlobalConstant.LN_REPAYMENT;
       this.form = this.stateService.getSectionData(sectionName);
      this.setBankServerDate();
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
    if (this.form.get('amdDate') === null || (this.commonService.isEmptyValue(this.form.get('amdDate').value))) {
      this.commonService.globalBankDate$.subscribe(
        date => {
          this.bankServerDateObj = date;
          this.bankServerDate = this.utilityService.transformDateFormat(this.bankServerDateObj);
          this.form.get('loanEffectiveDate')[this.params][FccGlobalConstant.MIN_DATE] = this.bankServerDateObj;
        }
      );
    } else {
      const dateParts = this.form.get('loanEffectiveDate').value ?? this.form.get('amdDate').value;
      if (dateParts && !dateParts[FccGlobalConstant.LENGTH_2]) {
        this.bankServerDateObj = dateParts;
      } else {
        this.bankServerDateObj = this.utilityService.transformddMMyyyytoDate(dateParts);
      }
    }
  }

    onChangeLnPaymentAmount(){
      this.clearValidationAmt();
      let paymentAmount = this.form.get('lnPaymentAmount').value;
      if (this.validateAmount(paymentAmount)){
        paymentAmount = parseFloat(this.commonService.replaceCurrency(paymentAmount));
        const outstandingAmt = parseFloat(this.commonService.replaceCurrency(this.intialOutstandingAmt));
        this.patchFieldValueAndParameters(this.form.get('balanceOutstanding'),
              this.currencyConverterPipe.transform(
               Number(outstandingAmt - paymentAmount).toString(), this.iso), {});
        this.patchFieldValueAndParameters(this.form.get('lnPaymentAmount'),
               this.currencyConverterPipe.transform(
                 Number(paymentAmount).toString(), this.iso), {});
      }

    }

     onBlurLnPaymentAmount(){
       const lnPaymentAmount = this.form.get('lnPaymentAmount').value;
       this.validateAmount(lnPaymentAmount);
       if (!this.principalPaymentMandatory && this.form.get('lnPaymentAmount').value && this.form.get('lnPaymentAmount').value !== null &&
         this.form.get('lnPaymentAmount').value !== '') {
         this.form.get('interestPaymentAmount')[FccGlobalConstant.PARAMS].required = false;
         this.form.get('interestPaymentAmount').clearValidators();
       }
    }

    validateAmount(amount: any){
      this.clearValidationAmt();
      if (this.principalPaymentMandatory && (amount === undefined || amount === null || amount === '')){
        this.setOriginalAmt();
        this.form.get('lnPaymentAmount').setErrors({ amountNotNull: true });
        this.form.controls.lnPaymentAmount.markAsDirty();
        this.form.controls.lnPaymentAmount.markAsTouched();
        this.form.updateValueAndValidity();
        return false;
      } else if (amount && amount !== '' && amount !== null && parseFloat(amount) === 0){
        this.setOriginalAmt();
        this.form.get('lnPaymentAmount').setErrors({ zeroamount: true });
        this.form.updateValueAndValidity();
        return false;
      } else if (amount && amount !== '' && amount !== null && amount < 0){
        this.setOriginalAmt();
        this.form.get('lnPaymentAmount').setErrors({ invalidAmt: true });
        this.form.updateValueAndValidity();
        return false;
      } else if ((amount && amount !== '' && amount !== null && parseFloat(this.commonService.replaceCurrency(this.intialOutstandingAmt)) -
                 parseFloat(this.commonService.replaceCurrency(amount))) < 0){
        this.setOriginalAmt();
        this.form.get('lnPaymentAmount').setErrors(
            { loanPaymentamountvalidation: true });
        this.form.updateValueAndValidity();
        return false;
      }
      return true;
    }

    clearValidationAmt(){
      this.form.get('lnPaymentAmount').clearValidators();
      this.form.updateValueAndValidity();
    }

    setOriginalAmt(){
      this.patchFieldValueAndParameters(this.form.get('balanceOutstanding'),
      this.currencyConverterPipe.transform(
        Number(this.commonService.replaceCurrency(this.intialOutstandingAmt)).toString(), this.iso), {});
    }

    onClickLoanEffectiveDate(){
      this.form.get('loanEffectiveDate').clearValidators();
      this.form.get('loanEffectiveDate').setErrors(null);
      this.form.updateValueAndValidity();
      this.setEffectiveDateAsPerTheBusinessDayRule();
      this.setAmendMentDate();
      this.lendingCommonDataService.isChangePaymentDate = true;
    }

    fieldIconClick() {
      const generalDetails = this.stateService.getSectionData(FccGlobalConstant.LN_GENERAL_DETAILS).controls;
      const header = this.translateService.instant('interestDetails').concat(' | ').concat(generalDetails.bankReferenceView.value);
      const data = {
        boRefId: generalDetails.bankReferenceView.value,
        loanCCY: this.form.get('currency').value
      };

      const dir = localStorage.getItem('langDir');
      this.dialogService.open(InterestDetailsPopupComponent, {
        header,
        data,
        width: '75vw',
        contentStyle: {
          height: '65vh',
          overflow: 'auto',
          backgroundColor: '#fff'
        },
        styleClass: 'interestDetailsPopup',
        showHeader: true,
        baseZIndex: 9999,
        autoZIndex: true,
        dismissableMask: false,
        closeOnEscape: true,
        style: { direction: dir }
      });
    }

  onOpenLoanEffectiveDate() {
    (document.querySelector('.cdk-overlay-container') as HTMLElement).style.zIndex = '10000';
  }


    ngAfterViewInit(){
      const lnPaymentAmount = this.form.get('lnPaymentAmount').value;
      if (this.lendingCommonDataService.paymentAmtrrorsCheck) {
        this.validateAmount(lnPaymentAmount);
      }
      this.onClickLoanEffectiveDate();
    }

    checkErrors(){
      if (this.form.get('lnPaymentAmount').hasError('amountNotNull') ||
        this.form.get('lnPaymentAmount').hasError('zeroamount') ||
        this.form.get('lnPaymentAmount').hasError('invalidAmt') ||
        this.form.get('lnPaymentAmount').hasError('loanPaymentamountvalidation')
      ) {
        this.lendingCommonDataService.paymentAmtrrorsCheck = true;
      } else {
        this.lendingCommonDataService.paymentAmtrrorsCheck = false;
      }
      if (this.form.get('interestPaymentType').value === 'partialPayment') {
        this.form.get('interestPaymentAmount').setValidators([Validators.required]);
        this.form.get('interestPaymentAmount').setErrors(this.amountErrors);
        this.form.get('interestPaymentAmount').markAsDirty();
        this.form.get('interestPaymentAmount').markAsTouched();
      }
    }

    setEffectiveDateAsPerTheBusinessDayRule() {
      this.form.get('loanEffectiveDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.WARNING] = '';
      let convertedEffectiveDate = this.form.get('loanEffectiveDate').value;
      if (convertedEffectiveDate !== '' && convertedEffectiveDate !== null && convertedEffectiveDate !== undefined) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        convertedEffectiveDate.setHours(0, 0, 0, 0);
        if (currentDate > convertedEffectiveDate){
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
        this.utilityService.compareDateFields(this.bankServerDateObj, this.utilityService.transformddMMyyyytoDate(effectiveDate))) {
        effectiveDate = this.utilityService.transformDateFormat(this.bankServerDateObj);
      }
      if (this.form.get('pricingOptions').value !== '' && effectiveDate !== '' && this.form.get('currency').value !== '' ) {
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
        this.subscriptionArray.push(this.commonService.getValidateBusinessDate(this.dateRequestParams).subscribe((res) => {
          if (res) {
            let formattedDate = this.form.get('loanEffectiveDate').value;
            formattedDate = this.utilityService.transformDateFormat(formattedDate);
            if (formattedDate.toString() !== res.adjustedLocalizedDate.toString()) {
                  this.populateBusinessDateForEffectiveDateField(res.adjustedDate);
            }
          }
          const increaseeffectivedate = this.form.get('loanEffectiveDate').value;
          this.setAmendMentDate();
          if (this.applDate && increaseeffectivedate && (new Date(increaseeffectivedate).getTime() > new Date().getTime())
                    && new Date(increaseeffectivedate).getTime() <
                    new Date(this.commonService.convertToDateFormat(this.applDate)).getTime()
              ){
                this.form.get('loanEffectiveDate'). setErrors({ loanIncreaseEffectiveDateValidation:
                   { effectiveDate: this.datePipe.transform(increaseeffectivedate, this.dateFormat) } });
                this.form.updateValueAndValidity();
          } else if (this.maturityDate && increaseeffectivedate && new Date(increaseeffectivedate) >=
              new Date(new Date(this.commonService.convertToDateFormat(this.maturityDate)).getTime())){
              this.form.get('loanEffectiveDate').setErrors({ loanEffectiviedateWithMaturityDate:
                { effectiveDate: this.datePipe.transform(increaseeffectivedate, this.dateFormat),
                  maturityDate: this.maturityDate } });
              this.form.updateValueAndValidity();
          }
        }));
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
      this.subscriptionArray.push(
        this.multiBankService.getCustomerBankDetailsAPI(FccGlobalConstant.PRODUCT_LN, '', FccGlobalConstant.REQUEST_INTERNAL).subscribe(
          res => {
            if (res){
              this.getConfigs();
              this.multiBankService.initializeLendingProcess(res);
              this.initializeBorrowerRefID();
              this.setEffectiveDateAsPerTheBusinessDayRule();
              this.getInterestDetails();
            }
        }));
      }

  setAmendMentDate(){
    const increaseeffectivedate = this.form.get('loanEffectiveDate').value;
    this.patchFieldValueAndParameters(this.form.get('amdDate'), this.utilityService.transformDateFormat(increaseeffectivedate), {});
    this.form.updateValueAndValidity();
  }

  setSubTnxTypeCode(){
    this.patchFieldValueAndParameters(this.form.get('subTnxTypeCode'), FccGlobalConstant.N003_PAYMENT, {});
    this.form.updateValueAndValidity();
   }

   onKeydownLoanEffectiveDate(){
    this.onClickLoanEffectiveDate();
  }

  getInterestDetails() {
    const generalDetails = this.stateService.getSectionData(FccGlobalConstant.LN_GENERAL_DETAILS).controls;
    this.subscriptionArray.push(
      this.lendingCommonDataService.getInterestDetails(generalDetails.bankReferenceView.value, this.form.get('currency').value)
        .subscribe(interestDetails => {
      const tempData = interestDetails.map((element) => element.index);
      if (tempData && tempData[0]) {
        tempData[0].map((element) => {
          if (element.name === FccGlobalConstant.TOTAL_PROJECT_EOC_AMOUNT) {
            this.patchFieldValueAndParameters(this.form.get('interestDueAmtHidden'), element.value, {});
            this.patchFieldValueAndParameters(this.form.get('interestDue'),
                `${this.form.get('currency').value} ${element.value}`, {});
            this.stateService.getSectionData(FccGlobalConstant.LN_REPAYMENT).updateValueAndValidity();
            const interestAmountHidden = parseFloat(this.form.controls.interestDueAmtHidden.value);
            if (this.principalPaymentMandatory && interestAmountHidden === FccGlobalConstant.LENGTH_0) {
              this.form.get('interestPaymentSelected')[FccGlobalConstant.PARAMS].disabled = true;
              this.form.get('interestPaymentAmount')[FccGlobalConstant.PARAMS].required = false;
              this.form.get('interestPaymentAmount').clearValidators();
            } else if (!this.principalPaymentMandatory && interestAmountHidden !== FccGlobalConstant.LENGTH_0) {
              this.form.get('lnPaymentAmount')[FccGlobalConstant.PARAMS].required = false;
              this.form.get('lnPaymentAmount').clearValidators();
            } else {
              this.onClickInterestPaymentSelected();
              this.onClickInterestPaymentType();
            }
            this.showspinner = false;
          }
      });
      }
    }));
  }

  getConfigs() {
    this.subscriptionArray.push(this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response.lnAllowPartialInterestPayment !== undefined || response.lnAllowPartialInterestPayment !== null) {
      this.displayPaymentTypes = response.lnAllowPartialInterestPayment;
      this.principalPaymentMandatory = response.lnPrincipalePaymentMandatory;
      }
      if (!this.principalPaymentMandatory) {
        this.form.get('principlePmtOrinterestPmtErrToBeFilled')[FccGlobalConstant.PARAMS].rendered = true;
      }
    }));
  }

  onClickInterestPaymentSelected() {
    if (this.form.get('interestPaymentSelected').value === FccGlobalConstant.CODE_Y) {
      if (this.displayPaymentTypes) {
        this.form.get('interestPaymentType')[this.params][FccGlobalConstant.RENDERED] = true;
        if (this.form.get('interestPaymentType').value === 'partialPayment') {
          this.form.get('lnInterestAmountCurrency')[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get('interestPaymentAmount')[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get('lnInterestAmountCurrency')[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get('lnInterestAmountCurrency').setValue(this.form.get('currency').value);
        } else {
          this.form.get('lnInterestAmountCurrency')[this.params][FccGlobalConstant.RENDERED] = false;
          this.form.get('interestPaymentType').setValue('fullPayment');
          this.form.get('lnInterestAmountCurrency').setValue(this.form.get('currency').value);
          this.form.get('interestPaymentAmount')[this.params][FccGlobalConstant.RENDERED] = false;
          this.form.get('interestPaymentAmount').setValue(this.form.get('interestDueAmtHidden').value);
        }
      } else {
        this.form.get('interestPaymentType')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('interestPaymentType').setValue(null);
        this.form.get('lnInterestAmountCurrency')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('lnInterestAmountCurrency').setValue(this.form.get('currency').value);
        this.form.get('interestPaymentAmount')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('interestPaymentAmount').setValue(this.form.get('interestDueAmtHidden').value);
      }
    } else {
      this.form.get('interestPaymentType')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('interestPaymentType').setValue(null);
      this.form.get('lnInterestAmountCurrency')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('lnInterestAmountCurrency').setValue(null);
      this.form.get('interestPaymentAmount')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('interestPaymentAmount').setValue(null);
    }
  }

  onClickInterestPaymentType() {
    if (this.form.get('interestPaymentType').value === 'partialPayment') {
      this.form.get('interestPaymentAmount')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get('lnInterestAmountCurrency')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get('lnInterestAmountCurrency').setValue(this.form.get('currency').value);
    } else if (this.form.get('interestPaymentType').value === 'fullPayment') {
      this.form.get('lnInterestAmountCurrency')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('lnInterestAmountCurrency').setValue(this.form.get('currency').value);
      this.form.get('interestPaymentAmount')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('interestPaymentAmount').setValue(this.form.get('interestDueAmtHidden').value);
    } else {
      this.form.get('lnInterestAmountCurrency')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('interestPaymentAmount')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('interestPaymentAmount')[FccGlobalConstant.PARAMS].required = false;
      this.form.get('interestPaymentAmount').clearValidators();
    }
  }

  onBlurInterestPaymentAmount() {
    this.val = this.form.get('interestPaymentAmount').value;
    this.validateLoanInterestAmount();
    if (this.validAmt && this.iso !== '') {
      const amt = this.commonService.replaceCurrency(this.form.get('interestPaymentAmount').value);
      const valueupdated = this.currencyConverterPipe.transform(amt, this.iso);
      this.form.get('interestPaymentAmount').setValue(valueupdated);
      this.form.get('interestPaymentAmount').updateValueAndValidity();
    }
    if (!this.principalPaymentMandatory && this.form.get('interestPaymentAmount').value &&
      this.form.get('interestPaymentAmount').value !== null &&
      this.form.get('interestPaymentAmount').value !== '') {
      this.form.get('lnPaymentAmount')[FccGlobalConstant.PARAMS].required = false;
      this.form.get('lnPaymentAmount').clearValidators();
    }
    this.amountErrors = this.form.get('interestPaymentAmount').errors;
  }
  validateLoanInterestAmount() {
    if (this.form.get('interestPaymentAmount')) {
      this.validAmt = true;
      const currencyVal = this.form.get('currency').value;
      if (currencyVal && currencyVal !== '') {
        if (this.principalPaymentMandatory && (this.val === null || this.val === undefined || this.val === '')) {
          this.form.get('interestPaymentAmount').setErrors({ amountNotNull: true });
          this.amountErrors = this.form.get('interestPaymentAmount').errors;
          this.validAmt = false;
        }
        if (this.val && this.val !== null && this.val !== '' && this.val <= 0) {
          this.form.get('interestPaymentAmount').setErrors({ amountCanNotBeZero: true });
          this.amountErrors = this.form.get('interestPaymentAmount').errors;
          this.validAmt = false;
        }
        if (this.val && this.val !== null && this.val > parseFloat(this.form.get('interestDueAmtHidden').value)) {
          this.form.get('interestPaymentAmount').setErrors({ amountCanNotBeGreaterThanInterestDue: true });
          this.amountErrors = this.form.get('interestPaymentAmount').errors;
          this.validAmt = false;
        }
      }
    }
  }

  ngOnDestroy() {
    this.checkErrors();
    if (this.subscriptionArray && this.subscriptionArray.length > 0){
      this.subscriptionArray.forEach(sub => {
        sub.unsubscribe();
      });
    }
    this.stateService.setStateSection(FccGlobalConstant.LN_REPAYMENT, this.form);
  }
}
