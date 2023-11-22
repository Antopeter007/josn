import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';

import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { CurrencyRequest } from '../../../../../../common/model/currency-request';
import { UserData } from '../../../../../../common/model/user-data';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
import { LcConstant } from '../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import {
  CustomCommasInCurrenciesPipe,
} from '../../../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { CommonUtilsService } from '../../../../../common/services/common-utils.service';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import {
  emptyCurrency,
  zeroAmount,
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { UiService } from '../../../common/services/ui-service';
import { CurrencyConverterPipe } from '../../../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { truncate } from 'lodash';


@Component({
  selector: 'app-ui-amount-charge-details',
  templateUrl: './ui-amount-charge-details.component.html',
  styleUrls: ['./ui-amount-charge-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiAmountChargeDetailsComponent }]
})
export class UiAmountChargeDetailsComponent extends UiProductComponent implements OnInit, AfterViewInit {

  module = ``;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  currencies = [];
  currency: SelectItem[] = [];
  curRequest: CurrencyRequest = new CurrencyRequest();
  BG_CURRENCY = 'bgCurCode';
  modeOfTransmission;
  Constant = new LcConstant();
  params = this.Constant.params;
  rendered = this.Constant.rendered;
  required = 'required';
  allowedCharCount = this.Constant.allowedCharCount;
  maxlength = this.Constant.maximumlength;
  maxRowCount = this.Constant.maxRowCount;
  cols = this.Constant.cols;
  enteredCharCount = 'enteredCharCount';
  formOfUndertaking;
  confirmationInst;
  bgCurrency;
  bgNetExposureCurCode;
  enteredCurMethod;
  OMR = 'OMR';
  BHD = 'BHD';
  TND = 'TND';
  JPY = 'JPY';
  iso;
  flagDecimalPlaces;
  validatorPattern = FccGlobalConstant.AMOUNT_VALIDATION;
  val;
  swiftZChar;
  option: any;
  transmissionMode: any;
  masterBgAmt: any;
  subTnxTypeCode: any;
  previewScreen = 'previewScreen';
  amountFieldsToValidate: string[] = ['increaseAmount', 'decreaseAmount', 'tnxAmt',
                                      'newBGAmt', 'bgNetExposureAmt', 'bgLiabAmtView'];
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected commonUtilsService: CommonUtilsService, protected sessionValidatorService: SessionValidateService,
              protected dropdownAPIService: DropDownAPIService, protected amendCommonService: AmendCommonService,
              protected dialogService: DialogService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected currencyConverterPipe: CurrencyConverterPipe,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef, protected uiService: UiService,
              protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    this.initializeFormGroup();
    this.initializeDropdownValues();
    this.transmissionMode =
    this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    const bgSubProdCode = this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined,
      this.isMasterRequired).controls.bgSubProductCode.value;
    const confInst = this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined,
      this.isMasterRequired).controls.bgConfInstructions.value;
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (bgSubProdCode === FccGlobalConstant.STBY && (confInst === '02' || confInst === '03')) {
      // display confirmation charges.
    }
    this.form.addFCCValidators('bgTolerancePositivePct', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('bgToleranceNegativePct', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('bgNetExposureAmt', Validators.pattern(this.commonService.getRegexBasedOnlanguage()), 0);
    this.swiftNarrativeValidations();
    this.handleConfirmationCharges();
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, 'bgAmt', false);
      this.setMandatoryField(this.form, 'bgCurCode', false);
      this.form.get('bgCurCode').clearValidators();
      this.form.get('bgAmt').clearValidators();
      this.form.get('bgAmt').updateValueAndValidity();
      this.form.get('bgCurCode').updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW){
      this.form.removeControl('bgAvailableAmt');
      this.form.removeControl('liabAmount');
    }
    if((this.mode === FccGlobalConstant.EXISTING || this.mode === FccGlobalConstant.DRAFT_OPTION) &&
    (this.subTnxTypeCode === FccGlobalConstant.AMEND_INC || this.subTnxTypeCode === FccGlobalConstant.AMEND_DEC)){
      this.onBlurNewBGAmt();
    }
  }

  initiationofdata() {
    this.flagDecimalPlaces = -1;
    this.iso = '';
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.iso = this.uiService.getBgCurCode();
    }
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.initiationofdata();
      this.amendFormFields();
      this.checkTnxAmt();
    }
    this.removeAmendFlagFromField();

    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZChar = response.swiftZChar;
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
      }
    });
    this.resetAmountFieldsValidation();
  }

  initializeDropdownValues() {
    this.curRequest.userData = new UserData();
    this.curRequest.userData.userSelectedLanguage = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
    localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
    this.commonService.userCurrencies(this.curRequest).subscribe(
      response => {
        if (response.errorMessage && response.errorMessage === 'SESSION_INVALID') {
          this.sessionValidatorService.IsSessionValid();
        } else {
          response.items.forEach(
            value => {
              const ccy: { label: string, value: any } = {
                label: value.isoCode,
                value: {
                  label: value.isoCode,
                  iso: `${value.isoCode} - ${this.commonUtilsService.toTitleCase(value.name)}`,
                  country: value.principalCountryCode,
                  currencyCode: value.isoCode,
                  shortName: value.isoCode,
                  name: value.name
                }
              };
              this.currency.push(ccy);
            });
          this.patchFieldParameters(this.form.get(this.BG_CURRENCY), { options: this.currency });
          this.patchFieldParameters(this.form.get('bgNetExposureCurCode'), { options: this.currency });
        }
        if (this.form.get(this.BG_CURRENCY).value !== FccGlobalConstant.EMPTY_STRING) {
          const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, this.BG_CURRENCY, this.form);
          if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND && valObj) {
            this.form.get(this.BG_CURRENCY).patchValue(valObj[`value`]);
          } else if (valObj) {
            this.form.get(this.BG_CURRENCY).patchValue(valObj[`value`].label);
          }
        }
      });
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const option = this.uiService.getOption();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if (tnxTypeCode === FccGlobalConstant.N002_NEW &&
      (option === FccGlobalConstant.EXISTING_OPTION
        || option === FccGlobalConstant.TEMPLATE || mode === FccGlobalConstant.DRAFT_OPTION)) {
        this.onClickBgConsortium();
        if (this.form.get('bgOpenChrgBorneByCode').value) {
          this.form.get('issuingBankCharges').patchValue(this.form.get('bgOpenChrgBorneByCode').value);
        }
        if (this.form.get('bgCorrChrgBorneByCode').value) {
          this.form.get('corrCharges').patchValue(this.form.get('bgCorrChrgBorneByCode').value);
        }
        if (this.form.get('bgConfChrgBorneByCode').value === '02') {
          this.form.get('confirmationChargesToBeneficiary').patchValue('Y');
        } else {
          this.form.get('confirmationChargesToBeneficiary').patchValue('N');
        }
    }
    if (mode === FccGlobalConstant.VIEW_MODE) {
        if (this.form.get('bgOpenChrgBorneByCode').value) {
          this.form.get('issuingBankCharges').patchValue(this.form.get('bgOpenChrgBorneByCode').value);
        }
        if (this.form.get('bgCorrChrgBorneByCode').value) {
          this.form.get('corrCharges').patchValue(this.form.get('bgCorrChrgBorneByCode').value);
        }
        if (this.form.get('bgConfChrgBorneByCode').value === '02') {
          this.form.get('confirmationChargesToBeneficiary').patchValue('Y');
        } else {
          this.form.get('confirmationChargesToBeneficiary').patchValue('N');
        }
    }

  }

  resetAmountFieldsValidation() {
    this.setAmountLengthValidatorList(this.amountFieldsToValidate);
  }

  onClickBgConsortium() {
    const bgConsortiumDependentFields : any[] = ['bgConsortiumDetails', 'netExposureLabel', 'bgNetExposureCurCode', 'bgNetExposureAmt'];

    if (this.form.get('bgConsortium') && this.form.get('bgConsortium').value === 'Y') {
      this.toggleFormFields(true, this.form, bgConsortiumDependentFields);
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('bgConsortiumDetails', Validators.pattern(this.swiftZChar), 0);
      }
    } else {
      this.toggleFormFields(false, this.form, bgConsortiumDependentFields);
      this.form.get('bgConsortiumDetails').clearValidators();
      bgConsortiumDependentFields.forEach(aField => {
        this.form.get(aField).reset();
      });
    }
    this.form.updateValueAndValidity();
  }

  onClickIssuingBankCharges() {
    if (this.form.get('issuingBankCharges') && this.form.get('issuingBankCharges').value === '02') {
      this.form.get('bgOpenChrgBorneByCode').setValue('02');
    } else {
      this.form.get('bgOpenChrgBorneByCode').setValue('01');
    }
  }

  onClickCorrCharges() {
    if (this.form.get('corrCharges') && this.form.get('corrCharges').value === '02') {
      this.form.get('bgCorrChrgBorneByCode').setValue('02');
    } else {
      this.form.get('bgCorrChrgBorneByCode').setValue('01');
    }
  }

  swiftNarrativeValidations() {
  this.modeOfTransmission =
  this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
  if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT ||
    (this.modeOfTransmission[0] && this.modeOfTransmission[0].value &&
      this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT)) {
    this.form.addFCCValidators('bgNarrativeAdditionalAmount', Validators.pattern(this.swiftZChar), 0);
    this.form.get('bgNarrativeAdditionalAmount')[this.params][this.allowedCharCount] = '780';
    this.form.get('bgNarrativeAdditionalAmount')[this.params][this.maxlength] = '780';
    this.form.get('bgNarrativeAdditionalAmount')[this.params][this.cols] = '65';
    this.form.get('bgNarrativeAdditionalAmount')[this.params][this.maxRowCount] = '12';
  } else {
    this.form.get('bgNarrativeAdditionalAmount').clearValidators();
    this.form.get('bgNarrativeAdditionalAmount')[this.params][this.allowedCharCount] = '780';
    this.form.get('bgNarrativeAdditionalAmount')[this.params][this.maxlength] = '780';
    this.form.get('bgNarrativeAdditionalAmount')[this.params][this.maxRowCount] = '12';
    this.form.get('bgNarrativeAdditionalAmount')[this.params][this.cols] = '65';
  }
  this.uiProductService.swift2023Changes();
  this.form.get('bgNarrativeAdditionalAmount').updateValueAndValidity();
}

