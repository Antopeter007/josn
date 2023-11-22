import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CounterpartyRequest } from '../../../../../common/model/counterpartyRequest';

import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from '../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConfiguration } from '../../../../../common/core/fcc-global-configuration';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CounterpartyDetailsList } from '../../../../../common/model/counterpartyDetailsList';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { CorporateCommonService } from '../../../../../corporate/common/services/common.service';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import {
  amountCanNotBeZero,
  transferAmtGreaterThanAvailableAmt,
} from '../../../lc/initiation/validator/ValidateAmt';
import { SrProductComponent } from '../../sr-product/sr-product.component';
import { CurrencyConverterPipe } from './../../../lc/initiation/pipes/currency-converter.pipe';
import { SrProductService } from '../../services/sr-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LeftSectionService } from '../../../../../corporate/common/services/leftSection.service';
import { FccTradeFieldConstants } from '../../../common/fcc-trade-field-constants';


@Component({
  selector: 'app-sr-transfer-conditions',
  templateUrl: './sr-transfer-conditions.component.html',
  styleUrls: ['./sr-transfer-conditions.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SrTransferConditionsComponent }]
})
export class SrTransferConditionsComponent extends SrProductComponent implements OnInit , AfterViewInit {
  form: FCCFormGroup;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  readonly = this.lcConstant.readonly;
  required = this.lcConstant.required;
  defaultVal = this.lcConstant.defaultValue;
  productCode: any;
  swiftXCharRegex: string;
  swiftZCharRegex: string;
  module = `${this.translateService.instant('srTransferConditions')}`;
  lcAmount: any;
  currency;
  utilizedAmount;
  responseStatusCode = 200;
  allowedDecimals = -1;
  datePattern = FccGlobalConstant.datePattern;
  beneficiaries = [];
  counterpartyDetailsList: CounterpartyDetailsList;
  transferAmountField = 'transferAmount';
  currencyField = 'currency';
  adviseThroughBankResponse: any;
  setFieldsToBlank: any[];
  setTransferAmtNull: boolean;
  mode;
  addressRegex: any;
  nameLength: any;
  nameRegex: any;
  swifCodeRegex: any;
  address1TradeLength;
  address2TradeLength;
  domTradeLength;
  address4TradeLength;
  beneAbbvNameRegex;
  maxlength = this.lcConstant.maximumlength;
  transmissionMode: any;
  syBeneAdd: any;
  beneAbbvName: any;
  beneEditToggleVisible = false;
  benePreviousValue: any;
  abbvNameList = [];
  entityAddressType: any;
  entityNameList = [];
  saveTogglePreviousValue: any;
  beneAbbvPreviousValue: any;
  leftSectionEnabled;

  constructor(
    protected eventEmitterService: EventEmitterService,
    protected stateService: ProductStateService,
    protected formModelService: FormModelService,
    protected commonService: CommonService,
    protected formControlService: FormControlService,
    protected fccGlobalConfiguration: FccGlobalConfiguration,
    protected translateService: TranslateService,
    protected corporateCommonService: CorporateCommonService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected fileList: FilelistService,
    protected dialogRef: DynamicDialogRef, protected currencyConverterPipe: CurrencyConverterPipe,
    protected srProductService: SrProductService, protected leftSectionService: LeftSectionService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, srProductService);
  }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.transmissionMode = this.commonService.isNonEmptyValue(this.stateService.getSectionData('srGeneralDetails').
    get('transmissionMode')) ? this.stateService.getSectionData(FccGlobalConstant.GENERAL_DETAILS).get('transmissionMode') : '';
    // this.checkBeneSaveAllowed();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.leftSectionEnabled = response.showStepper === 'true';
        this.swifCodeRegex = response.bigSwiftCode;
        this.nameRegex = response.BeneficiaryNameRegex;
        this.addressRegex = response.BeneficiaryAddressRegex;
        this.nameLength = response.BeneficiaryNameLength;
        this.swifCodeRegex = response.bigSwiftCode;
        this.address1TradeLength = response.address1TradeLength;
        this.address2TradeLength = response.address2TradeLength;
        this.domTradeLength = response.domTradeLength;
        this.address4TradeLength = response.address4TradeLength;
        this.beneAbbvNameRegex = response.BeneficiaryAbbvNameRegex;
        this.onClickAdviseThru();


        this.clearingFormValidators(['adviseThruSwiftCode', 'secondBeneficiaryName', 'secondBeneficiaryFirstAddress',
         'secondBeneficiarySecondAddress', 'secondBeneficiaryThirdAddress', 'secondBeneficiaryFourthAddress']);
        if (this.transmissionMode === FccBusinessConstantsService.SWIFT){
          this.form.addFCCValidators('adviseThruSwiftCode', Validators.pattern(this.swifCodeRegex), 0);
          this.form.addFCCValidators('secondBeneficiaryName', Validators.pattern(this.nameRegex), 0);
          this.form.addFCCValidators('secondBeneficiaryFirstAddress', Validators.pattern(this.addressRegex), 0);
          this.form.addFCCValidators('secondBeneficiarySecondAddress', Validators.pattern(this.addressRegex), 0);
          this.form.addFCCValidators('secondBeneficiaryThirdAddress', Validators.pattern(this.addressRegex), 0);
          this.form.addFCCValidators('secondBeneficiaryFourthAddress', Validators.pattern(this.addressRegex), 0);
        }


        this.form.addFCCValidators('secondBeneficiaryName', Validators.compose([Validators.maxLength(this.nameLength)]), 1);
        this.form.get('secondBeneficiaryName')[this.params][this.maxlength] = this.nameLength;
        this.form.get('secondBeneficiaryName').updateValueAndValidity();
        this.form.addFCCValidators('secondBeneficiaryFirstAddress', Validators.compose([Validators.required,
            Validators.maxLength(this.address1TradeLength)]), 1);
        this.form.get('secondBeneficiaryFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('secondBeneficiaryFirstAddress').updateValueAndValidity();
        this.form.addFCCValidators("secondBeneficiarySecondAddress",Validators.compose([
          Validators.maxLength(this.address2TradeLength)]),1);
        this.form.get('secondBeneficiarySecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('secondBeneficiarySecondAddress').updateValueAndValidity();
        this.form.addFCCValidators('secondBeneficiaryThirdAddress', Validators.compose([Validators.maxLength(this.domTradeLength)]), 1);
        this.form.get('secondBeneficiaryThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        this.form.get('secondBeneficiaryThirdAddress').updateValueAndValidity();
        this.form.addFCCValidators(
          "secondBeneficiaryFourthAddress",
          Validators.compose([Validators.maxLength(this.address4TradeLength)]),
          1
        );
        this.form.get('secondBeneficiaryFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
        this.form.get('secondBeneficiaryFourthAddress').updateValueAndValidity();
      }
    });
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.lcAmount = this.stateService.getValue(FccGlobalConstant.SR_TRANSFER_CONDITIONS, 'lcAmount', false);
    this.currency = this.stateService.getValue(FccGlobalConstant.SR_TRANSFER_CONDITIONS, 'currency', false);
    this.lcAmount = this.commonService.replaceCurrency(this.lcAmount);
    if (this.commonService.isNonEmptyValue(this.form.get('utilizedAmount').value) &&
     this.commonService.isNonEmptyValue(this.currency)) {
      this.utilizedAmount = this.commonService.replaceCurrency(this.form.get('utilizedAmount').value);
      this.utilizedAmount = this.currencyConverterPipe.transform(this.utilizedAmount.toString(), this.currency);
    }
    if (this.utilizedAmount === '') {
      this.utilizedAmount = FccGlobalConstant.ZERO_STRING;
    }
    this.getBeneficiaries();
    this.form.get(this.currencyField)[this.params][this.rendered] = true;
    this.form.get(this.transferAmountField)[this.params][this.rendered] = true;
    this.setTransferAmtNull = false;
    this.form.addFCCValidators(this.transferAmountField,
      Validators.compose([Validators.required, Validators.pattern(this.commonService.getRegexBasedOnlanguage())]), 0);
    this.populateAmountFields();
    this.updateSecBeneficiaryValue();
    if (this.commonService.isNonEmptyValue(this.lcAmount)){
      const lcAmount = this.currencyConverterPipe.transform(this.lcAmount.toString(), this.currency);
      if (this.commonService.isNonEmptyField('amount', this.form)){
        this.form.get('amount').setValue(this.currency.concat(' ').concat(lcAmount));
      }
    }
    this.initialzeNonSwiftMode();
    this.setPayload();
    if (this.form.get('secondBeneficiaryEntity').value !== undefined &&
    this.form.get('secondBeneficiaryEntity').value !== FccGlobalConstant.EMPTY_STRING) {
      this.benePreviousValue = this.form.get('secondBeneficiaryEntity').value;
    }
    if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) && this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value){
      this.saveTogglePreviousValue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
  }
    if (this.form.get(FccGlobalConstant.BENE_ABBV_NAME) &&
    this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value)) {
     this.beneAbbvPreviousValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
  }

    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    this.form.get('secondBeneficiaryEntity').clearValidators();
    this.form.get('secondBeneficiaryEntity').updateValueAndValidity();
    this.form.get('secondBeneficiaryFirstAddress').clearValidators();
    // this.form.get('secondBeneficiaryFirstAddress').reset();
    this.form.get('secondBeneficiaryFirstAddress').updateValueAndValidity();

  }

  ngAfterViewInit() {
    //eslint : no-empty-function
  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
    }
  }

  setPayload() {
    if (this.commonService.isNonEmptyField('amount', this.form)){
      const amount = this.form.get('amount').value;
      const amountCurrency = amount.substr(0, amount.indexOf(' '));
      const amountValue = amount.substr(amount.indexOf(' ') + 1);
      if (this.commonService.isNonEmptyField('currency', this.form)){
        this.form.get('currency').setValue(amountCurrency);
        if (this.commonService.isNonEmptyValue(this.currency)){
          this.form.get('amount').setValue(this.currency.concat(' ').concat(amountValue));
        }
      }
    }
    const tnxAmt = this.stateService.getValue(FccGlobalConstant.SR_TRANSFER_CONDITIONS, this.transferAmountField, false);
    this.form.get('transactionAmount').setValue(tnxAmt);
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.SR_TRANSFER_CONDITIONS;
    this.form = this.stateService.getSectionData(sectionName);
}

