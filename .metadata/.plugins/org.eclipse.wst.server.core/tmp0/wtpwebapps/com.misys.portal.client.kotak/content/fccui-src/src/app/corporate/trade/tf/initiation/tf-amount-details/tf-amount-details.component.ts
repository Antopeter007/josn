import { Component, ElementRef, EventEmitter, OnInit, Output, AfterViewInit, HostListener } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';

import { FCCFormGroup } from '../../../../../../app/base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../app/common/core/fcc-global-constants';
import { CurrencyRequest } from '../../../../../../app/common/model/currency-request';
import { ExchangeRateRequest } from '../../../../../../app/common/model/xch-rate-request';
import { CommonService } from '../../../../../../app/common/services/common.service';
import { EventEmitterService } from '../../../../../../app/common/services/event-emitter-service';
import { FormModelService } from '../../../../../../app/common/services/form-model.service';
import { LcTemplateService } from '../../../../../../app/common/services/lc-template.service';
import { SearchLayoutService } from '../../../../../../app/common/services/search-layout.service';
import { SessionValidateService } from '../../../../../../app/common/services/session-validate-service';
import { LeftSectionService } from '../../../../../../app/corporate/common/services/leftSection.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { LcReturnService } from '../../../lc/initiation/services/lc-return.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { DropDownAPIService } from '../../../../../../app/common/services/dropdownAPI.service';
import { ExchangeRateService } from '../../../../../../app/common/services/exchange-rate.service';
import { UserData } from '../../../../../../app/common/model/user-data';
import {
  emptyCurrency,
} from '../../../lc/initiation/validator/ValidateAmt';
import { TfProductComponent } from '../tf-product/tf-product/tf-product.component';
import { FccGlobalConfiguration } from './../../../../../common/core/fcc-global-configuration';
import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { CurrencyConversionRequest } from './../../../../../common/model/currency-conversion-request';
import { CurrencyConversionService } from './../../../../../common/services/currency-conversion.service';
import { PhrasesService } from './../../../../../common/services/phrases.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { TfProductService } from '../../services/tf-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-tf-amount-details',
  templateUrl: './tf-amount-details.component.html',
  styleUrls: ['./tf-amount-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TfAmountDetailsComponent }]
})
export class TfAmountDetailsComponent extends TfProductComponent implements OnInit, AfterViewInit {
  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  rendered: true;
  formSubmitted = false;
  module = `${this.translateService.instant('tfAmountDetails')}`;
  subheader = '';
  confirm = true;
  prev = 'prev';
  next = 'next';
  currencies = [];
  selectedValue = '';
  flagDecimalPlaces;
  currency: SelectItem[] = [];
  xchRequest: ExchangeRateRequest = new ExchangeRateRequest();
  curRequest: CurrencyRequest = new CurrencyRequest();
  OMR = 'OMR';
  BHD = 'BHD';
  TND = 'TND';
  JPY = 'JPY';
  isoamt = '';
  enteredCurMethod = false;
  iso;
  addamtregex;
  params = 'params';
  render = 'rendered';
  twoDecimal = 2;
  threeDecimal = 3;
  subheadTitle = 'subheader-title';
  length2 = FccGlobalConstant.LENGTH_2;
  length3 = FccGlobalConstant.LENGTH_3;
  length4 = FccGlobalConstant.LENGTH_4;
  val;
  radioButtonValue = localStorage.getItem('confInst');
  allLcRecords;
  mandatoryParams = ['currency', 'amount'];
  splitChargeEnabled: any;
  tnxTypeCode: any;
  validateAmt = false;
  validatorPattern = FccGlobalConstant.AMOUNT_VALIDATION;
  cal = '';
  mode: any;
  phrasesResponse: any;
  amountVal: any;
  exportFinanceDefaultCurrency: any;
  importFinanceDefaultCurrency: any;
  ccRequest: CurrencyConversionRequest = new CurrencyConversionRequest();
  warning = 'warning';
  notionalAmount;
  language = localStorage.getItem('language');
  requestType: any;
  standalone = '03';
  private readonly VALUE = 'value';
  exchangeRates = [];
  originalRateResponse: any;
  five = 5;
  selectedRequestVal: any;
  xchRate: any;
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;
  enteredCharCount = 'enteredCharCount';

  @ HostListener('keyup') onKeyUp() {
    this.onClickAdditionalDetails();
  }

  @ HostListener('focus') onFocus() {
    this.onClickAdditionalDetails();
  }