onBlurBgNarrativeAdditionalAmount(){
  if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023) {
    const count = this.commonService.
    counterOfPopulatedData(this.form.get('bgNarrativeAdditionalAmount').value);
   const MaxLength = this.form.get('bgNarrativeAdditionalAmount')[this.params][this.maxlength];
    this.form.get('bgNarrativeAdditionalAmount')[this.params][this.enteredCharCount] = count;
    if ( this.form.get('bgNarrativeAdditionalAmount')[this.params][this.enteredCharCount] >
    MaxLength){
      this.form.addFCCValidators('bgNarrativeAdditionalAmount',Validators.maxLength(MaxLength),0);
     this.form.get('bgNarrativeAdditionalAmount').setErrors({ maxlength:
         { requiredLength: this.form.get('bgNarrativeAdditionalAmount')[this.params][this.maxlength] } });
         this.form.get('bgNarrativeAdditionalAmount').markAsDirty();
         this.form.get('bgNarrativeAdditionalAmount').markAsTouched();
        }
        else
        {
          this.form.get('bgNarrativeAdditionalAmount').setErrors(null);
        }
  }
  else
  {
    this.form.get('bgNarrativeAdditionalAmount').setErrors(null);
  }
}

handleConfirmationCharges() {
  this.formOfUndertaking = this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined,
    this.isMasterRequired).get('bgSubProductCode').value;
  this.confirmationInst = this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined,
    this.isMasterRequired).get('bgConfInstructions').value;
  if (this.formOfUndertaking === FccGlobalConstant.STBY && (this.confirmationInst === '01' || this.confirmationInst === '02')) {
    this.toggleFormFields(true, this.form, ['confirmationChargesLabel', 'confirmationChargesToBeneficiary']);
  } else {
    this.toggleFormFields(false, this.form, ['confirmationChargesLabel', 'confirmationChargesToBeneficiary']);
  }
}

