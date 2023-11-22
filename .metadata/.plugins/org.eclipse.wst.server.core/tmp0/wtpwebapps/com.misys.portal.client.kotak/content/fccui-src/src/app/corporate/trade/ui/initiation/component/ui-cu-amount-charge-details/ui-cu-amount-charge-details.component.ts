import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';

import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CurrencyRequest } from '../../../../../../common/model/currency-request';
import { UserData } from '../../../../../../common/model/user-data';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
import { CommonUtilsService } from '../../../../../../corporate/common/services/common-utils.service';
import { LcConstant } from '../../../../../../corporate/trade/lc/common/model/constant';
import {
  CustomCommasInCurrenciesPipe,
} from '../../../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { ProductStateService } from '../../../../lc/common/services/product-state.service';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiService } from '../../../common/services/ui-service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { CurrencyConverterPipe } from '../../../../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import {
  emptyCurrency,
  zeroAmount,
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';

@Component({
  selector: 'app-ui-cu-amount-charge-details',
  templateUrl: './ui-cu-amount-charge-details.component.html',
  styleUrls: ['./ui-cu-amount-charge-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiCuAmountChargeDetailsComponent }]
})
export class UiCuAmountChargeDetailsComponent extends UiProductComponent implements OnInit {

  form: FCCFormGroup;
  currencies = [];
  currency: SelectItem[] = [];
  curRequest: CurrencyRequest = new CurrencyRequest();
  CU_CURRENCY = 'cuCurCode';
  module = ``;
  formOfUndertaking;
  confirmationInst;
  modeOfTransmission;
  Constant = new LcConstant();
  params = this.Constant.params;
  allowedCharCount = this.Constant.allowedCharCount;
  maxlength = this.Constant.maximumlength;
  maxRowCount = this.Constant.maxRowCount;
  cols = this.Constant.cols;
  cuCurrency;
  enteredCurMethod;
  OMR = 'OMR';
  BHD = 'BHD';
  TND = 'TND';
  JPY = 'JPY';
  swiftZChar;
  flagDecimalPlaces;
  @Input() parentForm: FCCFormGroup;
  @Input() controlName;
  cuSubProdCode;
  confInst;
  mode: any;
  transmissionMode: any;
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected sessionValidatorService: SessionValidateService, protected commonUtilsService: CommonUtilsService,
              protected dropdownAPIService: DropDownAPIService, protected confirmationService: ConfirmationService,
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
    this.transmissionMode =
    this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.initializeFormGroup();
    this.initializeDropdownValues();
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
    this.form.addFCCValidators('cuAmt', Validators.pattern(this.commonService.getRegexBasedOnlanguage()), 0);
    this.form.addFCCValidators('cuTolerancePositivePct', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('cuToleranceNegativePct', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    this.form.addFCCValidators('cuNetExposureAmt', Validators.pattern(this.commonService.getRegexBasedOnlanguage()), 0);
  }
    this.swiftNarrativeValidations();
    this.handleConfirmationCharges();
    this.commonService.formatForm(this.form);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND)
    {
      if (this.commonService.isnonEMptyString(this.form.get('cuCurCode').value)
      && this.commonService.isnonEMptyString(this.form.get('cuAmt').value))
      {
        let Amendamount = "";
        if(this.commonService.isnonEMptyString(this.form.get('cuCurCode').value['shortName']))
        {
          Amendamount =this.form.get('cuCurCode').value['shortName'];
        }
        else{
         Amendamount = this.form.get('cuCurCode').value;
        }
        Amendamount.concat(FccGlobalConstant.BLANK_SPACE_STRING);
        Amendamount.concat(this.form.get('cuAmt').value);
        this.form.get('cuAmendAmount').setValue(Amendamount);
        this.form.get('cuAmendAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('cuCurCode')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('cuAmt')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND &&
      (this.mode === FccGlobalConstant.EXISTING_OPTION)) {
      this.amendRenderedFields();
    }
    this.resetCuAmtFields();
    this.form.updateValueAndValidity();                                                        
    if (this.mode === FccGlobalConstant.DRAFT_OPTION)
      {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();
      }  


  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.form.get(FccGlobalConstant.CU_AMOUNT_LABEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZChar = response.swiftZChar;
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
      }
    });
    this.resetCuAmtFields();
  }

  resetCuAmtFields() {
    this.setAmountLengthValidatorList(['cuNetExposureAmt', 'cuAmt']);
  }

  amendRenderedFields() {
    this.form.get(FccTradeFieldConstants.CU_ISSUANCE_CHARGES_LABEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccTradeFieldConstants.CU_CORR_CHARGES_LABEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.cuSubProdCode = this.uiService.getCuSubProdCode();
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
          this.patchFieldParameters(this.form.get(this.CU_CURRENCY), { options: this.currency });
          this.patchFieldParameters(this.form.get('cuNetExposureCurCode'), { options: this.currency });
        }
        if (this.form.get(this.CU_CURRENCY) &&
        this.form.get(this.CU_CURRENCY).value !== FccGlobalConstant.EMPTY_STRING) {
          const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, this.CU_CURRENCY, this.form);
          if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND && valObj) {
            if (this.form.get(this.CU_CURRENCY)) {
              this.form.get(this.CU_CURRENCY).patchValue(valObj[`value`]);
            }
            if (this.form.get('cuNetExposureCurCode')) {
              this.form.get('cuNetExposureCurCode').patchValue(valObj[`value`]);
            }
          } else if (valObj && valObj[`value`] && valObj[`value`].label) {
            if (this.form.get(this.CU_CURRENCY)) {
              this.form.get(this.CU_CURRENCY).patchValue(valObj[`value`]);
            }
            if (this.form.get('cuNetExposureCurCode')) {
              this.form.get('cuNetExposureCurCode').patchValue(valObj[`value`]);
            }
          }

        }
      });

    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const option = this.uiService.getOption();
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    if ((tnxTypeCode === FccGlobalConstant.N002_NEW &&
      (option === FccGlobalConstant.EXISTING_OPTION
        || option === FccGlobalConstant.TEMPLATE || mode === FccGlobalConstant.DRAFT_OPTION)) ||
        (tnxTypeCode === FccGlobalConstant.N002_AMEND)){
        this.onClickCuConsortium();
        if (this.form.get('cuOpenChrgBorneByCode').value) {
          this.form.get('cuIssuingBankChargesToBeneficiary').patchValue(this.form.get('cuOpenChrgBorneByCode').value);
          if(this.stateService.getSectionData('uiCuCounterDetails','BG',true).get("uiCuAmountChargeDetails")
          .get("cuIssuingBankChargesToBeneficiary")){
          this.stateService.getSectionData('uiCuCounterDetails','BG',true).get("uiCuAmountChargeDetails")
          .get("cuIssuingBankChargesToBeneficiary").setValue(this.form.get('cuOpenChrgBorneByCode').value);
          }
        }
        if (this.form.get('cuCorrChrgBorneByCode').value) {
          this.form.get('cuCorrespondentChargesToBeneficiary').patchValue(this.form.get('cuCorrChrgBorneByCode').value);
          if(this.stateService.getSectionData('uiCuCounterDetails','BG',true).get("uiCuAmountChargeDetails")
          .get("cuCorrespondentChargesToBeneficiary")){
            this.stateService.getSectionData('uiCuCounterDetails','BG',true).get("uiCuAmountChargeDetails")
            .get("cuCorrespondentChargesToBeneficiary").setValue(this.form.get('cuCorrChrgBorneByCode').value);
          }
        }
        if (this.form.get('cuConfChrgBorneByCode').value === '02') {
          if (this.form.get('cuConfirmationChargesToBeneficiary')) {
            this.form.get('cuConfirmationChargesToBeneficiary').patchValue('Y');
          }
        } else {
          if (this.form.get('cuConfirmationChargesToBeneficiary')) {
            this.form.get('cuConfirmationChargesToBeneficiary').patchValue('N');
          }
        }
    }

}

  onClickCuConsortium() {
    if (this.form.get('cuConsortium') && this.form.get('cuConsortium').value === 'Y') {
      this.toggleFormFields(true, this.form, ['cuConsortiumDetails', 'netCuExposureLabel', 'cuNetExposureCurCode', 'cuNetExposureAmt']);
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('cuConsortiumDetails', Validators.pattern(this.swiftZChar), 0);
      }
    } else {
        if (this.form && this.form.get('cuConsortiumDetails')) {
          this.toggleFormFields(false, this.form, ['cuConsortiumDetails']);
        }
        if (this.form && this.form.get('netCuExposureLabel')) {
          this.toggleFormFields(false, this.form, ['netCuExposureLabel']);
        }
        if (this.form && this.form.get('cuNetExposureCurCode')) {
          this.toggleFormFields(false, this.form, ['cuNetExposureCurCode']);
        }
        if (this.form && this.form.get('cuNetExposureAmt')) {
          this.toggleFormFields(false, this.form, ['cuNetExposureAmt']);
        }
      // this.toggleFormFields(false, this.form, ['cuConsortiumDetails', 'netCuExposureLabel', 'cuNetExposureCurCode', 'cuNetExposureAmt']);
        this.form.clearValidators();
    }
    this.resetCuAmtFields();
    this.form.updateValueAndValidity();
  }

  onClickCuIssuingBankChargesToBeneficiary() {
    if (this.form.get('cuIssuingBankChargesToBeneficiary') && this.form.get('cuIssuingBankChargesToBeneficiary').value === '02') {
      this.form.get('cuOpenChrgBorneByCode').setValue('02');
    } else {
      this.form.get('cuOpenChrgBorneByCode').setValue('01');
    }
  }

  onClickCuCorrespondentChargesToBeneficiary() {
    if (this.form.get('cuCorrespondentChargesToBeneficiary') && this.form.get('cuCorrespondentChargesToBeneficiary').value === '02') {
      this.form.get('cuCorrChrgBorneByCode').setValue('02');
    } else {
      this.form.get('cuCorrChrgBorneByCode').setValue('01');
    }
  }

  handleConfirmationCharges() {
    this.cuSubProdCode = this.uiService.getCuSubProdCode();
    this.confInst = this.uiService.getConfirmationOptions();
    if (this.cuSubProdCode === FccGlobalConstant.STBY && (this.confInst === '01' || this.confInst === '02')) {
      this.toggleFormFields(true, this.form, ['cuConfirmationChargesLabel', 'cuConfirmationChargesToBeneficiary']);
    } else {
      if (this.form && this.form.get('cuConfirmationChargesLabel')) {
        this.toggleFormFields(false, this.form, ['cuConfirmationChargesLabel']);
      }
      if (this.form && this.form.get('cuConfirmationChargesToBeneficiary')) {
        this.toggleFormFields(false, this.form, ['cuConfirmationChargesToBeneficiary']);
      }
      // this.toggleFormFields(false, this.form, ['cuConfirmationChargesLabel', 'cuConfirmationChargesToBeneficiary']);
    }
  }

  onClickCuConfirmationChargesToBeneficiary() {
    if (this.form.get('cuConfirmationChargesToBeneficiary') && this.form.get('cuConfirmationChargesToBeneficiary').value === 'Y') {
      this.form.get('cuConfChrgBorneByCode').setValue('02');
    } else {
      this.form.get('cuConfChrgBorneByCode').setValue('01');
    }
  }

  swiftNarrativeValidations() {
    this.modeOfTransmission =
    this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    if (this.modeOfTransmission !== FccBusinessConstantsService.SWIFT && this.form.get('cuNarrativeAdditionalAmount')) {
      this.form.get('cuNarrativeAdditionalAmount').clearValidators();
      this.form.get('cuNarrativeAdditionalAmount')[this.params][this.allowedCharCount] = '780';
      this.form.get('cuNarrativeAdditionalAmount')[this.params][this.maxlength] = '780';
      this.form.get('cuNarrativeAdditionalAmount')[this.params][this.maxRowCount] = '12';
      this.form.get('cuNarrativeAdditionalAmount')[this.params][this.cols] = '65';
    } else {
      if (this.form.get('cuNarrativeAdditionalAmount')) {
      this.form.get('cuNarrativeAdditionalAmount')[this.params][this.allowedCharCount] = '780';
      this.form.get('cuNarrativeAdditionalAmount')[this.params][this.maxlength] = '780';
      this.form.get('cuNarrativeAdditionalAmount')[this.params][this.cols] = '65';
      this.form.get('cuNarrativeAdditionalAmount')[this.params][this.maxRowCount] = '12';
      if (this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators('cuNarrativeAdditionalAmount', Validators.pattern(this.swiftZChar), 0);
      }
    }
    }
    this.uiProductService.swift2023Changes();
    if (this.form.get('cuNarrativeAdditionalAmount')) {
      this.form.get('cuNarrativeAdditionalAmount').updateValueAndValidity();
    }
  }

  /*validation on change of currency field*/