onClickAdviseThru() {
  const toggleValue = this.form.get('adviseThru').value;
  if (toggleValue === FccGlobalConstant.ADVICE_THRU_OPTION_01) {
    this.form.get('adviseThruSwiftCode')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankHeader')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankName')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankFirstAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankSecondAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankThirdAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankFourthAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankIcons')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankName')[this.params][this.required] = false;
    this.form.get('adviseThruBankFirstAddress')[this.params][this.required] = false;
    this.form.get('adviseThruSwiftCode').clearValidators();
    this.form.get('adviseThruSwiftCode').updateValueAndValidity();
    this.form.get('adviseThruBankName').clearValidators();
    this.form.get('adviseThruBankName').updateValueAndValidity();
    this.form.get('adviseThruBankFirstAddress').clearValidators();
    this.form.get('adviseThruBankFirstAddress').updateValueAndValidity();
    this.form.get('adviseThruBankSecondAddress').clearValidators();
    this.form.get('adviseThruBankSecondAddress').updateValueAndValidity();
    this.form.get('adviseThruBankThirdAddress').clearValidators();
    this.form.get('adviseThruBankThirdAddress').updateValueAndValidity();
    this.form.get('adviseThruBankFourthAddress').clearValidators();
    this.form.get('adviseThruBankFourthAddress').updateValueAndValidity();
    this.setFieldsToBlank = ['adviseThruSwiftCode', 'adviseThruBankName', 'adviseThruBankFirstAddress',
    'adviseThruBankSecondAddress', 'adviseThruBankThirdAddress', 'adviseThruBankFourthAddress'];
    this.commonService.setFieldValuesToNull(this.setFieldsToBlank, this.form);
  } else if (toggleValue === FccGlobalConstant.ADVICE_THRU_OPTION_02) {
    this.form.get('adviseThruSwiftCode')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankIcons')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankHeader')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankName')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankName')[this.params][this.required] = true;
    this.form.get('adviseThruBankName').clearValidators();
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT){
      this.form.addFCCValidators('adviseThruBankName', Validators.pattern(this.nameRegex), 1);
    }
    this.form.addFCCValidators('adviseThruBankName', Validators.compose([Validators.maxLength(this.nameLength)]), 1);
    this.form.get('adviseThruBankName')[this.params][this.maxlength] = this.nameLength;
    this.form.get('adviseThruBankName').updateValueAndValidity();

    this.form.get('adviseThruBankFirstAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankFirstAddress').clearValidators();
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT){
      this.form.addFCCValidators('adviseThruBankFirstAddress', Validators.pattern(this.addressRegex), 1);
    }
    this.form.addFCCValidators('adviseThruBankFirstAddress', Validators.compose([Validators.maxLength(this.address1TradeLength)]), 1);
    this.form.get('adviseThruBankFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
    this.form.get('adviseThruBankFirstAddress').updateValueAndValidity();

    this.form.get('adviseThruBankSecondAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankSecondAddress').clearValidators();
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT){
      this.form.addFCCValidators('adviseThruBankSecondAddress', Validators.pattern(this.addressRegex), 1);
    }
    this.form.addFCCValidators('adviseThruBankSecondAddress', Validators.compose([Validators.maxLength(this.address2TradeLength)]), 1);
    this.form.get('adviseThruBankSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
    this.form.get('adviseThruBankSecondAddress').updateValueAndValidity();

    this.form.get('adviseThruBankThirdAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankThirdAddress').clearValidators();
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT){
      this.form.addFCCValidators('adviseThruBankThirdAddress', Validators.pattern(this.addressRegex), 1);
    }
    this.form.addFCCValidators('adviseThruBankThirdAddress', Validators.compose([Validators.maxLength(this.domTradeLength)]), 1);
    this.form.get('adviseThruBankThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
    this.form.get('adviseThruBankThirdAddress').updateValueAndValidity();
    this.form.get('adviseThruBankFourthAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankFourthAddress').clearValidators();
    if (this.transmissionMode === FccBusinessConstantsService.SWIFT){
      this.form.addFCCValidators('adviseThruBankFourthAddress', Validators.pattern(this.addressRegex), 1);
    }
    this.form.addFCCValidators('adviseThruBankFourthAddress', Validators.compose([Validators.maxLength(this.address4TradeLength)]), 1);
    this.form.get('adviseThruBankFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
    this.form.get('adviseThruBankFourthAddress').updateValueAndValidity();
  }
}

  onClickFullTransfer() {
    const toggleValue = this.form.get('fullTransfer').value;
    const remainingAvailableAmount = (+parseFloat(this.commonService.replaceCurrency(this.lcAmount))) -
    (+parseFloat(this.commonService.replaceCurrency(this.utilizedAmount)));
    const availableAmount = this.currencyConverterPipe.transform(remainingAvailableAmount.toString(), this.currency);
    this.form.get('availableAmount').setValue(this.currency.concat(' ').concat(availableAmount));
    if (toggleValue === FccBusinessConstantsService.NO) {
      this.form.get(this.transferAmountField).setValue('');
      this.form.get(this.transferAmountField)[this.params][this.readonly] = false;
      this.form.controls[this.transferAmountField].enable();
    } else {
      this.form.get(this.transferAmountField).setValue(availableAmount);
      this.form.get(this.transferAmountField)[this.params][this.readonly] = true;
      this.form.controls[this.transferAmountField].disable();
      this.form.get(this.transferAmountField).setErrors(null);
      this.form.get(this.transferAmountField).clearValidators();
    }
    this.transferAmountValidation();
    this.form.get(this.transferAmountField).updateValueAndValidity();
  }