onClickConfirmationChargesToBeneficiary() {
  if (this.form.get('confirmationChargesToBeneficiary') && this.form.get('confirmationChargesToBeneficiary').value === 'Y') {
    this.form.get('bgConfChrgBorneByCode').setValue('02');
  } else {
    this.form.get('bgConfChrgBorneByCode').setValue('01');
  }
}

/*validation on change of currency field*/
onClickBgCurCode(event) {
  if (event.value !== undefined) {
    this.enteredCurMethod = true;
    this.bgCurrency = event.value.currency ? event.value.currency : event.value.currencyCode;
    const bgAmt = this.form.get('bgAmt').value;
    this.flagDecimalPlaces = FccGlobalConstant.LENGTH_0;
    if(this.nonNumericCurrencyValidator){
      this.form.get('bgAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, 'bgAmt', bgAmt, this.bgCurrency,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (bgAmt !== '' && bgAmt !== null) {
      let valueupdated = this.commonService.replaceCurrency(bgAmt);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.bgCurrency);
      this.form.get('bgAmt').setValue(valueupdated);
      this.setAmountLengthValidator(FccGlobalConstant.BG_AMT);
      this.form.get('bgAmt').updateValueAndValidity();
    } else {
      this.form.get('bgAmt').clearValidators();
      this.form.get('bgAmt').updateValueAndValidity();
      if(this.option !== FccGlobalConstant.TEMPLATE){
        this.form.get('bgAmt').setErrors({ required: true });
      }
      this.form.get('bgAmt').markAsDirty();
      this.form.get('bgAmt').markAsTouched();
    }
  }
}

onFocusBgAmt() {
  this.form.get('bgAmt').clearValidators();
  this.OnClickAmountFieldHandler('bgAmt');
}