onClickCuCurCode(event) {
  if (this.commonService.isnonEMptyString(event.value)) {
    this.enteredCurMethod = true;
    this.cuCurrency = event.value.currency ? event.value.currency : event.value.currencyCode;
    const cuAmt = this.form.get('cuAmt').value;
    this.form.get('cuAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    this.setMandatoryField(this.form, 'cuAmt', true);

    if(this.nonNumericCurrencyValidator){
      this.form.get('cuAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, 'cuAmt', cuAmt, this.cuCurrency, 
      this.currencyDecimalplacesZero, 
      this.currencyDecimalplacesThree)){
        return;
      }
    }
    this.flagDecimalPlaces = FccGlobalConstant.LENGTH_0;
    if(this.nonNumericCurrencyValidator){
      this.form.get('cuAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, 'cuAmt', cuAmt, this.cuCurrency, 
      this.currencyDecimalplacesZero, 
      this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.commonService.isnonEMptyString(cuAmt)) {
      let valueupdated = this.commonService.replaceCurrency(cuAmt);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.cuCurrency);
      this.form.get('cuAmt').setValue(valueupdated);
    }
    this.setAmountLengthValidator('cuAmt');
    this.validateCuAmt();
    this.form.get('cuAmt').updateValueAndValidity();
  }
}