onClickSecondBeneficiaryEntity(event) {
  if (event.value) {
    this.form.get('secondBeneficiaryName').setValue(event.value.name);
    this.form.get('secondBeneficiarycountry').setValue({ label: event.value.country, shortName: event.value.country });
    this.form.get('secondBeneficiaryFirstAddress').setValue(event.value.swiftAddressLine1);
    this.form.get('secondBeneficiarySecondAddress').setValue(event.value.swiftAddressLine2);
    this.form.get('secondBeneficiaryThirdAddress').setValue(event.value.swiftAddressLine3);
    this.form.get('secondBeneficiaryFourthAddress').setValue(event.value.swiftAddressLine4);
  }
}

onClickTransmissionMode() {
  this.initialzeNonSwiftMode();
  const modeOfTransmission = this.form.get(FccGlobalConstant.TRANS_MODE).value;
  if (modeOfTransmission === FccBusinessConstantsService.OTHER_99) {
    this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT_OTHER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
    this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_MODE], false);
  } else {
    this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT_OTHER)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
    this.togglePreviewScreen(this.form, [FccGlobalConstant.TRANS_MODE], true);
    this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT).setValue('');
    this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT).clearValidators();
    this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT).updateValueAndValidity();
    this.form.get(FccTradeFieldConstants.ADVISE_SEND_MODE_TEXT)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  }
}