/*validation on change of amount field*/
onBlurBgAmt() {
  const bgAmt = this.form.get('bgAmt').value;
  if (bgAmt !== '' && bgAmt !== null) {
    if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
      this.form.get('bgAmt').setValidators(emptyCurrency);
    }
    if(this.nonNumericCurrencyValidator){
      this.form.get('bgAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, 'bgAmt', bgAmt, this.bgCurrency,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.bgCurrency !== '' && this.bgCurrency !== undefined) {
      let valueupdated = this.commonService.replaceCurrency(bgAmt);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.bgCurrency);
      this.form.get('bgAmt').setValue(valueupdated);
      this.form.get('bgAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(this.option !== FccGlobalConstant.TEMPLATE) {
        this.setMandatoryField(this.form, 'bgAmt', true);
      }
      this.form.updateValueAndValidity();
      this.flagDecimalPlaces = FccGlobalConstant.LENGTH_0;
      this.amountValidation();
    }
  } else {
    this.form.get('bgAmt').clearValidators();
    this.form.get('bgAmt').updateValueAndValidity();
    if(this.option !== FccGlobalConstant.TEMPLATE){
      this.form.get('bgAmt').setErrors({ required: true });
    }
    this.form.updateValueAndValidity();
  }
}

onKeyupBgNetExposureAmt() {
  const bgNetExposureAmt = this.form.get('bgNetExposureAmt').value;
  this.bgNetExposureCurCode = this.form.get('bgNetExposureCurCode');
  if(this.nonNumericCurrencyValidator){
    this.form.get('bgNetExposureAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if(!this.commonService.isValidAmountValue(this.form, 'bgNetExposureAmt', bgNetExposureAmt, this.bgNetExposureCurCode,
    this.currencyDecimalplacesZero,
    this.currencyDecimalplacesThree)){
      return;
    }
  }
}

onBlurBgNetExposureAmt() {
  const bgNetExposureAmt = this.form.get('bgNetExposureAmt').value;
  this.bgNetExposureCurCode = this.form.get('bgNetExposureCurCode');
  if(this.nonNumericCurrencyValidator){
    this.form.get('bgNetExposureAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if(!this.commonService.isValidAmountValue(this.form, 'bgNetExposureAmt', bgNetExposureAmt, this.bgNetExposureCurCode,
    this.currencyDecimalplacesZero,
    this.currencyDecimalplacesThree)){
      return;
    }
  }
  if (bgNetExposureAmt !== '') {
    if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
      this.form.get('bgNetExposureAmt').setValidators(emptyCurrency);
    }
    if (this.bgNetExposureCurCode !== '') {
      let valueupdated = this.commonService.replaceCurrency(bgNetExposureAmt);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.bgNetExposureCurCode);
      this.form.get('bgNetExposureAmt').setValue(valueupdated);
      this.form.get('bgNetExposureAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    }
    this.form.get('bgNetExposureAmt').updateValueAndValidity();
  }
  this.setAmountLengthValidator('bgNetExposureAmt');
}