validateCuAmt() {
  if (!this.form.get('cuAmt').value && this.form.get('cuCurCode').value) {
    this.form.addFCCValidators('cuAmt', Validators.required, 1);
    this.setMandatoryField(this.form, 'cuAmt', true);
    this.form.get('cuAmt').setErrors({ Required: true });
    this.form.get('cuAmt').markAsDirty();
    this.form.get('cuAmt').markAsTouched();
  } else {
    this.form.get('cuAmt').clearValidators();
    this.setMandatoryField(this.form, 'cuAmt', false);
  }
  this.form.get('cuAmt').updateValueAndValidity();
  this.form.get('cuCurCode').updateValueAndValidity();
}

onFocusCuAmt() {
  this.OnClickAmountFieldHandler('cuAmt');
}

onKeyupCuAmt() {
  const cuAmt = this.form.get('cuAmt').value;
  if(this.nonNumericCurrencyValidator){
    this.form.get('cuAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if(!this.commonService.isValidAmountValue(this.form, 'cuAmt', cuAmt, this.cuCurrency, 
    this.currencyDecimalplacesZero, 
    this.currencyDecimalplacesThree)){
      return;
    }
  }
}

/*validation on change of amount field*/
onBlurCuAmt() {
  const cuAmt = this.form.get('cuAmt').value;
  if(this.nonNumericCurrencyValidator){
    this.form.get('cuAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if(!this.commonService.isValidAmountValue(this.form, 'cuAmt', cuAmt, this.cuCurrency, 
    this.currencyDecimalplacesZero, this.currencyDecimalplacesThree)){
      return;
    }
  }
  if (this.commonService.isnonEMptyString(cuAmt)) {
    if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
      this.form.get('cuAmt').setValidators(emptyCurrency);
    }
    if (this.commonService.isnonEMptyString(this.cuCurrency)) {
      let valueupdated = this.commonService.replaceCurrency(cuAmt);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.cuCurrency);
      this.form.get('cuAmt').setValue(valueupdated);
      this.form.get('cuAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      this.setMandatoryField(this.form, 'cuAmt', true);
      this.flagDecimalPlaces = FccGlobalConstant.LENGTH_0;
      this.amountValidation();
    }
    this.setAmountLengthValidator('cuAmt');
    this.form.get('cuAmt').updateValueAndValidity();
  }
  this.validateCuCurCode();
  this.validateCuAmt();
}