initialzeNonSwiftMode() {
  let toggleValue;
  if (this.commonService.isNonEmptyField('adviseThru', this.form)){
    toggleValue = this.form.get('adviseThru').value;
  }
  if (this.commonService.isNonEmptyValue(toggleValue) && toggleValue === '02') {
    this.form.get('adviseThruSwiftCode')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankFirstAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankSecondAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankThirdAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankFourthAddress')[this.params][this.rendered] = true;
  }
  if (this.commonService.isNonEmptyField('secondBeneficiaryFirstAddress', this.form)) {
    this.form.get('secondBeneficiaryFirstAddress')[this.params][this.rendered] = true;
  }
  if ( this.commonService.isNonEmptyField('secondBeneficiarySecondAddress', this.form)) {
    this.form.get('secondBeneficiarySecondAddress')[this.params][this.rendered] = true;
  }
  if (this.commonService.isNonEmptyField('secondBeneficiaryThirdAddress', this.form)) {
    this.form.get('secondBeneficiaryThirdAddress')[this.params][this.rendered] = true;
  }
  if (this.commonService.isNonEmptyField('secondBeneficiaryFourthAddress', this.form)) {
    this.form.get('secondBeneficiaryFourthAddress')[this.params][this.rendered] = true;
  }
  if (this.commonService.isNonEmptyValue(toggleValue) && toggleValue !== FccGlobalConstant.ADVICE_THRU_OPTION_01 &&
  toggleValue !== FccGlobalConstant.ADVICE_THRU_OPTION_02) {
    this.form.get('adviseThruSwiftCode')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankIcons')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankHeader')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankName')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankFirstAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankSecondAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankThirdAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankFourthAddress')[this.params][this.rendered] = false;
  }
}