amountValidation() {
  const bgAmt = this.form.get('bgAmt').value;
  if(this.nonNumericCurrencyValidator){
    if(this.commonService.isNonEmptyValue(bgAmt)){
      this.form.get('bgAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, 'bgAmt', bgAmt, this.bgCurrency,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
        return;
      }
    }
    const bgNetExposureAmt = this.form.get('bgNetExposureAmt').value;
    if(this.commonService.isNonEmptyValue(bgNetExposureAmt)){
      this.form.get('bgNetExposureAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, 'bgNetExposureAmt', bgNetExposureAmt, this.bgCurrency,
      this.currencyDecimalplacesZero,
      this.currencyDecimalplacesThree)){
        return;
      }
    }
  }
  if (bgAmt !== null && bgAmt !== undefined && bgAmt !== '') {
    const bgAmtFloatValue = parseFloat(bgAmt.toString());
    if (bgAmtFloatValue === 0 && this.option !== FccGlobalConstant.TEMPLATE) {
      this.form.get('bgAmt').clearValidators();
      this.form.addFCCValidators('bgAmt',
        Validators.compose([Validators.required, zeroAmount]), 0);
      this.form.get('bgAmt').setErrors({ zeroAmount: true });
      this.form.get('bgAmt').markAsDirty();
      this.form.get('bgAmt').markAsTouched();
      this.form.get('bgAmt').updateValueAndValidity();
    }
  }
}
amendFormFields() {
  this.form.get('amountChargeAmount')[this.params][this.rendered] = true;
  this.form.get('orgBGAmt')[this.params][this.rendered] = true;
  this.form.get('bgLiabAmtView')[this.params][this.rendered] = false;
  this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT)[this.params][this.rendered] = true;
  this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
  this.form.get('increaseCurrency')[this.params][this.rendered] = true;
  this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT)[this.params][this.rendered] = true;
  this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
  this.form.get('decreaseCurrency')[this.params][this.rendered] = true;
  this.form.get('newBGCurCode')[this.params][this.rendered] = true;
  this.form.get(FccTradeFieldConstants.NEW_BG_AMT)[this.params][this.rendered] = true;
  this.form.get(FccTradeFieldConstants.NEW_BG_AMT)[this.params][this.required] = true;
  const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
  if (this.form.get('bgAvailableAmt')) {
    this.form.get('bgAvailableAmt')[this.params][this.rendered] = true;
  }
  if (this.form.get('liabAmount')) {
    this.form.get('liabAmount')[this.params][this.rendered] = true;
  }
  if (mode === FccGlobalConstant.DRAFT_OPTION)
  {
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_BG_AMT), { infoIcon: false });
  }
  this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
  this.form.get('variationInDrawingText')[this.params][this.rendered] = true;
  let amountValue;
  let currencyValue;
  const orgBgAmt = this.productStateService.getSubControlValue('uiUndertakingDetails', 'uiAmountChargeDetails', 'orgBGAmt', true);
  if (this.commonService.checkPendingClientBankViewForAmendTnx()) {
    amountValue = this.productStateService.getSubControlValue('uiUndertakingDetails', 'uiAmountChargeDetails', 'bgAmt', true);
    currencyValue =
      this.productStateService.getSubControlValue('uiUndertakingDetails', 'uiAmountChargeDetails', 'bgCurCode', true);
  } else {
    amountValue =
    this.productStateService.getSubControlValue('uiUndertakingDetails', 'uiAmountChargeDetails', 'bgAmt' , this.isMasterRequired);
    currencyValue =
      this.productStateService.getSubControlValue('uiUndertakingDetails', 'uiAmountChargeDetails', 'bgCurCode', this.isMasterRequired);
  }
  this.masterBgAmt = amountValue;
  this.form.get('bgLiabAmtView')[this.params][this.rendered] = false;
  let orgbgAmtValue = (this.commonService.isNonEmptyValue(orgBgAmt) &&
  orgBgAmt !== FccGlobalConstant.EMPTY_STRING) ? orgBgAmt : amountValue;
  orgbgAmtValue = this.currencyConverterPipe.transform(orgbgAmtValue.toString(), currencyValue);
  if (orgbgAmtValue.indexOf(FccGlobalConstant.BLANK_SPACE_STRING) === -1 &&
    this.operation !== FccGlobalConstant.PREVIEW && this.operation !== FccGlobalConstant.LIST_INQUIRY) {
    orgbgAmtValue = this.commonService.removeAmountFormatting(orgbgAmtValue);
    orgbgAmtValue = this.commonService.removeAmountFormatting(orgbgAmtValue);
    orgbgAmtValue = this.currencyConverterPipe.transform(orgbgAmtValue.toString(), currencyValue);
    orgbgAmtValue = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(orgbgAmtValue);
  }
  if (this.mode === 'view' || this.operation === FccGlobalConstant.PREVIEW || this.operation === FccGlobalConstant.LIST_INQUIRY) {
    this.form.get('orgBGAmt')[this.params][FccGlobalConstant.PREVIEW_SCREEN] = true;
    this.form.get('orgCurCode')[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
  }
  let availableAmt = this.form.get('bgAvailableAmt').value;
  let outstandingAmt = this.form.get('liabAmount').value;

     if (mode ==='EXISTING' || mode == 'DRAFT')
     {
      if (availableAmt && availableAmt.indexOf(FccGlobalConstant.BLANK_SPACE_STRING) === -1){
      availableAmt = this.currencyConverterPipe.transform(availableAmt.toString(), currencyValue);
      availableAmt = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(availableAmt);
      this.form.get('bgCurDisplay')[this.params][this.rendered] = false;
     }
     if (outstandingAmt && outstandingAmt.indexOf(FccGlobalConstant.BLANK_SPACE_STRING) === -1 ){
      outstandingAmt = this.currencyConverterPipe.transform(outstandingAmt.toString(), currencyValue);
      outstandingAmt = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(outstandingAmt);
      this.form.get('bgCurOutstanding')[this.params][this.rendered] = false;
     }
    }
  this.patchFieldValueAndParameters(this.form.get('liabAmount'), outstandingAmt , '');
  this.patchFieldValueAndParameters(this.form.get('bgAvailableAmt'), availableAmt , '');
  if(this.form.get('bgLiabAmt')){
  this.patchFieldValueAndParameters(this.form.get('bgLiabAmt'), outstandingAmt , '');
  }
  this.patchFieldValueAndParameters(this.form.get('bgLiabAmtView'), orgbgAmtValue , '');
  this.patchFieldValueAndParameters(this.form.get('orgBGAmt'), orgbgAmtValue , '');
  this.patchFieldParameters(this.form.get('orgBGAmt'), { previousValue: orgbgAmtValue });
  this.form.get('bgCurCode').patchValue(currencyValue);
  this.form.get('bgCurCode').updateValueAndValidity();
  if (this.form.get(FccTradeFieldConstants.NEW_BG_AMT) && this.form.get(FccTradeFieldConstants.NEW_BG_AMT).value === null) {
    this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setValue(amountValue);
  }
  this.resetAmountFieldsValidation();
}

