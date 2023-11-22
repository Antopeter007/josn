import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CurrencyRequest } from '../../../../../../common/model/currency-request';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { FccTradeFieldConstants } from './../../../../common/fcc-trade-field-constants';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import {
  CustomCommasInCurrenciesPipe
} from './../../../../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import {
  emptyCurrency
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateAmt';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { SiProductService } from '../../../services/si-product.service';
import { compareNewAmountToOld } from './../../../../../../corporate/trade/lc/initiation/validator/ValidateLastShipDate';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-si-amount-charge-details',
  templateUrl: './si-amount-charge-details.component.html',
  styleUrls: ['./si-amount-charge-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiAmountChargeDetailsComponent }]
})
export class SiAmountChargeDetailsComponent extends SiProductComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FCCFormGroup;
  flagDecimalPlaces;
  twoDecimal = 2;
  threeDecimal = 3;
  isoamt = '';
  option;
  val;
  currency: SelectItem[] = [];
  curRequest: CurrencyRequest = new CurrencyRequest();
  length2 = FccGlobalConstant.LENGTH_2;
  length3 = FccGlobalConstant.LENGTH_3;
  length4 = FccGlobalConstant.LENGTH_4;
  tnxTypeCode: any;
  enteredCurMethod = false;
  radioButtonValue: any;
  iso;
  swiftZCharRegex: string;
  addamtregex;
  module = `${this.translateService.instant(FccGlobalConstant.SI_AMOUNT_CHARGE)}`;
  mode;
  transmissionMode: any;
  isMasterRequired: any;
  operation: any;
  render = 'rendered';
  amendmentCharges = 'amendmentCharges';
  amendChargesDefault: any;
  params = 'params';
  previewScreen = 'previewScreen';
  amountFieldsToValidate: string[] = ['amount', 'tnxAmt', 'increaseAmount', 'decreaseAmount',
    'newLCAmt', 'lcAvailableAmt', 'chargesToBeneficiaryAmendment',
    'chargesToApplicant', 'chargesToBeneficiary', 'chargesToApplicantOutside',
    'chargesToBeneficiaryOutside', 'chargesToApplicantAmendment', 'chargesToBeneficiaryAmendment',
    'chargesToApplicantConf', 'chargesToBeneficiaryConf',
    'chargesToApplicantAmendment', 'chargesToBeneficiaryAmendment'];
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;
  showAvailableAmount: boolean = false;

  constructor(protected eventEmitterService: EventEmitterService, protected stateService: ProductStateService,
    protected commonService: CommonService, protected translateService: TranslateService,
    protected sessionValidation: SessionValidateService, protected dropdownAPIService: DropDownAPIService,
    protected amendCommonService: AmendCommonService, protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService, protected resolverService: ResolverService,
    protected phrasesService: PhrasesService, protected currencyConverterPipe: CurrencyConverterPipe,
    protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef, protected siProductService: SiProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, siProductService);

  }

  ngOnInit(): void {
    super.ngOnInit();
    window.scroll(0, 0);
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.transmissionMode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    this.initializeFormGroup();
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.getCurrencyDetail();
    }
    this.initiationofdata();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.addamtregex = response.swiftXCharacterSet;
        this.swiftZCharRegex = response.swiftZChar;
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
        this.showAvailableAmount = response.showAvailableAmount;
        this.form.get('addAmtTextArea').clearAsyncValidators();
        if (this.transmissionMode === FccBusinessConstantsService.SWIFT ||
          (this.transmissionMode[0] && this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT)){
            this.commonService.getSwiftVersionValue();
        if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023){
          this.form.addFCCValidators('addAmtTextArea', Validators.pattern(this.swiftZCharRegex), 0);
          this.form.get('addAmtTextArea').updateValueAndValidity();
        }
        else{
          this.form.addFCCValidators('addAmtTextArea', Validators.pattern(this.addamtregex), 0);
          this.form.get('addAmtTextArea').updateValueAndValidity();
        }
        }
        this.siProductService.swift2023Changes(this.form);
        if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
          this.form.markAllAsTouched();
          this.form.updateValueAndValidity();
        }

        this.form.addFCCValidators('percp', Validators.pattern(FccGlobalConstant.numberPattern), 0);
        this.form.addFCCValidators('percm', Validators.pattern(FccGlobalConstant.numberPattern), 0);
        this.form.addFCCValidators('revolvePeriod', Validators.pattern(FccGlobalConstant.numberPattern), 0);
        this.form.addFCCValidators('numberOfTimesToRevolve', Validators.pattern(FccGlobalConstant.numberPattern), 0);
        this.form.addFCCValidators('noticeDays', Validators.pattern(FccGlobalConstant.numberPattern), 0);
      }
    });
    this.renderDependentFeilds();
    const dependentFields = ['revolvePeriod', 'revolveFrequency', 'numberOfTimesToRevolve', 'noticeDays'];
    this.removeMandatory(dependentFields);
    this.onClickIssuingBankCharges();
    this.onClickOutStdCurrency();

    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.removeControl('lcAvailableAmt');
      this.form.removeControl('outstandingAmount');
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value !== null) {
      let orgAmt: number;
      if (this.mode === FccGlobalConstant.DRAFT_OPTION || this.mode === FccGlobalConstant.EXISTING &&
        this.commonService.checkPendingClientBankViewForAmendTnx()) {
        orgAmt = parseFloat(
          this.commonService.replaceCurrency(
            this.stateService.getValue(
              FccGlobalConstant.SI_AMOUNT_CHARGE,
              FccGlobalConstant.AMOUNT_FIELD,
              true
            )
          )
        );

      } else {
        orgAmt = parseFloat(
          this.commonService.replaceCurrency(
            this.stateService.getValue(
              FccGlobalConstant.SI_AMOUNT_CHARGE,
              FccGlobalConstant.AMOUNT_FIELD,
              false
            )
          )
        );

      }
      const changeAmt = parseFloat(this.commonService.replaceCurrency(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value));
      if (!(orgAmt > changeAmt)) {
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(null);
      }
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && 
      (!this.showAvailableAmount || (this.showAvailableAmount && this.form.get('lcAvailableAmt').value === null))) {
      this.form.get('lcAvailableAmt')[this.params][this.render] = false;
    }
    this.removeMandatory(['currency', 'amount']);
    this.updateNarrativeCount();
    this.siProductService.swift2023Changes(this.form);
  }

  updateNarrativeCount() {
    if (this.form.get('addAmtTextArea').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('addAmtTextArea').value);
      this.form.get('addAmtTextArea')[FccGlobalConstant.PARAMS][FccGlobalConstant.ENTERED_CRAR_COUNT] = count;
    }
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.SI_AMOUNT_CHARGE;
    this.form = this.stateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    this.radioButtonValue = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('confirmationOptions').value;
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const fieldValue = this.commonService.handleComputedProductAmtFieldForAmendDraft(this.form, FccTradeFieldConstants.NEW_LC_AMT);
      if (fieldValue && fieldValue !== '') {
        this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.NEW_LC_AMT), fieldValue, {});
      }
    }
    this.commonService.formatForm(this.form);
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.amendChargesDefault = response.amendChargesDefault;
      }
    });
    this.renderDependentFeilds();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
      this.checkTnxAmt();
    }
    this.removeAmendFlagFromField();
    this.checAmountAgainstCurreny();
    this.resetAmountNdChargesFieldsValidation();
  }

  resetAmountNdChargesFieldsValidation() {
    this.setAmountLengthValidatorList(this.amountFieldsToValidate);
  }

  checAmountAgainstCurreny() {
    this.resetAmountNdChargesFieldsValidation();
    if (this.form.get('currency').value !== null && this.form.get('currency').value !== undefined
      && this.form.get('currency').value !== '' && this.form.get('amount').value <= 0) {
      this.form.get('amount').setValue('');
      return;
    }
    if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value) {
      if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value <= 0) {
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
        this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].enable();
        return;
      }
    }
    if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value) {
      if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value <= 0) {
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
        this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].enable();
        return;
      }
    }
    if (this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value) {
      if (this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value <= 0) {
        this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValue('');
        return;
      }
    }
  }

  holdErrors() {
    if(this.nonNumericCurrencyValidator){
      const amt = this.form.get('amount').value;
      if(this.commonService.isNonEmptyValue(amt)){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt, this.iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      const newLCAmt = this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value;
      if(this.commonService.isNonEmptyValue(newLCAmt)){
        this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.NEW_LC_AMT, newLCAmt, this.iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      const increaseAmount = this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value;
      if(this.commonService.isNonEmptyValue(increaseAmount)){
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators(
          [Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.INCREASE_AMOUNT, increaseAmount, this.iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      const decreaseAmount = this.form.get(FccGlobalConstant.DECREASE_AMT).value;
      if(this.commonService.isNonEmptyValue(decreaseAmount)){
        this.form.get(FccGlobalConstant.DECREASE_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.DECREASE_AMT, decreaseAmount, this.iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
    }
    this.resetAmountNdChargesFieldsValidation();
    const curr = this.form.get('currency') !== null ? this.form.get('currency').value : null;
    if (this.commonService.isNonEmptyValue(curr) && curr !== '' && curr !== ' ') {
      if(this.option !== FccGlobalConstant.TEMPLATE){
        this.form.get('amount').setValidators([Validators.required]);
        this.form.get('amount').setErrors({ required: true });
        this.form.get('amount').markAsDirty();
        this.form.get('amount').markAsTouched();
      }
      this.form.get('amount').updateValueAndValidity();
    }
    this.removeMandatory(['amount']);
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.form.get('currency').setErrors(null);
      this.form.get('amount').setErrors(null);
      this.setMandatoryField(this.form, 'currency', false);
      this.setMandatoryField(this.form, 'amount', false);
      this.form.get('amount').clearValidators();
      this.form.get('currency').clearValidators();
      this.form.get('currency').updateValueAndValidity();
      this.form.get('amount').updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  protected renderDependentFeilds() {
    this.radioButtonValue = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('confirmationOptions').value;
    this.toggleradioButtonValue();

    if (this.form.get('confChargeslabel') &&
      this.form.get('confChargeslabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] &&
      (this.radioButtonValue === FccBusinessConstantsService.WITHOUT_03)) {
      this.form.get('confCharges')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('confChargeslabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('chargesToApplicantConf')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('chargesToBeneficiaryConf')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
    if (!(this.form.get('confChargeslabel') &&
      this.form.get('confChargeslabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED]) &&
      (this.radioButtonValue === FccBusinessConstantsService.CONFIRM_01 ||
        this.radioButtonValue === FccBusinessConstantsService.MAYADD_02)) {
      this.form.get('confCharges')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('confChargeslabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
  }
  resettingValidatorsInitialize() {
    this.resettingValidators('revolvePeriod');
    this.resettingValidators('revolveFrequency');
    this.resettingValidators('numberOfTimesToRevolve');
    this.resettingValidators('noticeDays');
  }

  resettingValidators(fieldvalue) {
    this.form.get(fieldvalue).clearValidators();
    this.form.get(fieldvalue).updateValueAndValidity();
  }

  toggleradioButtonValue() {
    if (this.radioButtonValue === FccBusinessConstantsService.CONFIRM_01 ||
      this.radioButtonValue === FccBusinessConstantsService.MAYADD_02) {
      this.form.get('confCharges')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('confChargeslabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
  }

  amendFormFields() {
    this.resetAmountNdChargesFieldsValidation();
    this.form.get('amountChargeAmount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccTradeFieldConstants.ORG_LC_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('amount')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('lcAvailableAmt')[this.params][this.render] = true;
    this.form.get('outstandingAmount')[this.params][this.render] = true;
    this.form.get('currency')[this.params][this.previewScreen] = false;
    this.form.get('amount').clearValidators();
    this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    this.form.get(FccTradeFieldConstants.NEW_LC_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccTradeFieldConstants.NEW_LC_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_LC_AMT), { infoIcon: false });
    }
    this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    this.form.get('newLCAmtCurrency')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('decrAmountCurrency')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('variationInDrawingText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccGlobalConstant.AMENDMENTCHARGESLABEL)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('amendmentCharges')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    let amountValue;
    let currencyValue;
    let orgLcAmt;
    if (this.mode === FccGlobalConstant.DRAFT_OPTION || this.mode === FccGlobalConstant.EXISTING
      && this.commonService.checkPendingClientBankViewForAmendTnx()) {
      amountValue = this.stateService.getValue(FccGlobalConstant.SI_AMOUNT_CHARGE, 'amount', true);
      currencyValue = this.stateService.getValue(FccGlobalConstant.SI_AMOUNT_CHARGE, 'currency', true);
      amountValue = this.currencyConverterPipe.transform(amountValue,currencyValue);
      orgLcAmt = this.stateService.getValue(FccGlobalConstant.SI_AMOUNT_CHARGE, FccTradeFieldConstants.ORG_LC_AMT, false);
    } else {
      amountValue = this.stateService.getValue(FccGlobalConstant.SI_AMOUNT_CHARGE, 'amount', false);
      currencyValue = this.stateService.getValue(FccGlobalConstant.SI_AMOUNT_CHARGE, 'currency', false);
      amountValue = this.currencyConverterPipe.transform(amountValue,currencyValue);
      orgLcAmt = this.stateService.getValue(FccGlobalConstant.SI_AMOUNT_CHARGE, FccTradeFieldConstants.ORG_LC_AMT, false);
    }
    let orglcAmtValue = (this.commonService.isNonEmptyValue(orgLcAmt) &&
      orgLcAmt !== FccGlobalConstant.EMPTY_STRING) ? orgLcAmt : amountValue;
    if (orglcAmtValue.indexOf(FccGlobalConstant.BLANK_SPACE_STRING) === -1) {
      //orglcAmtValue = this.currencyConverterPipe.transform(orglcAmtValue.toString(), currencyValue, res);
      orglcAmtValue = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(orglcAmtValue);
    }
    if (this.operation !== FccGlobalConstant.PREVIEW) {
      const orgAmt = this.stateService.getValue(FccGlobalConstant.SI_AMOUNT_CHARGE, FccGlobalConstant.ORG_AMOUNT_FIELD, true);
      if (orgAmt === null || orgAmt === undefined || orgAmt === FccGlobalConstant.EMPTY_STRING) {
        this.stateService.setValue(FccGlobalConstant.SI_AMOUNT_CHARGE, FccGlobalConstant.ORG_AMOUNT_FIELD,
          orglcAmtValue, true);
      }
    }
    this.patchFieldValueAndParameters(this.form.get(FccTradeFieldConstants.ORG_LC_AMT), orglcAmtValue, '');
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.SI_AMOUNT_CHARGE);
    this.stateService.setValue(FccGlobalConstant.SI_AMOUNT_CHARGE, 'decrAmountCurrency', currencyValue, false);
    this.stateService.setValue(FccGlobalConstant.SI_AMOUNT_CHARGE, 'newLCAmtCurrency', currencyValue, false);
    if (this.form.get(FccTradeFieldConstants.NEW_LC_AMT) && this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value === null) {
      this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValue(amountValue);
    }

    const fields = this.form.get('amendmentCharges')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    fields?.forEach(fieldName => {
      if (typeof fieldName === FccGlobalConstant.OBJECT && fieldName.label === this.amendChargesDefault) {
          this.form.get('amendmentCharges').setValue(fieldName.value);
          this.form.updateValueAndValidity();
      }
     });
    let availableAmt;
    let outstandingAmt;

    availableAmt= this.form.get('lcAvailableAmt').value;
    outstandingAmt= this.form.get('outstandingAmount').value;
    if(this.mode === 'EXISTING' || this.mode == 'DRAFT'){
    if (this.commonService.isnonEMptyString(availableAmt) && availableAmt.indexOf(FccGlobalConstant.BLANK_SPACE_STRING) === -1) {
        availableAmt = this.currencyConverterPipe.transform(availableAmt.toString(), currencyValue);
        availableAmt = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(availableAmt);
        this.form.get('lcAvailableAmt').setValue(availableAmt);
    }
    if (this.commonService.isnonEMptyString(outstandingAmt) && outstandingAmt.indexOf(FccGlobalConstant.BLANK_SPACE_STRING) === -1) {
        outstandingAmt = this.currencyConverterPipe.transform(outstandingAmt.toString(), currencyValue);
        outstandingAmt = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(outstandingAmt);
        this.form.get('outstandingAmount').setValue(outstandingAmt);
    }
  }
  }

  getCurrencyDetail() {
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
            this.patchFieldParameters(this.form.get('currency'), { options: this.currency });
          }
          if (this.form.get('currency').value !== FccGlobalConstant.EMPTY_STRING) {
            const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, 'currency', this.form);
            if (valObj) {
              this.form.get('currency').patchValue(valObj[`value`]);
            }
          }
        });
    }
  }

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  onClickCurrency(event) {
    if (event.value !== undefined) {
      this.enteredCurMethod = true;
      this.iso = event.value.currencyCode;
      this.isoamt = this.iso;
      const amt = this.form.get('amount');
      this.val = amt.value;
      amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(this.nonNumericCurrencyValidator){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      this.setMandatoryField(this.form, 'amount', true);
      this.flagDecimalPlaces = 0;
      if(this.nonNumericCurrencyValidator){
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
          this.currencyDecimalplacesZero,
          this.currencyDecimalplacesThree)){
          return;
        }
      }
      if (this.val !== '' && this.val !== null) {
        if (this.val <= 0 && this.option !== FccGlobalConstant.TEMPLATE) {
          this.form.get('amount').setErrors({ amountCanNotBeZero: true });
          return;
        } else {
          let valueupdated = this.commonService.replaceCurrency(this.val);
          valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
          this.form.get('amount').setValue(valueupdated);
        }
      } else if(this.option !== FccGlobalConstant.TEMPLATE){
        this.form.get('amount').setErrors({ required: true });
      }
      this.form.get('amount').updateValueAndValidity();
      this.removeMandatory(['amount']);
    }
    this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD);
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
  }

  removeMandatory(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  checkTnxAmt() {
    this.resetAmountNdChargesFieldsValidation();
    if (this.form.get('tnxAmt') && this.form.get('amount') && this.form.get('tnxAmt').value && this.form.get('amount').value) {
      const tnxAmtValue = this.form.get('tnxAmt').value;
      const amtVal = this.commonService.replaceCurrency(this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value);
      let orgAmt;
      let currencyValue;
      if (this.mode === FccGlobalConstant.DRAFT_OPTION || this.mode === FccGlobalConstant.EXISTING &&
        this.commonService.checkPendingClientBankViewForAmendTnx()) {
        orgAmt = this.commonService.replaceCurrency(
          this.stateService.getValue(
            FccGlobalConstant.SI_AMOUNT_CHARGE,
            FccGlobalConstant.AMOUNT_FIELD,
            true
          )
        );

        currencyValue = this.stateService.getValue(FccGlobalConstant.SI_AMOUNT_CHARGE, FccGlobalConstant.CURRENCY, true);
      } else {
        orgAmt = this.commonService.replaceCurrency(
          this.stateService
            .getValue(
              FccGlobalConstant.SI_AMOUNT_CHARGE,
              FccGlobalConstant.ORG_AMOUNT_FIELD,
              false
            )
            .replace(/[^0-9.]/g, "")
        );

        currencyValue = this.stateService.getValue(FccGlobalConstant.SI_AMOUNT_CHARGE, 'currency', false);
      }
      const amtValue = parseFloat(amtVal);
      const orgFloatAmt = parseFloat(orgAmt);
      let decreaseDisplayAmt;
      let increaseDisplayAmt;
      if (orgFloatAmt > amtValue) {
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(tnxAmtValue);
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
        this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].disable();
        this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
        if (this.mode === FccGlobalConstant.VIEW_MODE) {
          this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        decreaseDisplayAmt = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(tnxAmtValue);
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { displayedValue: decreaseDisplayAmt });
      } else if (orgFloatAmt < amtValue) {
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue(tnxAmtValue);
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
        this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].disable();
        this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
        if (this.mode === FccGlobalConstant.VIEW_MODE) {
          this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        increaseDisplayAmt = currencyValue.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(tnxAmtValue);
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { displayedValue: increaseDisplayAmt });
      }
    }
  }

  onClickIssuingBankCharges() {
    this.setValidationsForCharges('chargesToApplicant', 'issuingBankCharges');
    this.setValidationsForCharges('chargesToBeneficiary', 'issuingBankCharges');
  }
  onClickOutStdCurrency() {
    this.setValidationsForCharges('chargesToApplicantOutside', 'outStdCurrency');
    this.setValidationsForCharges('chargesToBeneficiaryOutside', 'outStdCurrency');
  }
  onClickConfCharges() {
    this.setValidationsForCharges('chargesToApplicantConf', 'confCharges');
    this.setValidationsForCharges('chargesToBeneficiaryConf', 'confCharges');
  }
  onClickAmendmentCharges() {
    this.setValidationsForCharges('chargesToApplicantAmendment', 'amendmentCharges');
    this.setValidationsForCharges('chargesToBeneficiaryAmendment', 'amendmentCharges');
    if (this.form.get(this.amendmentCharges) && this.form.get(this.amendmentCharges)[this.params][FccGlobalConstant.PREVIOUSCOMPAREVALUE] &&
    this.form.get(this.amendmentCharges).value !==
    this.form.get(this.amendmentCharges)[this.params][FccGlobalConstant.PREVIOUSCOMPAREVALUE]) {
    this.patchFieldParameters(this.form.get(this.amendmentCharges), { infoIcon: false, infolabel: "" });
    }
    if(this.form.get('amendmentCharges') && this.form.get('amendmentCharges').value === '07') {
      this.form.get("amendmentChargesOther")[FccGlobalConstant.PARAMS][this.render] = true;
    }else{
      this.form.get("amendmentChargesOther")[FccGlobalConstant.PARAMS][this.render] = false;
    }
    this.form.get('amendmentCharges')[this.params][FccGlobalConstant.PREVIOUSCOMPAREVALUE] =
    this.form.get('amendmentCharges').value;
    this.form.updateValueAndValidity();
  }

  setValidationsForCharges(formField, chargesType) {
    this.resetAmountNdChargesFieldsValidation();
    if (this.form.get(chargesType).value === '08') {
      this.form.get(`${formField}`)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get(`${formField}`).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      this.form.get(`${formField}`).updateValueAndValidity();
    } else {
      if (this.form.get(`${formField}`)) {
        this.form.get(`${formField}`).clearValidators();
        this.form.get(`${formField}`).updateValueAndValidity();
        this.form.get(`${formField}`)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      }
    }
  }

  settingSharedInDropDown() {
    this.setSharedInDropdown('issuingBankCharges');
    this.setSharedInDropdown('outStdCurrency');
    if (this.radioButtonValue === FccBusinessConstantsService.CONFIRM_01 ||
      this.radioButtonValue === FccBusinessConstantsService.MAYADD_02) {
      this.setSharedInDropdown('confCharges');
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.setSharedInDropdown('amendmentCharges');
    }
  }

  setSharedInDropdown(formField) {
    this.resetAmountNdChargesFieldsValidation();
    let found = false;
    const arr = this.form.get(formField)[`options`];
    for (const ele in arr) {
      if (arr[ele].value === '08') {
        found = true;
        break;
      }
    }
    if (!found) {
      const formField08 = `${formField}_08`;
      this.form.get(formField)[`options`].push({
        label: `${this.translateService.instant(formField08)}`,
        value: '08', valueStyleClass: 'p-col-6 leftwrapper'
      });
    }
  }

  initiationofdata() {
    this.flagDecimalPlaces = -1;
    this.iso = '';
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.iso = this.commonService.masterDataMap.get('currency');
    }
  }

  onFocusAmount() {
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
    this.OnClickAmountFieldHandler(FccGlobalConstant.AMOUNT_FIELD);
  }

  onKeyupAmount() {
    const amt = this.form.get(FccGlobalConstant.AMOUNT_FIELD);
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  onBlurAmount() {
    if (!this.form.get(FccGlobalConstant.AMOUNT_FIELD).value && this.option !== FccGlobalConstant.TEMPLATE) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ required: true });
    }
    if (this.form.get(FccGlobalConstant.AMOUNT_FIELD).value &&
      (this.form.get(FccGlobalConstant.AMOUNT_FIELD).value <= FccGlobalConstant.ZERO)
       && this.option !== FccGlobalConstant.TEMPLATE) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setErrors({ amountCanNotBeZero: true });
    }
    const amt = this.form.get('amount');
    this.iso = this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) &&
      this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode) ?
      this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode : null;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.commonService.getAmountForBackToBack() && parseInt(this.commonService.replaceCurrency(amt.value), 10) >
      parseInt(this.commonService.replaceCurrency(this.commonService.getAmountForBackToBack()), 10)) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([compareNewAmountToOld]);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
    } else if (this.commonService.getAmountForBackToBack()) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
    }
    this.val = amt.value;
    if ((this.val === null || this.val === undefined || this.val === '') && this.option !== FccGlobalConstant.TEMPLATE) {
      this.form.get('amount').setErrors({ amountNotNull: true });
      return;
    }
    if (this.val <= 0 && this.option !== FccGlobalConstant.TEMPLATE) {
      this.form.get('amount').setErrors({ amountCanNotBeZero: true });
      return;
    }
    if (this.val !== '') {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get('amount').setValidators(emptyCurrency);
      }
      if ((this.iso !== '' && this.commonService.isNonEmptyValue(this.iso)) && this.option !== FccGlobalConstant.TEMPLATE) {
        let valueupdated = this.commonService.replaceCurrency(this.val);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
        this.form.get('amount').setErrors({ required: true });
        this.form.get('amount').setValue(valueupdated);
      }
    }
    this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD);
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
  }

  onFocusIncreaseAmount() {
    this.OnClickAmountFieldHandler(FccGlobalConstant.INCREASE_AMT);
  }

  onKeyupIncreaseAmount() {
    const amt = this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT);
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators(
        [Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.INCREASE_AMOUNT, amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  onBlurIncreaseAmount() {
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { infoIcon: false });
    const amt = this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT);
    this.val = amt.value;
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.controls.currency
      && this.form.controls.currency.value) {
      this.iso = this.form.controls.currency.value;
    }
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators(
        [Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.INCREASE_AMOUNT, amt.value, this.iso,
        this.currencyDecimalplacesZero, this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.commonService.isnonEMptyString(this.val)) {
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
      this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].disable();
      this.iso = this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) ?
        this.form.get(FccGlobalConstant.CURRENCY).value : null;
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValidators(emptyCurrency);
      }
      if (this.val <= 0) {
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setErrors({ amountCanNotBeZero: true });
        this.form.get('tnxAmt').setValue('');
        this.form.get('tnxAmt').updateValueAndValidity();
        this.resetNewLCAmount();
        this.form.updateValueAndValidity();
        return;
      }
      if (this.iso !== '' && this.commonService.isNonEmptyValue(this.iso)) {
        amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        const amtValue = this.commonService.replaceCurrency(this.val);
        const orgAmt = this.commonService.replaceCurrency(
          this.stateService.getValue(
            FccGlobalConstant.SI_AMOUNT_CHARGE,
            'amount',
            true
          )
        );

        if (amtValue !== '') {
          const changeAmt = parseFloat(amtValue);
          const orgFloatAmt = parseFloat(orgAmt);
          const valueupdated = this.currencyConverterPipe.transform(amtValue.toString(), this.iso);
          this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue(valueupdated);
          this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).updateValueAndValidity();
          const increaseDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(valueupdated);
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { displayedValue: increaseDisplayAmt });
          this.form.get('tnxAmt').setValue(valueupdated);
          this.form.get('tnxAmt').updateValueAndValidity();
          let totalNewSIAmt = orgFloatAmt + changeAmt;
          totalNewSIAmt = this.currencyConverterPipe.transform(totalNewSIAmt.toString(), this.iso);
          this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValue(totalNewSIAmt);
          const newSIDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(totalNewSIAmt);
          this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_LC_AMT), { displayedValue: newSIDisplayAmt });
          this.newSIAmtValidation(FccTradeFieldConstants.INCREASE_AMOUNT);
        }
      }
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.INCREASE_AMOUNT], true);
    } else {
      this.resetAmendAmount();
      this.resetNewLCAmount();
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.INCREASE_AMOUNT], false);
      this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: false });
    }
    this.setAmountLengthValidator(FccGlobalConstant.INCREASE_AMT);
  }

  onFocusDecreaseAmount() {
    this.OnClickAmountFieldHandler(FccGlobalConstant.DECREASE_AMT);
  }

  onKeyupDecreaseAmount() {
    const amt = this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT);
    this.val = amt.value;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators(
        [Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.DECREASE_AMOUNT, amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  onBlurDecreaseAmount() {
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { infoIcon: false });
    const amt = this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT);
    this.val = amt.value;
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.controls.currency
      && this.form.controls.currency.value) {
      this.iso = this.form.controls.currency.value;
    }
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators(
        [Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.DECREASE_AMOUNT, amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.commonService.isnonEMptyString(this.val)) {
      this.iso = this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) ?
        this.form.get(FccGlobalConstant.CURRENCY).value : null;
      this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
      this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].disable();
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValidators(emptyCurrency);
      }
      if (this.val <= 0) {
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setErrors({ amountCanNotBeZero: true });
        this.form.get('tnxAmt').setValue('');
        this.form.get('tnxAmt').updateValueAndValidity();
        this.resetNewLCAmount();
        this.form.updateValueAndValidity();
        return;
      }
      if (this.iso !== '' && this.commonService.isNonEmptyValue(this.iso)) {
        amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        const amtValue = this.commonService.replaceCurrency(this.val);
        const orgAmt = this.commonService.replaceCurrency(
          this.stateService.getValue(
            FccGlobalConstant.SI_AMOUNT_CHARGE,
            'amount',
            true
          )
        );

        if (amtValue !== '') {
          const changeAmt = parseFloat(amtValue);
          const orgFloatAmt = parseFloat(orgAmt);
          if (orgFloatAmt > changeAmt) {
            const valueupdated = this.currencyConverterPipe.transform(amtValue.toString(), this.iso);
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue(valueupdated);
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).updateValueAndValidity();
            const decreaseDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(valueupdated);
            this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { displayedValue: decreaseDisplayAmt });
            this.form.get('tnxAmt').setValue(valueupdated);
            this.form.get('tnxAmt').updateValueAndValidity();
            let totalNewSIAmt = orgFloatAmt - changeAmt;
            totalNewSIAmt = this.currencyConverterPipe.transform(totalNewSIAmt.toString(), this.iso);
            this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValue(totalNewSIAmt);
            const newSIDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(totalNewSIAmt);
            this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_LC_AMT), { displayedValue: newSIDisplayAmt });
            this.newSIAmtValidation(FccTradeFieldConstants.DECREASE_AMOUNT);
          } else {
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).markAsDirty();
            this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setErrors({ orgLessThanChangeAmt: true });
          }
        }
      }
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.DECREASE_AMOUNT], true);
    } else {
      this.resetAmendAmount();
      this.resetNewLCAmount();
      this.togglePreviewScreen(this.form, [FccTradeFieldConstants.DECREASE_AMOUNT], false);
      this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: false });
    }
    this.setAmountLengthValidator(FccGlobalConstant.DECREASE_AMT);
  }

  onFocusNewLCAmt() {
   // this.OnClickAmountFieldHandler(FccTradeFieldConstants.NEW_LC_AMT);
  }

  onKeyupNewLCAmt() {
    const amt = this.form.get(FccTradeFieldConstants.NEW_LC_AMT);
    this.val = amt.value;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.NEW_LC_AMT, amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  onBlurNewLCAmt() {
    this.setAmountLengthValidator('newLCAmt');
    this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_LC_AMT), { infoIcon: false });
    this.iso = this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.CURRENCY).value) ?
        this.form.get(FccGlobalConstant.CURRENCY).value : null;
    if (!this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value) {
      this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setErrors({ required: true });
    }
    if (this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value &&
      (this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value <= FccGlobalConstant.ZERO)) {
      this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setErrors({ required: true });
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.form.controls.currency
      && this.form.controls.currency.value) {
      this.iso = this.form.controls.currency.value;
    }
    const amt = this.form.get(FccTradeFieldConstants.NEW_LC_AMT);
    this.val = amt.value;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccTradeFieldConstants.NEW_LC_AMT, amt.value, this.iso,
        this.currencyDecimalplacesZero,
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (this.commonService.isnonEMptyString(this.val)) {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValidators(emptyCurrency);
      }
      if (this.val <= 0) {
        this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setErrors({ amountCanNotBeZero: true });
        return;
      }
      const valueupdated = this.currencyConverterPipe.transform(this.val.toString(), this.iso);
      this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValue(valueupdated);
      const newLCDisplayAmt = this.iso.concat(FccGlobalConstant.BLANK_SPACE_STRING).concat(valueupdated);
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_LC_AMT), { displayedValue: newLCDisplayAmt });
      if (this.iso !== '') {
        amt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
        const amtValue = this.commonService.replaceCurrency(this.val);
        const orgAmt = this.commonService.replaceCurrency(
          this.stateService.getValue(
            FccGlobalConstant.SI_AMOUNT_CHARGE,
            FccTradeFieldConstants.ORG_LC_AMT,
            true
          )
        );

        if (amtValue !== '') {
          const changeAmt = parseFloat(amtValue);
          const orgFloatAmt = parseFloat(orgAmt);
          if (orgFloatAmt > changeAmt) {
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
            this.newSIAmtValidation(FccTradeFieldConstants.DECREASE_AMOUNT);
          } else if (orgFloatAmt < changeAmt) {
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
            this.newSIAmtValidation(FccTradeFieldConstants.INCREASE_AMOUNT);
          }
          else {
            this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: false });
          }

        }
      }
    } else {
      this.resetAmendAmount();
      this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValidators([Validators.required]);
    }
    this.setAmountLengthValidator(FccTradeFieldConstants.NEW_LC_AMT);
  }

  resetNewLCAmount() {
    const amountValue = this.stateService.getValue(FccGlobalConstant.SI_AMOUNT_CHARGE, 'amount', true);
    this.setAmountLengthValidator(FccTradeFieldConstants.NEW_LC_AMT);
    this.form.get(FccTradeFieldConstants.NEW_LC_AMT).setValue(amountValue);
  }

  resetAmendAmount() {
    this.resetAmountNdChargesFieldsValidation();
    this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).setValue('');
    this.form.controls[FccTradeFieldConstants.INCREASE_AMOUNT].enable();
    this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).setValue('');
    this.form.controls[FccTradeFieldConstants.DECREASE_AMOUNT].enable();
    this.form.get('tnxAmt').setValue('');
  }

  newSIAmtValidation(formField) {
    if (this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value !== '' && this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value !== null) {
      this.form.get(FccTradeFieldConstants.NEW_LC_AMT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.patchFieldParameters(this.form.get('amountChargeAmount'), { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
      this.patchFieldParameters(this.form.get(`${formField}`), { infoIcon: false });
      this.form.get('amount').setValue(this.form.get('newLCAmt').value);
      this.form.get('amount').updateValueAndValidity();
    }
    this.resetAmountNdChargesFieldsValidation();
  }

  onFocusChargesToApplicant() {
    this.OnClickAmountFieldHandler('chargesToApplicant');
  }
  onFocusChargesToBenificiary() {
    this.OnClickAmountFieldHandler('chargesToBeneficiary');
  }
  onFocusChargesToApplicantOutside() {
    this.OnClickAmountFieldHandler('chargesToApplicantOutside');
  }
  onFocusChargesToBeneficiaryOutside() {
    this.OnClickAmountFieldHandler('chargesToBeneficiaryOutside');
  }
  onFocusChargesToApplicantConf() {
    this.OnClickAmountFieldHandler('chargesToApplicantConf');
  }
  onFocusChargesToBeneficiaryConf() {
    this.OnClickAmountFieldHandler('chargesToBeneficiaryConf');
  }
  onFocusChargesToApplicantAmendment() {
    this.OnClickAmountFieldHandler('chargesToApplicantAmendment');
  }
  onFocusChargesToBeneficiaryAmendment() {
    this.OnClickAmountFieldHandler('chargesToBeneficiaryAmendment');
  }

  onBlurChargesToApplicant() {
    this.calculateChargesAmt('chargesToApplicant');
  }
  onBlurChargesToBeneficiary() {
    this.calculateChargesAmt('chargesToBeneficiary');
  }
  onBlurChargesToApplicantOutside() {
    this.calculateChargesAmt('chargesToApplicantOutside');
  }
  onBlurChargesToBeneficiaryOutside() {
    this.calculateChargesAmt('chargesToBeneficiaryOutside');
  }
  onBlurChargesToApplicantConf() {
    this.calculateChargesAmt('chargesToApplicantConf');
  }
  onBlurChargesToBeneficiaryConf() {
    this.calculateChargesAmt('chargesToBeneficiaryConf');
  }
  onBlurChargesToApplicantAmendment() {
    this.calculateChargesAmt('chargesToApplicantAmendment');
  }
  onBlurChargesToBeneficiaryAmendment() {
    this.calculateChargesAmt('chargesToBeneficiaryAmendment');
  }

  calculateChargesAmt(chargesField) {
    const amt = this.form.get(chargesField);
    if (amt.value !== '') {
      // Amend check is only temporary.
      // Will be updated when the charge split fields validation is changed to percentage
      const curcode = this.form.get('currency').value;
      if (curcode !== '' && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        let valueupdated = this.commonService.replaceCurrency(amt.value);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), curcode);
        this.form.get(chargesField).setValue(valueupdated);
      }
    }
    this.resetAmountNdChargesFieldsValidation();
    this.form.get(chargesField).updateValueAndValidity();
  }

  onClickPhraseIcon(event: any, key: any) {
    const entityControl = this.stateService.getSectionData(FccGlobalConstant.SI_APPLICANT_BENEFICIARY).get('applicantEntity');
    let entityName;
    if (entityControl && entityControl.value && entityControl.value.shortName) {
      entityName = entityControl.value.shortName;
    }
    if (this.commonService.isnonEMptyString(entityName)) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '05', false, entityName);
    } else {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '05', false);
    }
  }

  removeAmendFlagFromField() {
    if (this.form.get(FccTradeFieldConstants.ORG_LC_AMT).value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.ORG_LC_AMT), { amendPersistenceSave: true });
    }
    if (this.form.get(FccTradeFieldConstants.NEW_LC_AMT).value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_LC_AMT), { amendPersistenceSave: true });
    }
    if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT), { amendPersistenceSave: true });
    }
    if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value !== FccGlobalConstant.EMPTY_STRING) {
      this.patchFieldParameters(this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT), { amendPersistenceSave: true });
    }
    this.resetAmountNdChargesFieldsValidation();
  }

  ngAfterViewInit() {
    const amountValue = this.form.get('amount').value;
    if (amountValue != undefined && amountValue != null && amountValue != '') {
      this.onFocusAmount();
      this.onBlurAmount();
    }
  }

  ngOnDestroy() {
    this.holdErrors();
    this.handleSubTnxTypecode(this.form, this.tnxTypeCode, FccGlobalConstant.SI_GENERAL_DETAILS);
    this.stateService.setStateSection(FccGlobalConstant.AMOUNT_CHARGE_DETAILS, this.form, this.isMasterRequired);
    if (this.form && this.form.get(FccGlobalConstant.AMOUNT_FIELD) && this.form.get(FccGlobalConstant.AMOUNT_FIELD).value) {
      const amt = this.commonService.replaceCurrency(this.form.get(FccGlobalConstant.AMOUNT_FIELD).value);
      if (amt <= FccGlobalConstant.ZERO) {
        this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValue(null);
      }
    }
    if ((this.mode === 'EXISTING' || this.mode === 'DRAFT') && this.tnxTypeCode === '03') {
      if (this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value === null ||
        this.form.get(FccTradeFieldConstants.DECREASE_AMOUNT).value === '') {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.DECREASE_AMOUNT], false);
      } else {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.DECREASE_AMOUNT], true);
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.NEW_LC_AMT], true);
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_LC_AMT), { amendPersistenceSave: true });
      }
      if (this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value === null ||
        this.form.get(FccTradeFieldConstants.INCREASE_AMOUNT).value === '') {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.INCREASE_AMOUNT], false);
      } else {
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.INCREASE_AMOUNT], true);
        this.togglePreviewScreen(this.form, [FccTradeFieldConstants.NEW_LC_AMT], true);
        this.patchFieldParameters(this.form.get(FccTradeFieldConstants.NEW_LC_AMT), { amendPersistenceSave: true });
      }
    }
  }
}