onBlurTransferAmount() {
  let isValid = true;
  this.form.get(this.transferAmountField).clearValidators();
  let transferAmt = this.form.get(this.transferAmountField).value;
  this.allowedDecimals = FccGlobalConstant.LENGTH_0;
  if (transferAmt !== '' && this.commonService.isNonEmptyValue(transferAmt)) {
    isValid = this.commonService.checkNegativeAmount(this.form, transferAmt, this.transferAmountField);
    isValid = this.commonService.checkRegexAmount(this.form, transferAmt, this.transferAmountField);
    if (isValid) {
      transferAmt = this.commonService.replaceCurrency(transferAmt);
      transferAmt = this.currencyConverterPipe.transform(transferAmt.toString(), this.currency);
      this.form.get(this.transferAmountField).setValue(transferAmt);
    }
  }
  this.transferAmountValidation();
}

 getBeneficiaries() {
  this.corporateCommonService.getCounterparties(
    this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.counterparties)
    .subscribe(response => {
        this.getBeneficiariesAsList(response.body);
        this.updateSecBeneficiaryValue();
        if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.leftSectionEnabled) {
          this.stateService.setStateSection(FccGlobalConstant.SR_TRANSFER_CONDITIONS, this.form);
          this.leftSectionService.reEvaluateProgressBar.next(true);
        }
    });
 }

 getBeneficiariesAsList(body: any) {
  this.counterpartyDetailsList = body;
  if (this.commonService.addressType && this.commonService.addressType === FccGlobalConstant.POSTAL_ADDRESS_PA) {
    this.entityAddressType = FccGlobalConstant.POSTAL_ADDRESS;
  } else {
    this.entityAddressType = FccGlobalConstant.SWIFT_ADDRESS_LOWERCASE;
  }
  this.counterpartyDetailsList.items.forEach(value => {
    const beneficiary: { label: string; value: any } = {
      label: this.commonService.decodeHtml(value.name),
      value: {
        label: this.commonService.decodeHtml(value.shortName),
        swiftAddressLine1: this.commonService.decodeHtml(value[this.entityAddressType].line1),
        swiftAddressLine2: this.commonService.decodeHtml(value[this.entityAddressType].line2),
        swiftAddressLine3: this.commonService.decodeHtml(value[this.entityAddressType].line3),
        country: value.country,
        entity: decodeURI(value.entityShortName),
        shortName: this.commonService.decodeHtml(value.shortName),
        name: this.commonService.decodeHtml(value.name)
      }
    };
    this.abbvNameList.push(this.commonService.decodeHtml(value.shortName));
    this.entityNameList.push(this.commonService.decodeHtml(value.name));
    this.beneficiaries.push(beneficiary);
  });
  if (this.operation === FccGlobalConstant.PREVIEW && this.mode === FccGlobalConstant.VIEW_MODE) {
    if (this.form.get('secondBeneficiaryEntity').value !== FccGlobalConstant.EMPTY_STRING &&
    typeof(this.form.get('secondBeneficiaryEntity').value) === 'object') {
      const adhocBene: { label: string; value: any } = {
        label: this.form.get('secondBeneficiaryEntity').value.label,
        value: {
          label: this.form.get('secondBeneficiaryEntity').value.label,
          swiftAddressLine1: '',
          swiftAddressLine2: '',
          swiftAddressLine3: '',
          entity: '&#x2a;',
          shortName: '',
          name: ''
        }
      };
      this.beneficiaries.push(adhocBene);
    }
   }
  this.patchFieldParameters(this.form.get('secondBeneficiaryEntity'), { options: this.beneficiaries });
}

onClickAdviseThruBankIcons() {
  const header = `${this.translateService.instant('listOfBanks')}`;
  const productCode = 'productCode';
  const subProductCode = 'subProductCode';
  const headerDisplay = 'headerDisplay';
  const buttons = 'buttons';
  const savedList = 'savedList';
  const option = 'option';
  const downloadIconEnabled = 'downloadIconEnabled';
  const obj = {};
  obj[productCode] = '';
  obj[option] = 'staticBank';
  obj[subProductCode] = '';
  obj[buttons] = false;
  obj[savedList] = false;
  obj[headerDisplay] = false;
  obj[downloadIconEnabled] = false;

  this.resolverService.getSearchData(header, obj);
  this.adviseThroughBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((responseAdvThru) => {

    if (responseAdvThru && responseAdvThru !== null && responseAdvThru.responseData && responseAdvThru.responseData !== null) {
      responseAdvThru.responseData.ISO_CODE ? this.form.get('adviseThruSwiftCode').patchValue(responseAdvThru.responseData.ISO_CODE) :
      this.form.get('adviseThruSwiftCode').patchValue(responseAdvThru.responseData[4]);
      responseAdvThru.responseData.NAME ? this.form.get('adviseThruBankName').patchValue(responseAdvThru.responseData.NAME) :
      this.form.get('adviseThruBankName').patchValue(responseAdvThru.responseData[0]);
      responseAdvThru.responseData.ADDRESS_LINE_1 ? this.form.get('adviseThruBankFirstAddress')
      .patchValue(responseAdvThru.responseData.ADDRESS_LINE_1) :
      this.form.get('adviseThruBankFirstAddress').patchValue(responseAdvThru.responseData[1]);
      responseAdvThru.responseData.ADDRESS_LINE_2 ? this.form.get('adviseThruBankSecondAddress')
      .patchValue(responseAdvThru.responseData.ADDRESS_LINE_2) :
      this.form.get('adviseThruBankSecondAddress').patchValue(responseAdvThru.responseData[2]);
      responseAdvThru.responseData.DOM ? this.form.get('adviseThruBankThirdAddress').patchValue(responseAdvThru.responseData.DOM) :
      this.form.get('adviseThruBankThirdAddress').patchValue(responseAdvThru.responseData[3]);
      this.form.get('adviseThruBankFourthAddress').patchValue(responseAdvThru.responseData.ADDRESS_LINE_4);
    }
  });
}