removeAmendFlagFromField(){
  if (this.form.get('orgBGAmt').value !== FccGlobalConstant.EMPTY_STRING) {
    this.patchFieldParameters(this.form.get('orgBGAmt'), { amendPersistenceSave: true });
  }
  if (this.form.get(FccTradeFieldConstants.NEW_BG_AMT).value !== FccGlobalConstant.EMPTY_STRING) {
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_BG_AMT), { amendPersistenceSave: true });
  }
  if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value !== FccGlobalConstant.EMPTY_STRING) {
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { amendPersistenceSave: true });
  }
  if (this.form.get('increaseCurrency').value !== FccGlobalConstant.EMPTY_STRING) {
    this.patchFieldParameters(this.form.get('increaseCurrency'), { amendPersistenceSave: true });
  }
  if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value !== FccGlobalConstant.EMPTY_STRING) {
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { amendPersistenceSave: true });
  }
  if (this.form.get('decreaseCurrency').value !== FccGlobalConstant.EMPTY_STRING) {
    this.patchFieldParameters(this.form.get('decreaseCurrency'), { amendPersistenceSave: true });
  }
  if (this.form.get('bgLiabAmtView').value !== FccGlobalConstant.EMPTY_STRING) {
    this.patchFieldParameters(this.form.get('bgLiabAmtView'), { amendPersistenceSave: true });
  }
  this.setAmountLengthValidator('orgBGAmt');
}

onBlurIncreaseAmount() {
  this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { infoIcon: false });
  const amt = this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT);
  this.val = amt.value;
  if (this.commonService.isnonEMptyString(this.val)) {
    this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(null);
    this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].disable();
    if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators(emptyCurrency);
    }
    if (this.val <= 0) {
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setErrors({ amountCanNotBeZero: true });
      this.form.get('tnxAmt').setValue('');
      this.form.get('tnxAmt').updateValueAndValidity();
      this.resetNewBGAmount();
      this.form.updateValueAndValidity();
      return;
    }
    if (this.iso !== '') {
      amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      const amtValue = this.commonService.replaceCurrency(this.val);
      let orgAmt = this.masterBgAmt;
      orgAmt = this.commonService.replaceCurrency(orgAmt);
      if (amtValue !== '') {
        const changeAmt = parseFloat(amtValue);
        const orgFloatAmt = parseFloat(orgAmt);
        let valueupdated = this.commonService.replaceCurrency(this.val);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue(valueupdated);
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).updateValueAndValidity();
        const increaseDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(valueupdated);
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { displayedValue: increaseDisplayAmt });
        this.form.get('tnxAmt').setValue(valueupdated);
        this.form.get('tnxAmt').updateValueAndValidity();
        let totalNewBGAmt = orgFloatAmt + changeAmt;
        totalNewBGAmt = this.currencyConverterPipe.transform(totalNewBGAmt.toString(), this.iso);
        this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setValue(totalNewBGAmt);
        this.form.get('newBGCurCode')[this.params][this.rendered] = true;
        const newBGDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(totalNewBGAmt.toString());
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_BG_AMT), { displayedValue: newBGDisplayAmt });
        this.form.get(FccTradeFieldConstants.NEW_BG_AMT)[this.params][this.rendered] = true;
        this.newBGAmValidation(FccTradeFieldConstants.INCREASE_AMOUNT);
      }
    }
    this.resetAmountFieldsValidation();
  }else{
    this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: false });
    this.resetAmendAmount();
  }
}