validateCuCurCode() {
  if (!this.form.get('cuCurCode').value && this.form.get('cuAmt').value) {
    this.form.addFCCValidators('cuCurCode', Validators.required, 1);
    this.setMandatoryField(this.form, 'cuCurCode', true);
    this.form.get('cuCurCode').setErrors({ Required: true });
    this.form.get('cuCurCode').markAsTouched();
  } else {
    this.form.get('cuCurCode').clearValidators();
    this.setMandatoryField(this.form, 'cuCurCode', false);
  }
  this.form.get('cuAmt').updateValueAndValidity();
  this.form.get('cuCurCode').updateValueAndValidity();
}

onBlurCuNetExposureAmt() {
  const cuNetExposureAmt = this.form.get('cuNetExposureAmt').value;
  const cuNetExposureCurCode = this.form.get('cuNetExposureCurCode').value;
  if (cuNetExposureAmt !== '') {
    if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
      this.form.get('cuNetExposureAmt').setValidators(emptyCurrency);
    }
    if (cuNetExposureCurCode !== '') {
      let valueupdated = this.commonService.replaceCurrency(cuNetExposureAmt);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), cuNetExposureCurCode);
      this.form.get('cuNetExposureAmt').setValue(valueupdated);
      this.form.get('cuNetExposureAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    }
    this.resetCuAmtFields();
    this.form.get('cuNetExposureAmt').updateValueAndValidity();
  }
}
amountValidation() {
  const transferAmt = this.form.get('cuAmt').value;
  const transferAmtFloatValue = parseFloat(transferAmt.toString());
  if (transferAmtFloatValue === 0) {
    this.form.get('cuAmt').clearValidators();
    this.form.addFCCValidators('cuAmt',
      Validators.compose([Validators.required, zeroAmount]), 0);
    this.form.get('cuAmt').setErrors({ zeroAmount: true });
    this.form.get('cuAmt').markAsDirty();
    this.form.get('cuAmt').markAsTouched();
    this.form.get('cuAmt').updateValueAndValidity();
  }
}

ngOnDestroy() {
  const cuAmt = this.form.get('cuAmt').value;
  if(this.nonNumericCurrencyValidator &&
    this.commonService.isnonEMptyString(cuAmt)){
    this.form.get('cuAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    if(!this.commonService.isValidAmountValue(this.form, 'cuAmt', cuAmt, this.cuCurrency, 
    this.currencyDecimalplacesZero, 
    this.currencyDecimalplacesThree)){
      return;
    }
  }
  this.form.get(FccGlobalConstant.CU_AMOUNT_LABEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
  if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND)
  {
    if (this.form.get('cuCurCode') &&
    this.form.get('cuAmt') &&
    this.commonService.isnonEMptyString(this.form.get('cuCurCode').value) &&
    this.commonService.isnonEMptyString(this.form.get('cuAmt').value))
    {
       this.form.get('cuCurCode')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
       this.form.get('cuAmt')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
       this.form.get('cuAmendAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
  }
  this.parentForm.controls[this.controlName] = this.form;
}
}