ngOnDestroy() {
  if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) !== null) {
    const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    if (togglevalue !== undefined && togglevalue === FccBusinessConstantsService.YES &&
      !this.form.get(FccGlobalConstant.BENE_ABBV_NAME).hasError('duplicateCounterpartyAbbvName')) {
        if (this.mode === FccGlobalConstant.DRAFT_OPTION){
          this.commonService.saveBeneficiary(this.getCounterPartyObjectForAmend(this.form)).subscribe();
        }else{
          this.commonService.saveBeneficiary(this.getCounterPartyObject(this.form)).subscribe();
        }
    }
  }
}

  populateAmountFields() {
    const remainingAvailableAmount = (+parseFloat(this.commonService.replaceCurrency(this.lcAmount))) -
    (+parseFloat(this.commonService.replaceCurrency(this.utilizedAmount)));
    const availableAmount = this.currencyConverterPipe.transform(remainingAvailableAmount.toString(), this.currency);
    const availableAmountFloat = parseFloat(this.commonService.replaceCurrency(availableAmount));
    const lcAmountFloat = parseFloat(this.commonService.replaceCurrency(this.lcAmount));
    let tnxAmt = this.commonService.replaceCurrency(
      this.stateService.getValue(
        FccGlobalConstant.SR_TRANSFER_CONDITIONS,
        this.transferAmountField,
        false
      )
    );

    tnxAmt = this.currencyConverterPipe.transform(tnxAmt.toString(), this.currency);
    if (this.mode === 'DRAFT') {
      if (tnxAmt) {
        const tnxAmtFloat = parseFloat(this.commonService.replaceCurrency(tnxAmt));
        if (tnxAmtFloat === availableAmountFloat || tnxAmtFloat === lcAmountFloat) {
          this.form.get('fullTransfer').setValue(FccBusinessConstantsService.YES);
          this.setAmountFields(FccBusinessConstantsService.YES, tnxAmt);
        } else {
          this.form.get('fullTransfer').setValue(FccBusinessConstantsService.NO);
          this.setAmountFields(FccBusinessConstantsService.NO, tnxAmt);
        }
      } else {
        this.form.get('fullTransfer').setValue(FccBusinessConstantsService.NO);
        this.setAmountFields(FccBusinessConstantsService.NO, tnxAmt);
      }
    } else {
      const toggleValue = this.form.get('fullTransfer').value;
      if (toggleValue === FccBusinessConstantsService.YES) {
        this.setAmountFields(FccBusinessConstantsService.YES, availableAmount);
      } else {
        this.setAmountFields(FccBusinessConstantsService.NO, tnxAmt);
      }
    }
    this.form.get('availableAmount').setValue(this.currency.concat(' ').concat(availableAmount));
  }

  setAmountFields(toggleValue, transferAmount) {
    this.form.get(this.transferAmountField).clearValidators();
    this.form.get(this.transferAmountField).setValue(transferAmount);
    if (toggleValue === FccBusinessConstantsService.NO) {
      this.form.get(this.transferAmountField)[this.params][this.readonly] = false;
      this.form.controls[this.transferAmountField].enable();
    } else {
      this.form.get(this.transferAmountField)[this.params][this.readonly] = true;
      this.form.controls[this.transferAmountField].disable();
    }
    this.transferAmountValidation();
    this.form.get(this.transferAmountField).updateValueAndValidity();
  }

  transferAmountValidation() {
    const originalLCAmt = this.commonService.replaceCurrency(this.lcAmount);
    const utilizedAmount = this.commonService.replaceCurrency(this.stateService.getValue(
      FccGlobalConstant.SR_TRANSFER_CONDITIONS,
      "utilizedAmount",
      false
    ));
    const availableAmt = +originalLCAmt - +utilizedAmount;
    const availableFloatAmt = parseFloat(availableAmt.toString());
    let transferAmt = this.commonService.replaceCurrency(this.form.get(this.transferAmountField).value);
    transferAmt = this.currencyConverterPipe.transform(transferAmt.toString(), this.currency);
    const transferAmtFloatValue = parseFloat(transferAmt !== null ? this.commonService.replaceCurrency(transferAmt) : 0);
    if (this.commonService.isNonEmptyValue(transferAmtFloatValue) && transferAmt !== null && transferAmtFloatValue <= 0) {
      this.form.get(this.transferAmountField).clearValidators();
      const amnt = this.form.get(this.transferAmountField);
      amnt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      this.form.addFCCValidators(this.transferAmountField,
        Validators.compose([Validators.required, amountCanNotBeZero]), 0);
      this.form.get(this.transferAmountField).setErrors({ amountCanNotBeZero: true });
      this.form.get(this.transferAmountField).markAsDirty();
      this.form.get(this.transferAmountField).markAsTouched();
      this.form.get(this.transferAmountField).updateValueAndValidity();
    } else if (this.commonService.isNonEmptyValue(transferAmtFloatValue) && (transferAmtFloatValue > availableFloatAmt)) {
      this.form.get(this.transferAmountField).clearValidators();
      this.form.addFCCValidators(this.transferAmountField,
        Validators.compose([Validators.required, transferAmtGreaterThanAvailableAmt]), 0);
      this.form.get(this.transferAmountField).setErrors({ transferAmtGreaterThanAvailableAmt: true });
      this.form.get(this.transferAmountField).markAsDirty();
      this.form.get(this.transferAmountField).markAsTouched();
      this.form.get(this.transferAmountField).updateValueAndValidity();
    } else if (this.commonService.isNonEmptyValue(transferAmtFloatValue) &&
    (transferAmtFloatValue > 0 && transferAmtFloatValue < availableFloatAmt)) {
      this.checkTransferAvailableAmt(transferAmt);
    } else if (this.commonService.isNonEmptyValue(transferAmtFloatValue) &&
    transferAmtFloatValue > 0 && transferAmtFloatValue === availableFloatAmt) {
      this.form.get('fullTransfer').setValue(FccBusinessConstantsService.YES);
      this.form.get(this.transferAmountField)[this.params][this.readonly] = true;
    } else if (!(this.commonService.isNonEmptyValue(this.form.get(this.transferAmountField).value) &&
    this.form.get(this.transferAmountField).value !== '')) {
      this.form.get(this.transferAmountField).clearValidators();
      this.form.addFCCValidators(this.transferAmountField,
        Validators.compose([Validators.required]), 0);
      this.form.get(this.transferAmountField).markAsDirty();
      this.form.get(this.transferAmountField).markAsTouched();
      this.form.get(this.transferAmountField).updateValueAndValidity();
    }
  }

  protected checkTransferAvailableAmt(transferAmt: any) {
    if (this.form.get(this.transferAmountField).hasError('invalidAmt')) {
      this.form.get(this.transferAmountField).setErrors({ invalidAmt: true });
    } else {
      this.form.get(this.transferAmountField).clearValidators();
      this.form.get(this.transferAmountField).setValue(transferAmt);
      this.form.get(this.transferAmountField).updateValueAndValidity();
    }
  }

  updateSecBeneficiaryValue() {
    if (this.form.get('secondBeneficiaryEntity').value) {
      const secondBeneficiaryEntity = this.stateService.getValue(FccGlobalConstant.SR_TRANSFER_CONDITIONS,
        'secondBeneficiaryEntity', false);
      const secondBeneFilterLength = (this.beneficiaries.filter(task => task.value === this.form.value.secondBeneficiaryEntity)).length;
      if (secondBeneficiaryEntity && this.beneficiaries !== undefined && this.beneficiaries.length > 0 && secondBeneFilterLength > 0) {
        const entityFilteredValue = this.beneficiaries.filter(task => task.label === secondBeneficiaryEntity)[0].value;
        if (entityFilteredValue) {
          this.form.get('secondBeneficiaryEntity').setValue(entityFilteredValue);
        } else {
          this.form.get('secondBeneficiaryEntity').setValue('');
        }
      } else {
        this.form.get('secondBeneficiaryEntity').setValue(this.form.get('secondBeneficiaryEntity').value);
      }
    }

    else if (this.benePreviousValue !== undefined && this.benePreviousValue !== null) {
      this.form.get('secondBeneficiaryEntity').setValue(this.benePreviousValue);
    }
    this.updateBeneSaveToggleDisplay();
  }

  updateBeneSaveToggleDisplay(){

    if (this.benePreviousValue !== undefined &&
      (this.mode === FccGlobalConstant.DRAFT_OPTION)){
      this.checkBeneSaveAllowedForAmend(this.benePreviousValue.name);
      if (this.saveTogglePreviousValue === FccBusinessConstantsService.YES && this.beneAbbvPreviousValue){
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
      }
    }
    const beneAbbvNameValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    if (beneAbbvNameValue !== null && beneAbbvNameValue !== FccGlobalConstant.EMPTY_STRING){
      if (this.benePreviousValue &&
        !(this.entityNameList.includes(this.benePreviousValue.name ? this.benePreviousValue.name : this.benePreviousValue))){
        this.onBlurBeneAbbvName();
      }else{
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = true;
        this.clearBeneAbbvValidator();
      }
    }
  }

  // method to check if adhoc beneficiary save can be performed for amend
  checkBeneSaveAllowedForAmend(beneAmendValue: any) {
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    if (this.syBeneAdd && this.entityNameList !== undefined && this.entityNameList.length > 0
      && beneAmendValue !== FccGlobalConstant.EMPTY_STRING && (this.entityNameList.indexOf(beneAmendValue) === -1)){
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
      if (this.form.get('secondBeneficiaryEntity').value !== undefined
        && this.form.get('secondBeneficiaryEntity').value !== FccGlobalConstant.EMPTY_STRING){
          this.form.get('secondBeneficiaryName').setValue(this.form.get('secondBeneficiaryEntity').value);
        }
      this.onClickBeneficiarySaveToggle();
    }
    else {
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
        this.clearBeneAbbvValidator();
    }
  }

   // method to check if adhoc beneficiary save can be performed
   checkBeneSaveAllowed(toggleValue){
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    this.beneEditToggleVisible = toggleValue;
    if (this.syBeneAdd && this.beneEditToggleVisible) {
    this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
    this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
    if (this.form.get('secondBeneficiaryEntity').value !== undefined
    && this.form.get('secondBeneficiaryEntity').value !== FccGlobalConstant.EMPTY_STRING){
      this.form.get('secondBeneficiaryName').setValue(this.form.get('secondBeneficiaryEntity').value);
    }
    this.onClickBeneficiarySaveToggle();
    } else{
      if (!this.syBeneAdd || !this.beneEditToggleVisible){
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
        this.clearBeneAbbvValidator();
      }
    }
  }

  // clear bene abbv validator
  clearBeneAbbvValidator()
  {
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).clearValidators();
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
  }

  // Display bene abbv name after turning on bene save toggle
  onClickBeneficiarySaveToggle() {
    this.beneAbbvName = FccGlobalConstant.BENE_ABBV_NAME;
    const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    if (togglevalue === FccBusinessConstantsService.NO) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
      this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setValue(FccGlobalConstant.EMPTY_STRING);
      this.clearBeneAbbvValidator();
    }
    else {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = false;
      this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
        Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
    }
  }

  // to create adhoc beneficiary object for Amend
  getCounterPartyObjectForAmend(form: FCCFormGroup): CounterpartyRequest {
    let beneName: string;
    if (form.get('secondBeneficiaryEntity').value.name !== undefined){
    beneName = form.get('secondBeneficiaryEntity').value.name;
  } else {
    beneName = form.get('secondBeneficiaryEntity').value;
  }
    const counterpartyRequest: CounterpartyRequest = {
      name: this.commonService.validateValue(beneName),
      shortName: this.commonService.validateValue(form.get(FccGlobalConstant.BENE_ABBV_NAME).value),
      swiftAddress: {
        line1: this.commonService.validateValue(form.get('secondBeneficiaryFirstAddress').value),
        line2: this.commonService.validateValue(form.get('secondBeneficiarySecondAddress').value),
        line3: this.commonService.validateValue(form.get('secondBeneficiaryThirdAddress').value),
      },
      country: this.commonService.validateValue(form.get('secondBeneficiarycountry').value.shortName),
      entityShortName: FccGlobalConstant.ENTITY_DEFAULT,
    };
    return counterpartyRequest;
  }

    // to create adhoc beneficiary object
    getCounterPartyObject(form: FCCFormGroup): CounterpartyRequest {
      const counterpartyRequest: CounterpartyRequest = {
        name: this.commonService.validateValue(form.get('secondBeneficiaryEntity').value),
        shortName: this.commonService.validateValue(form.get(FccGlobalConstant.BENE_ABBV_NAME).value),
        swiftAddress: {
          line1: this.commonService.validateValue(form.get('secondBeneficiaryFirstAddress').value),
          line2: this.commonService.validateValue(form.get('secondBeneficiarySecondAddress').value),
          line3: this.commonService.validateValue(form.get('secondBeneficiaryThirdAddress').value),
        },
        country: this.commonService.validateValue(form.get('secondBeneficiarycountry').value.shortName),
        entityShortName: FccGlobalConstant.ENTITY_DEFAULT,
      };
      return counterpartyRequest;
    }

    // validation on change of beneAbbvName field
    onBlurBeneAbbvName() {
      const abbvName = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors(null);
      if (this.abbvNameList.includes(abbvName) && !this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly]) {
      if (this.abbvNameList.indexOf(abbvName) === -1) {
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ duplicateCounterpartyAbbvName: { abbvName } });
      }
    }
    this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
    Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();

    if ((abbvName.split(' ').length-1) !== 0) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ whiteSpaceNotAllowed: { abbvName } });
    }
    }
}