onBlurDecreaseAmount() {
  this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { infoIcon: false });
  const amt = this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT);
  this.val = amt.value;
  if (this.commonService.isnonEMptyString(this.val)) {
    this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue(null);
    this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].disable();
    if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators(emptyCurrency);
    }
    if (this.val <= 0) {
      this.form.get(FccGlobalConstant.DECREASE_AMT).setErrors({ amountCanNotBeZero: true });
      this.form.get('tnxAmt').setValue('');
      this.form.get('tnxAmt').updateValueAndValidity();
      this.resetNewBGAmount();
      this.form.updateValueAndValidity();
      return;
    }
    if (this.iso !== '') {
      amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      const amtValue = this.commonService.replaceCurrency(this.val);
      let orgAmt = this.masterBgAmt;
      orgAmt = this.commonService.replaceCurrency(orgAmt);
      if (amtValue !== '') {
        const changeAmt = parseFloat(amtValue);
        const orgFloatAmt = parseFloat(orgAmt);
        if (orgFloatAmt > changeAmt) {
          let valueupdated = this.commonService.replaceCurrency(this.val);
          valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
          this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(valueupdated);
          this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).updateValueAndValidity();
          const decreaseDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(valueupdated);
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { displayedValue: decreaseDisplayAmt });
          this.form.get('tnxAmt').setValue(valueupdated);
          this.form.get('tnxAmt').updateValueAndValidity();
          let totalNewBGAmt = orgFloatAmt - changeAmt;
          totalNewBGAmt = this.currencyConverterPipe.transform(totalNewBGAmt.toString(), this.iso);
          this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setValue(totalNewBGAmt);
          this.form.get('newBGCurCode')[this.params][this.rendered] = true;
          const newBGDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(totalNewBGAmt.toString());
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_BG_AMT), { displayedValue: newBGDisplayAmt });
          this.form.get(FccTradeFieldConstants.NEW_BG_AMT)[this.params][this.rendered] = true;
          this.newBGAmValidation(FccTradeFieldConstants.DECREASE_AMOUNT);
        } else {
          this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).markAsDirty();
          this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setErrors({ orgLessThanChangeAmt: true });
        }
      }
    }
    this.resetAmountFieldsValidation();
  }else{
    this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: false });
    this.resetAmendAmount();
  }
}

onBlurNewBGAmt() {
  this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_BG_AMT), { infoIcon: false });
  if (!this.form.get(FccTradeFieldConstants.NEW_BG_AMT).value) {
    this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setErrors({ required: true });
  }
  if (this.form.get(FccTradeFieldConstants.NEW_BG_AMT).value &&
        (this.form.get(FccTradeFieldConstants.NEW_BG_AMT).value <= FccGlobalConstant.ZERO)) {
      this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setErrors({ amountCanNotBeZero: true });
  }
  const amt = this.form.get(FccTradeFieldConstants.NEW_BG_AMT);
  this.val = amt.value;
  if (this.commonService.isnonEMptyString(this.val)) {
    if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
      this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setValidators(emptyCurrency);
    }
    if (this.val <= 0) {
      this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setErrors({ amountCanNotBeZero: true });
      return;
    }

    let valueupdated = this.commonService.removeAmountFormatting(this.val.toString());

    valueupdated = this.currencyConverterPipe.transform(valueupdated, this.iso);
    this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setValue(valueupdated);
    if (this.iso !== '') {
      const newBGDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(valueupdated);
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_BG_AMT), { displayedValue: newBGDisplayAmt });
      amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      const amtValue = this.commonService.replaceCurrency(this.val);
      let orgAmt = this.masterBgAmt;
      orgAmt = this.commonService.replaceCurrency(orgAmt);
      if (amtValue !== '') {
        const changeAmt = parseFloat(amtValue);
        const orgFloatAmt = parseFloat(orgAmt);
        if (orgFloatAmt === changeAmt){
          this.resetAmendAmount();
          this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: false });
        }else if (orgFloatAmt > changeAmt){
          const decrAmt = orgFloatAmt - changeAmt;
          const updatedDecrAmt = this.currencyConverterPipe.transform(decrAmt.toString(), this.iso);
          this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(updatedDecrAmt);
          this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).updateValueAndValidity();
          this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
          this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].disable();
          this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].enable();
          const decreaseDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(updatedDecrAmt);
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { displayedValue: decreaseDisplayAmt });
          this.form.get('tnxAmt').setValue(updatedDecrAmt);
          this.form.get('tnxAmt').updateValueAndValidity();
          this.newBGAmValidation(FccTradeFieldConstants.DECREASE_AMOUNT);
        }else if (orgFloatAmt < changeAmt){
          const incrAmt = changeAmt - orgFloatAmt;
          const updatedIncrValue = this.currencyConverterPipe.transform(incrAmt.toString(), this.iso);
          this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue(updatedIncrValue);
          this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).updateValueAndValidity();
          this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
          this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].disable();
          this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].enable();
          const increaseDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(updatedIncrValue);
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { displayedValue: increaseDisplayAmt });
          this.form.get('tnxAmt').setValue(updatedIncrValue);
          this.form.get('tnxAmt').updateValueAndValidity();
          this.newBGAmValidation(FccTradeFieldConstants.INCREASE_AMOUNT);
        }
      }
    }
    this.resetAmountFieldsValidation();
  }else{
    this.resetAmendAmount();
    this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setValidators([Validators.required]);
  }
}

resetAmendAmount(){
  this.resetAmountFieldsValidation();
  this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
  this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].enable();
  this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
  this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].enable();
  this.form.get('tnxAmt').setValue('');
  this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setValue(this.masterBgAmt);
  this.form.get('bgAmt').setValue(this.form.get(FccTradeFieldConstants.NEW_BG_AMT).value);
  this.form.get('bgAmt').updateValueAndValidity();
}