  constructor(protected commonService: CommonService, protected sessionValidation: SessionValidateService,
    protected translateService: TranslateService, protected router: Router,
    protected leftSectionService: LeftSectionService,
    protected dropdownAPIService: DropDownAPIService,
    protected xch: ExchangeRateService,
    protected lcReturnService: LcReturnService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected utilityService: UtilityService, protected prevNextService: PrevNextService,
    protected saveDraftService: SaveDraftService, protected stateService: ProductStateService,
    protected elementRef: ElementRef, protected lcTemplateService: LcTemplateService,
    protected formModelService: FormModelService, protected formControlService: FormControlService,
    protected emitterService: EventEmitterService, protected searchLayoutService: SearchLayoutService,
    protected phrasesService: PhrasesService, protected currencyConversionService: CurrencyConversionService,
    protected fccGlobalConfiguration: FccGlobalConfiguration, protected fccGlobalConstantService: FccGlobalConstantService,
    protected confirmationService: ConfirmationService, protected resolverService: ResolverService,
    protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
    protected tfProductService: TfProductService) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, tfProductService);
  }

  getCurrencyDetail() {
    const requestVal = this.stateService.getSectionData('tfGeneralDetails').get('typeOfProduct').value;
    const requestValArray = [FccGlobalConstant.FROM_EXPORT_LC, FccGlobalConstant.FROM_IMPORT_COLLECTION,
    FccGlobalConstant.FROM_EXPORT_COLLECTION, FccGlobalConstant.FROM_IMPORT_LC, FccGlobalConstant.FROM_GENERAL_SCRATCH,
      'IMPORT_DRAFT', 'EXPORT_DRAFT'];
    if (requestVal && (requestValArray.includes(requestVal))) {
      if (this.form.get('currency')[FccGlobalConstant.OPTIONS].length === 0) {
        this.commonService.userCurrencies(this.curRequest).subscribe(
          response => {
            if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
              this.sessionValidation.IsSessionValid();
            } else {
              response.items.forEach(
                value => {
                  const ccy: { label: string, value: any } = {
                    label: value.isoCode,
                    value: {
                      label: value.isoCode,
                      iso: `${value.isoCode} - ${this.toTitleCase(value.name)}`,
                      country: value.principalCountryCode,
                      currencyCode: value.isoCode,
                      shortName: value.isoCode,
                      name: value.name
                    }
                  };
                  this.currency.push(ccy);
                });
                this.form.get('currency')[this.params][FccGlobalConstant.REQUIRED] = true;
                this.form.get('currency')[this.params][FccGlobalConstant.RENDERED] = true;
                const curr = this.form.get('currency') !== null ? this.form.get('currency').value : null;
                if (!(this.commonService.isNonEmptyValue(curr) && curr !== '' && curr !== ' ')) {
                  if ((requestVal === FccGlobalConstant.FROM_EXPORT_LC || requestVal ===
                    FccGlobalConstant.FROM_EXPORT_COLLECTION) && this.exportFinanceDefaultCurrency) {
                    this.exportFinanceDefaultCurrency ===
                    FccGlobalConstant.USER_CURRENCY
                      ? this.form.get("currency").setValue(response.baseCurrency)
                      : this.form
                          .get("currency")
                          .setValue(this.form.get("billamtcurCode").value);

                  } else if((requestVal === FccGlobalConstant.FROM_IMPORT_LC || requestVal ===
                    FccGlobalConstant.FROM_IMPORT_COLLECTION) && this.importFinanceDefaultCurrency) {
                    this.importFinanceDefaultCurrency ===
                    FccGlobalConstant.BILL_CURRENCY
                      ? this.form.get("currency").setValue(this.form.get("billamtcurCode").value)
                      : this.form
                          .get("currency")
                          .setValue(response.baseCurrency);
                  }
                }

                this.selectedRequestVal = requestVal;
                const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, 'currency', this.form);
                if (valObj) {
                  this.form.get('currency').patchValue(valObj[this.VALUE]);
                }
              this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
              this.updateCurrencyValue();
            }
          });
      } else {
        this.commonService.userCurrencies(this.curRequest).subscribe(
          response => {
            if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
              this.sessionValidation.IsSessionValid();
            } else {
              response.items.forEach(
                value => {
                  const ccy: { label: string, value: any } = {
                    label: value.isoCode,
                    value: {
                      label: value.isoCode,
                      iso: `${value.isoCode} - ${this.toTitleCase(value.name)}`,
                      country: value.principalCountryCode,
                      currencyCode: value.isoCode,
                      shortName: value.isoCode,
                      name: value.name
                    }
                  };
                  this.currency.push(ccy);
                });
              if (this.commonService.getLcResponse !== null && this.currency.length !== 0) {
                const checkCurr = this.form.get('currency').value;
                if (checkCurr === undefined || checkCurr === null || checkCurr === '') {
                  this.commonService.TFRequestType.subscribe((res: any) => {
                    if (res === 'standalone') {
                      return null;
                    }
                    else {
                      const bill: string = this.commonService.getTfBillAmount();
                      if (bill !== '' && bill !== null && bill !== undefined) {
                        const curr = bill.split(' ')[0];
                        const currency = this.currency.find(item => item.label === curr);
                        this.form.get('currency').setValue({
                          label: currency.value.label,
                          iso: currency.value.iso,
                          country: currency.value.country,
                          currencyCode: currency.value.label,
                          shortName: currency.value.label,
                          name: currency.value.name
                        });
                      }
                    }
                  });
                  this.notionalAmount = 0;
                  this.form.get('currency')[this.params][this.warning] = '';
                  this.onBlurAmount();
                } else {
                  this.updateCurrencyValue();
                }
              }
            }
          });
      }
    }
  }



  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  initiationofdata() {
    this.flagDecimalPlaces = -1;
    this.iso = '';
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.iso = this.commonService.masterDataMap.get('currency');
    }
  }

  ngOnInit() {
    super.ngOnInit();
    window.scroll(0, 0);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.xchRequest.userData = new UserData();
    this.xchRequest.userData.userSelectedLanguage = 'en';
    this.curRequest.userData = this.xchRequest.userData;
    this.initializeFormGroup();
    this.initiationofdata();
    const sectionName = 'tfGeneralDetails';
    this.requestType = this.stateService.getSectionData(sectionName);
    this.requestType = this.requestType.controls.requestOptionsTF.value;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.addamtregex = response.swiftXCharacterSet;
        this.exportFinanceDefaultCurrency = response.exportFinanceDefaultCurrency;
        this.importFinanceDefaultCurrency = response.importFinanceDefaultCurrency;
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
         // this.form.addFCCValidators('addAmtTextArea', Validators.pattern(this.addamtregex), 0);
      }
    });
    this.getCurrencyDetail();
    if (this.mode !== FccGlobalConstant.DRAFT_OPTION &&
      this.commonService.getTfBillAmount() !== null && this.commonService.getTfBillAmount() !== undefined) {
      const billCurrency = this.commonService.getTfBillAmount().split(' ')[0];
      const billAmt = this.commonService.getTfBillAmount().split(' ')[this.commonService.getTfBillAmount().split(' ').length-1];
      this.patchFieldParameters(this.form.get('billAmountValue'), { label: this.commonService.getTfBillAmount() });
      this.form.get('billAmountValue').setValue(this.commonService.getTfBillAmount().toString());
      this.patchFieldValueAndParameters(this.form.get('billamt'), billAmt, {});
      this.patchFieldValueAndParameters(this.form.get('billamtcurCode'), billCurrency, {});
      this.form.get(FccGlobalConstant.TF_BILL_CURRENCY).setValue(billCurrency);
    }
    else if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.commonService.getTfBillAmount() !== null &&
      this.commonService.getTfBillAmount() !== undefined) {
      const billCurrency = this.commonService.getTfBillAmount().split(' ')[0];
      const billAmt = this.commonService.getTfBillAmount().split(' ')[this.commonService.getTfBillAmount().split(' ').length-1];
      const billamountvalue = billCurrency + ' ' + billAmt;
      this.patchFieldParameters(this.form.get('billAmountValue'), { label: billamountvalue });
      this.form.get('billAmountValue').setValue(billamountvalue);
      this.patchFieldValueAndParameters(this.form.get('billamt'), billAmt, {});
      this.patchFieldValueAndParameters(this.form.get('billamtcurCode'), billCurrency, {});
      this.form.get(FccGlobalConstant.TF_BILL_CURRENCY).setValue(billCurrency);
    }
    const amount = this.form.get('amount').value;
    if (amount !== undefined && amount !== null && amount !== '') {
      this.onBlurAmount();
    }
     this.form.updateValueAndValidity();
    this.form.get(FccGlobalConstant.TF_BILL_CURRENCY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccGlobalConstant.TF_BILL_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;

    if (this.requestType === this.standalone) {
      this.form.get('billAmountLabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('billAmountValue')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('availableAmountLabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('requestedPercentValue')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    } else {
      if(this.commonService.checkForBillsTnx) {
        this.form.get('billAmountLabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('availableAmountLabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      } else {
        this.form.get('billAmountLabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('availableAmountLabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }

      this.form.get('billAmountValue')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.addFCCValidators('requestedPercentValue',
        Validators.compose([Validators.pattern(FccGlobalConstant.percentageforAmount)]), 0);
    }

    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get('requestedFinancingAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('additionalDetailsLabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('additionalDetails')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
    this.updateNarrativeCount();

    if (this.mode === FccGlobalConstant.DRAFT_OPTION){
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }

  }
  updateNarrativeCount() {
    if (this.form.get('additionalDetails').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('additionalDetails').value);
      this.form.get('additionalDetails')[this.params][this.enteredCharCount] = count;
    }
  }

  ngAfterViewInit() {
    const amountValue = this.form.get('amount').value;
    if (amountValue !== undefined && amountValue !== null && amountValue !== '') {
      this.onBlurAmount();
    }
    this.onClickAdditionalDetails();
  }
  ngOnDestroy() {
    if(!this.commonService.isNonEmptyValue(this.form.get('amount').value)){
      this.form.get('amount').setValidators([Validators.required]);
                    this.form.get('amount').setErrors({ required: true });
                    this.form.get('amount').markAsDirty();
                    this.form.get('amount').markAsTouched();
                    return;
      }
    if(this.nonNumericCurrencyValidator){
      this.form.get('amount').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, 'amount', this.form.get('amount').value,
      this.form.get('currency').value.shortName,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.requestType !== this.standalone) {
      this.form.get(FccGlobalConstant.TF_BILL_CURRENCY)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.TF_BILL_AMOUNT).setValue(this.form.get('billamt').value);
      this.form.get(FccGlobalConstant.TF_BILL_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
    this.stateService.setStateSection('tfAmountDetails', this.form);
  }

  /*on click of previous button*/
  onClickPrevious() {
    this.saveFormObject();
    if (!CommonService.isTemplateCreation) {
      this.saveDraftService.changeSaveStatus('tfAmountDetails',
        this.stateService.getSectionData('tfAmountDetails'));
    }
  }
  /*on click of next button */
  onClickNext() {

    this.saveFormObject();
    if (!CommonService.isTemplateCreation) {
      this.saveDraftService.changeSaveStatus('tfAmountDetails',
        this.stateService.getSectionData('tfAmountDetails'));
    }
  }

  saveFormObject() {
    if (this.utilityService.getMasterValue('mode') === 'draft') {
      this.utilityService.putMasterdata('currency', this.form.get('currency').value.label);
    }
    this.stateService.setStateSection('tfAmountDetails', this.form);
  }

  removeMandatory(fields: any) {
    if (CommonService.isTemplateCreation) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  /*validation on change of currency field*/
  onClickCurrency(event) {
    if (event.value !== undefined) {
      this.enteredCurMethod = true;
      this.iso = event.value.currencyCode;
      this.isoamt = this.iso;
      const amt = this.form.get('amount');
      this.val = amt.value;
      amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      this.setMandatoryField(this.form, 'amount', true);

      if(this.nonNumericCurrencyValidator){
        this.form.get('amount').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, 'amount', amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
          return;
        }
      }
      this.flagDecimalPlaces = 0;
      if(this.nonNumericCurrencyValidator){
        this.form.get('amount').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, 'amount', amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
          return;
        }
      }
      // this.setNotionalAmount();
      this.getExchangeRates();
      if (this.commonService.isnonEMptyString(this.val)) {
        let valueupdated = this.commonService.replaceCurrency(this.val);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
        amt.setValue(valueupdated);
        this.calculateAmount();
        this.patchFieldValueAndParameters(this.form.get('finAmount'), amt.value, {});
        this.patchFieldValueAndParameters(this.form.get('finCurCode'), this.form.get('currency').value.shortName, {});
        this.patchFieldValueAndParameters(this.form.get('tnxAmount'), amt.value, {});
        this.patchFieldValueAndParameters(this.form.get('tnxCurCode'), this.form.get('currency').value.shortName, {});
      } else {
        amt.setErrors({ required: true });
      }
      amt.updateValueAndValidity();
      this.removeMandatory(['amount']);
    }
  }

  onClickAdditionalDetails() {
    this.updateNarrativeCount();
    const enteredCharCount = this.form.get('additionalDetails')[this.params][FccGlobalConstant.ENTERED_CRAR_COUNT];
    const allowedCharCount = this.form.get('additionalDetails')[this.params][FccGlobalConstant.ALLOWED_CRAR_COUNT];

    if (enteredCharCount > allowedCharCount) {
      this.form.get('additionalDetails').setErrors({ maxlength: { actualLength: enteredCharCount, requiredLength: allowedCharCount } });
    }
  }

  onChangeRequestedPercentValue() {
    this.form.addFCCValidators('requestedPercentValue', Validators.compose([Validators.pattern(FccGlobalConstant.percentageforAmount)]), 0);
    const currcode = this.form.get('currency').value.currencyCode;
    if (currcode !== '') {
      let exAmt: string;
      if (this.commonService.getTfBillAmount()) {
        exAmt = this.commonService.getTfBillAmount().split(' ')[this.commonService.getTfBillAmount().split(' ').length-1];
      }
      let exchangeCurrency;
      if (this.commonService.getTfBillAmount()) {
        exchangeCurrency = this.commonService.getTfBillAmount().split(' ')[0];
      }
      const exchangeAmt = this.commonService.replaceCurrency(exAmt);
      let percentValue = this.form.get('requestedPercentValue').value;
      percentValue = parseFloat(percentValue);
      if (!isNaN(percentValue)) {
        const requestPercentValue = percentValue.toFixed(FccGlobalConstant.LENGTH_2);
        this.form.get('requestedPercentValue').setValue(requestPercentValue);
        const actualPercentValue = Math.round(percentValue * FccGlobalConstant.LENGTH_100) / FccGlobalConstant.LENGTH_100;

        if (percentValue !== '' && actualPercentValue > FccGlobalConstant.LENGTH_100) {
          this.form.get('requestedPercentValue').setErrors({ percentageExceeded : true });
          return;
        }
        let calculatedAmount: any;
        if (percentValue !== '' && actualPercentValue <= FccGlobalConstant.LENGTH_100 && actualPercentValue >= FccGlobalConstant.LENGTH_0) {
          calculatedAmount = this.calculateAmountFromPercent(percentValue, exchangeAmt);
          if (calculatedAmount > 0) {
            let valueupdated = this.commonService.replaceCurrency(calculatedAmount);
            valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), currcode);
            this.patchFieldValueAndParameters(this.form.get('amount'), valueupdated, { originalValue: valueupdated });
            this.form.get('amount').setValue(valueupdated);
            let amtValue = '';
            amtValue = this.commonService.replaceCurrency(valueupdated);
            this.updateEquivalentAmount(exchangeCurrency, currcode, amtValue);
            const amountValue = this.form.get('amount').value;
            this.patchFieldValueAndParameters(this.form.get('tnxAmount'), amountValue, {});
            this.patchFieldValueAndParameters(this.form.get('tnxCurCode'), this.form.get('currency').value.shortName, {});
            this.form.get('amount').updateValueAndValidity();
          }
        }
      }
    }
  }

  calculateAmountFromPercent(percentValue: any, exchangeAmt: any) {
    let calculatedAmt;
    const percentValueNumber = parseFloat(percentValue);
    if (this.commonService.isEmptyValue(this.notionalAmount) || this.notionalAmount === 0) {
      const amtNumber = parseFloat(exchangeAmt);
      calculatedAmt = Math.abs(percentValueNumber / FccGlobalConstant.LENGTH_100 * amtNumber);
    } else {
      calculatedAmt = Math.abs(percentValueNumber / FccGlobalConstant.LENGTH_100 * this.notionalAmount);
    }


    return calculatedAmt.toString();
  }

  initializeFormGroup() {
    const sectionName = 'tfAmountDetails';
    this.form = this.stateService.getSectionData(sectionName);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
    }
    if (this.mode === 'DRAFT') {
      const amount = this.form.get('amount').value;
      this.patchFieldValueAndParameters(this.form.get('finAmount'), amount, {});
      this.patchFieldValueAndParameters(this.form.get('finCurCode'), this.form.get('currency').value.shortName, {});
      this.patchFieldValueAndParameters(this.form.get('tnxAmount'), amount, {});
      this.patchFieldValueAndParameters(this.form.get('tnxCurCode'), this.form.get('currency').value.shortName, {});
      this.form.updateValueAndValidity();
    }
    this.setAmountLengthValidator('amount');
  }

  updateCurrencyValue() {
    if (this.mode === 'DRAFT' && this.form.get('currency').value !== undefined
      && this.form.get('currency').value !== null && this.form.get('currency').value !== '' &&
      this.currency.length > 0) {
      const exists = this.currency.filter(
        task => task.label === this.form.get('currency').value.shortName);
      if (exists.length > 0) {
        const currency = this.currency.filter(
          task => task.label === this.form.get('currency').value.shortName)[0].value;
        if (currency !== undefined && currency !== null && currency !== '') {
          this.form.get('currency').setValue({
            label: currency.label,
            iso: currency.iso,
            country: currency.country,
            currencyCode: currency.label,
            shortName: currency.label,
            name: currency.name
          });
          // this.setNotionalAmount();
          this.getExchangeRates();
        }
      }
      this.patchFieldParameters(this.form.get('currency'), { readonly: false });
    } else {
      this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
      const amountDetails = this.stateService.getSectionData('tfAmountDetails', undefined, false);
      const currency = amountDetails.get('currency').value;
      if (currency !== undefined && currency !== null && currency !== '') {
        this.form.get('currency').setValue({
          label: currency.label,
          iso: currency.iso,
          country: currency.country,
          currencyCode: currency.label,
          shortName: currency.label,
          name: currency.name
        });
        // this.setNotionalAmount();
        this.getExchangeRates();
      }
    }
  }

  onClickAmount() {
    this.OnClickAmountFieldHandler('amount');
  }

  onFocusAmount() {
    this.OnClickAmountFieldHandler('amount');
  }

  /*validation on change of amount field*/
  onBlurAmount() {
    if(this.nonNumericCurrencyValidator){
      this.form.get('amount').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, 'amount', this.form.get('amount').value,
      this.form.get('currency').value.shortName,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
        return;
      }
    }
    this.setAmountLengthValidator('amount');
    this.checkAmount(FccGlobalConstant.LENGTH_0);
    const flag = 0;
    let amount: number;
    amount = this.form.get('amount').value;

    if (amount && this.stateService.getSectionData('tfAmountDetails').get('tnx_amt')) {
      this.stateService.getSectionData('tfAmountDetails').get('tnx_amt').setValue(amount ?
        amount : '');
    }
    if (this.commonService.isnonEMptyString(this.stateService.getSectionData('tfAmountDetails')
      .get('billCurrency').value) && this.commonService.isnonEMptyString(this.stateService.getSectionData('tfAmountDetails')
        .get('billAmount').value)) {
      const amtValue = this.commonService.replaceCurrency(amount);
      if (this.commonService.isEmptyValue(this.notionalAmount) || this.notionalAmount === 0) {
        this.validateAmount(parseFloat(amtValue), this.stateService.getSectionData('tfAmountDetails')
        .get('billCurrency').value, this.stateService.getSectionData('tfAmountDetails').get('billAmount').
          value.split(',').join(''), flag);
      } else {
        this.calculateAmount();
      }

      if (this.language === FccGlobalConstant.LANGUAGE_FR || this.language === FccGlobalConstant.LANGUAGE_AR)
      {
        amount = parseFloat(this.customCommasInCurrenciesPipe.transform(this.form.get('amount').value,
        this.form.get('currency').value.currencyCode));
      } else {
        amount = parseFloat(this.commonService.replaceCurrency(this.form.get('amount').value));
      }
      this.form.updateValueAndValidity();
    }
  }

  onChangeAmount() {
    if(!this.commonService.isNonEmptyValue(this.form.get('amount').value)){
      this.form.get('amount').setValidators([Validators.required]);
                    this.form.get('amount').setErrors({ required: true });
                    this.form.get('amount').markAsDirty();
                    this.form.get('amount').markAsTouched();
                    return;
      }
    if(this.nonNumericCurrencyValidator){
      this.form.get('amount').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, 'amount',
      this.form.get('amount').value,
      this.form.get('currency').value.shortName,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
        return;
      }
    }
    this.setAmountLengthValidator('amount');
    this.checkAmount(FccGlobalConstant.LENGTH_0);
    const flag = 0;
    const amount = this.form.get('amount').value;
    if (amount && this.stateService.getSectionData('tfAmountDetails').get('tnx_amt')) {
      this.stateService.getSectionData('tfAmountDetails').get('tnx_amt').setValue(amount ?
        amount : '');
    }
    if (this.commonService.isnonEMptyString(this.stateService.getSectionData('tfAmountDetails')
      .get('billCurrency').value) && this.commonService.isnonEMptyString(this.stateService.getSectionData('tfAmountDetails')
        .get('billAmount').value)) {
      const amtValue = this.commonService.replaceCurrency(amount);
      if (this.commonService.isEmptyValue(this.notionalAmount) || this.notionalAmount === 0) {
        this.validateAmount(parseFloat(amtValue), this.stateService.getSectionData('tfAmountDetails')
        .get('billCurrency').value, this.stateService.getSectionData('tfAmountDetails').get('billAmount').
          value.split(',').join(''), flag);
      } else {
        this.calculateAmount();
      }

    this.form.updateValueAndValidity();
    }
  }

  onKeyupAmount() {
    const amount = this.form.get('amount').value;
    if(this.nonNumericCurrencyValidator){
      this.form.get('amount').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, 'amount', amount,
      this.form.get('currency').value.shortName,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (amount && this.stateService.getSectionData('tfAmountDetails').get('tnx_amt')) {
      this.stateService.getSectionData('tfAmountDetails').get('tnx_amt').setValue(amount ?
        amount : '');
    }
    this.form.updateValueAndValidity();
  }

  checkAmount(flag) {
    const amt = this.form.get('amount');
    const currcode = this.form.get('currency')?.value?.currencyCode;
    const amtVal = amt.value;
    if (amtVal === null || amtVal === undefined || amtVal === '') {
      this.form.get('amount').setErrors({ amountNotNull: true });
      this.form.get('requestedPercentValue').setValue('');
      this.form.updateValueAndValidity();
      return;
    } else if (amtVal <= 0) {
      this.form.get('amount').setErrors({ amountCanNotBeZero: true });
      return;
    }
    if (amtVal !== '') {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get('amount').setValidators(emptyCurrency);
      }
      if (currcode !== '') {
        let valueupdated = this.commonService.replaceCurrency(amtVal);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), currcode);
        let bill: string;
        if (this.commonService.getTfBillAmount()) {
          bill = this.commonService.getTfBillAmount().split(' ')[this.commonService.getTfBillAmount().split(' ').length-1];
        }
        let exchangeCurrency;
        if (this.commonService.getTfBillAmount()) {
          exchangeCurrency = this.commonService.getTfBillAmount().split(' ')[0];
        }
        this.form.get('amount').setValue(valueupdated);
        let billAmt = '';
        let amtValue = '';
        billAmt = this.commonService.replaceCurrency(bill);
        amtValue = this.commonService.replaceCurrency(valueupdated);
        if (this.commonService.isEmptyValue(this.notionalAmount) || this.notionalAmount === 0) {
          this.validateAmount(parseFloat(amtValue), currcode, billAmt, flag);
        } else {
          this.calculateAmount();
        }
        this.updateRequestedPercentage(parseFloat(amtValue), billAmt);
        this.updateEquivalentAmount(exchangeCurrency, currcode, amtValue);
        const amount = this.form.get('amount').value;
        this.patchFieldValueAndParameters(this.form.get('finAmount'), amount, {});
        this.patchFieldValueAndParameters(this.form.get('finCurCode'), this.form.get('currency').value.shortName, {});
        this.patchFieldValueAndParameters(this.form.get('tnxAmount'), amount, {});
        this.patchFieldValueAndParameters(this.form.get('tnxCurCode'), this.form.get('currency').value.shortName, {});
      }
    }
  }

  validateAmount(newAmt, newAmtCurrency, oldAmt, flag) {
    if (newAmt > 0) {
      if (this.language === FccGlobalConstant.LANGUAGE_FR)
      {
        newAmt = newAmt.toString().replaceAll(' ', '');
        oldAmt = oldAmt.toString().replaceAll(' ', '');
      }
      if (parseFloat(newAmt) > parseFloat(oldAmt)) {
        if (this.requestType !== this.standalone) {
          this.patchFieldValueAndParameters(this.form.get('requestedPercentValue'), null, {});
          this.form.get('amount').setErrors(
            { requestAmountExceeded: { cur: newAmtCurrency, amt: oldAmt } }
          );
        }
        if (flag === FccGlobalConstant.LENGTH_1) {
          this.form.updateValueAndValidity();
        }
      } else {
        this.form.get('amount').setErrors(null);
      }
    }
  }


  updateRequestedPercentage(newAmt, oldAmt) {
    if (this.requestType !== this.standalone) {
      let requestPercent;
      if (this.commonService.isEmptyValue(this.notionalAmount) || this.notionalAmount === 0) {
         requestPercent = Math.abs((newAmt * FccGlobalConstant.LENGTH_100) / oldAmt);
      } else {
         requestPercent = Math.abs((newAmt * FccGlobalConstant.LENGTH_100) / this.notionalAmount);
      }
      const requestPercentValue = requestPercent.toFixed(FccGlobalConstant.LENGTH_2);
      if (requestPercent !== '' && requestPercent <= FccGlobalConstant.LENGTH_100 && requestPercent >= FccGlobalConstant.LENGTH_0 ) {
        this.form.get("requestedPercentValue").setValue(requestPercentValue);
        this.patchFieldValueAndParameters(
          this.form.get("requestedPercentValue"),
          requestPercentValue,
          { originalValue: requestPercentValue }
        );
        this.form.get('requestedPercentValue').updateValueAndValidity();
      }
    }
  }

  updateEquivalentAmount(exchangeCurrency, currency, amount) {
    if(this.xchRate && exchangeCurrency !== currency) {
      const requestedAmt = parseFloat(amount) / this.xchRate;
      const requestedAmtValue = this.currencyConverterPipe.transform(requestedAmt.toString(), currency);
      this.form.get("requestedPercentValue")[this.params][
        this.warning
      ] = `${this.translateService.instant(
        "tfNotionalMessage1"
      )} ${exchangeCurrency}
      ${this.translateService.instant("=")} ${
        this.xchRate
      } ${currency} ${this.translateService.instant(
        "tfNotionalMessage2"
      )} ${this.translateService.instant(
        "equivalentRequestedAmt"
      )} ${exchangeCurrency}
      ${this.translateService.instant("is")}  ${requestedAmtValue}`;
    } else {
      this.form.get('requestedPercentValue')[this.params][this.warning] = FccGlobalConstant.EMPTY_STRING;
    }
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_TF, key);
  }

  calculateAmount() {
    const currency = this.form.get('currency');
    const amt: string = this.form.get('amount').value;
    const amount = this.commonService.replaceCurrency(amt);
    if(amount > 0) {
      if (this.requestType !== this.standalone) {
        if (parseFloat(amount) > parseFloat(this.notionalAmount)) {
          this.patchFieldValueAndParameters(this.form.get('requestedPercentValue'), null, {});
          const notionalAmountValue = this.currencyConverterPipe.transform(
            this.notionalAmount.toString(),
            this.form.get("currency").value.currencyCode
          );
          this.form.get('amount').setErrors(
            { requestAmountExceeded: { cur: currency.value.shortName, amt: notionalAmountValue } }
          );
        } else {
          this.form.get('amount').setErrors(null);
        }
      }
    }
  }



  getExchangeRates() {
    let exAmt: string;
    let exchangeCurrency;
    if (this.commonService.getTfBillAmount()) {
      const amountSplit = this.commonService.getTfBillAmount().split(" ");
      exchangeCurrency = amountSplit[0];
      exAmt = amountSplit[2];
    }
    const exchangeAmt = this.commonService.replaceCurrency(exAmt);
    const fromCurrency = this.form.get("currency").value.currencyCode;
    this.xchRequest.fromCurrency = fromCurrency;
    this.xchRequest.toCurrency = exchangeCurrency;
    this.xch.getExchangeRate(this.fccGlobalConstantService.getExchangeRateUrl(), this.xchRequest)
      .subscribe((response) => {
        if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else if (response.response === 'REST_API_SUCCESS') {
          const temp = response.exchangeRatesResponseData;
          if (this.commonService.isEmptyValue(temp) || temp.length === 0) {
            this.form.get('currency').setErrors({ exchangeRateNotAvailable: true });
          } else {
            temp.slice(0, this.five).forEach((element) => {
              if (this.selectedRequestVal === FccGlobalConstant.FROM_EXPORT_LC || this.selectedRequestVal === 'EXPORT_DRAFT'
                || this.selectedRequestVal === FccGlobalConstant.FROM_EXPORT_COLLECTION) {
                this.xchRate = element.buyTtRate;
              } else if (this.selectedRequestVal === FccGlobalConstant.FROM_IMPORT_LC || this.selectedRequestVal === 'IMPORT_DRAFT'
              || this.selectedRequestVal === FccGlobalConstant.FROM_IMPORT_COLLECTION) {
                this.xchRate = element.sellTtRate;
              }
            });
          }
          if (this.requestType !== this.standalone) {
            if (this.xchRate) {
              if (exchangeCurrency !== fromCurrency) {
                this.form.get("requestedPercentValue")[this.params][this.warning] = `${this.translateService.instant("tfNotionalMessage1")}
                ${exchangeCurrency} ${this.translateService.instant("=")} ${this.xchRate}${fromCurrency}
                ${this.translateService.instant("tfNotionalMessage2")}`;
              } else {
                this.form.get("requestedPercentValue")[this.params][this.warning] = FccGlobalConstant.EMPTY_STRING;
              }
              this.form.updateValueAndValidity();
              const updatedAmt = exchangeAmt != null ? this.getExchangeAmt(exchangeAmt) : 0;
              let notionalAmountValue = this.commonService.replaceCurrency(updatedAmt.toString());
              notionalAmountValue = this.currencyConverterPipe.transform(notionalAmountValue.toString(), exchangeCurrency);
              notionalAmountValue = this.commonService.replaceCurrency(notionalAmountValue);
              this.notionalAmount = notionalAmountValue != null ? notionalAmountValue : 0;
              const amt: string = this.form.get("amount").value;
              if (amt !== undefined && amt !== "" && amt !== null) {
                let amount = "";
                amount = this.commonService.replaceCurrency(amt);
                if (parseFloat(amount) > parseFloat(this.notionalAmount)) {
                  this.patchFieldValueAndParameters(this.form.get('requestedPercentValue'), null, {});
                  const currency = this.form.get("currency");
                  this.form.get('amount').setErrors(
                    { requestAmountExceeded: { cur: currency.value.shortName, amt: notionalAmountValue } }
                  );
                } else {
                  this.updateRequestedPercentage(parseFloat(amount), exchangeAmt);
                  this.updateEquivalentAmount(exchangeCurrency, fromCurrency, amount);
                  this.form.get("amount").setErrors(null);
                }
              }
            }
          }
        } else {
          this.form.get('currency').setErrors({ exchangeRateNotAvailable: true });
        }
      });
  }

  getExchangeAmt(amt) {
    if (this.xchRate && amt !== undefined && amt !== "" && amt !== null) {
      return amt * this.xchRate;
    }
  }

}