resetNewBGAmount()
{
  this.setAmountLengthValidator(FccTradeFieldConstants.NEW_BG_AMT);
  this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setValue(this.masterBgAmt);
}

newBGAmValidation(formField) {
  if (this.form.get(FccTradeFieldConstants.NEW_BG_AMT).value !== '' && this.form.get(FccTradeFieldConstants.NEW_BG_AMT).value !== null) {
    this.form.get(FccTradeFieldConstants.NEW_BG_AMT)[this.params][this.rendered] = true;
    this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
    this.patchFieldParameters(this.form.get(`${formField}`), { infoIcon: false });
    this.form.get('bgAmt').setValue(this.form.get(FccTradeFieldConstants.NEW_BG_AMT).value);
    this.setAmountLengthValidator(FccTradeFieldConstants.NEW_BG_AMT);
    this.form.get('bgAmt').updateValueAndValidity();
  } else {
    this.newBGAmtNullCheck(`${formField}`);
  }

}

newBGAmtNullCheck(formField) {
  this.form.get(FccTradeFieldConstants.NEW_BG_AMT)[this.params][this.rendered] = false;
  this.form.get(FccTradeFieldConstants.NEW_BG_AMT).setValue(null);
  this.form.get('bgAmt').setValue(null);
  this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: false });
  this.patchFieldParameters(this.form.get(`${formField}`), { infoIcon: false });
}


checkTnxAmt() {
   const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
  if (this.form.get('tnxAmt') && this.form.get('bgAmt') && this.form.get('tnxAmt').value && this.form.get('bgAmt').value) {
    const tnxAmtValue = this.form.get('tnxAmt').value;
    const amtVal = this.commonService.replaceCurrency(this.form.get(FccTradeFieldConstants.NEW_BG_AMT).value);
    let orgAmt;
    if (this.commonService.checkPendingClientBankViewForAmendTnx()) {
      orgAmt = this.productStateService.getSubControlValue('uiUndertakingDetails', 'uiAmountChargeDetails', 'orgBGAmt', true);
    } else {
      orgAmt =
      this.productStateService.getSubControlValue('uiUndertakingDetails', 'uiAmountChargeDetails', 'orgBGAmt' , this.isMasterRequired);
    }
    if (mode === FccGlobalConstant.DRAFT_OPTION || mode === FccGlobalConstant.EXISTING ) {
      orgAmt = this.form.get(FccTradeFieldConstants.ORG_BG_AMT).value;
     }
    if (this.commonService.isEmptyValue(orgAmt) && this.tnxTypeCode === "03") {
      orgAmt = this.productStateService.getSubControlValue('uiUndertakingDetails', 'uiAmountChargeDetails', 'orgBGAmt', false);
    }
    const originalAmt = this.commonService.replaceCurrency(orgAmt);
    const amtValue = parseFloat(amtVal);
    const orgFloatAmt = parseFloat(originalAmt);
    if (orgFloatAmt > amtValue) {
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT)[this.params][this.rendered] = true;
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(tnxAmtValue);
      this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].disable();
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
      this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
    } else if (orgFloatAmt < amtValue) {
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT)[this.params][this.rendered] = true;
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue(tnxAmtValue);
      this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].disable();
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
      this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
    } else {
      this.form.get(FccTradeFieldConstants.NEW_BG_AMT)[this.params][this.rendered] = true;
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT)[this.params][this.rendered] = true;
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT)[this.params][this.rendered] = true;
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).enable();
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).enable();
    }
  } else {
    this.form.get(FccTradeFieldConstants.NEW_BG_AMT)[this.params][this.rendered] = true;
    this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT)[this.params][this.rendered] = true;
    this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT)[this.params][this.rendered] = true;
    this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
    this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
    this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).enable();
    this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).enable();
  }
  this.form.get(FccGlobalConstant.BG_AMT).clearValidators();
  this.resetAmountFieldsValidation();
  this.form.updateValueAndValidity();
}

ngAfterViewInit() {
  if (this.form.get('bgAmt') && this.commonService.isnonEMptyString(this.form.get('bgAmt').value)) {
    this.onFocusBgAmt();
    this.onBlurBgAmt();
  }
}

ngOnDestroy() {
  this.amountValidation();
  this.parentForm.controls[this.controlName] = this.form;
  if (this.operation !== FccGlobalConstant.LIST_INQUIRY && this.mode !== FccGlobalConstant.VIEW_MODE) {
    this.handleSubTnxTypecode(this.form, this.tnxTypeCode, FccGlobalConstant.UI_GENERAL_DETAIL);
  }
  this.removeAmendFlagFromField();
}

}

