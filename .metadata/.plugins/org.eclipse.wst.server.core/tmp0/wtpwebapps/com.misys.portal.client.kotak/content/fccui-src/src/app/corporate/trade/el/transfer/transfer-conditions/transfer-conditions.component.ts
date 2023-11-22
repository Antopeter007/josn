import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CounterpartyRequest } from '../../../../../common/model/counterpartyRequest';
import { BehaviorSubject } from 'rxjs';

import { FccBusinessConstantsService } from '../../../../../../app/common/core/fcc-business-constants.service';
import { CounterpartyDetailsList } from '../../../../../../app/common/model/counterpartyDetailsList';
import { SearchLayoutService } from '../../../../../../app/common/services/search-layout.service';
import { FccGlobalConfiguration } from '../../../../../common/core/fcc-global-configuration';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import {
  transferExpiryDateLessThanCurrentDate,
  transferExpiryDateLessThenOriginalexpiryDate,
} from '../../../../trade/lc/initiation/validator/ValidateDates';
import { LcConstant } from '../../../lc/common/model/constant';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { FormControlService } from '../../../lc/initiation/services/form-control.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import {
  amountCanNotBeZero,
  transferAmtGreaterThanAvailableAmt,
} from '../../../lc/initiation/validator/ValidateAmt';
import { ElProductComponent } from '../../el-product/el-product.component';
import { FCCFormGroup } from './../../../.../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../../common/services/form-model.service';
import { CorporateCommonService } from './../../../../../corporate/common/services/common.service';
import { ElProductService } from '../../services/el-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FccTradeFieldConstants } from '../../../common/fcc-trade-field-constants';

@Component({
  selector: 'app-transfer-conditions',
  templateUrl: './transfer-conditions.component.html',
  styleUrls: ['./transfer-conditions.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: TransferConditionsComponent }]
})
export class TransferConditionsComponent extends ElProductComponent implements OnInit , AfterViewInit {
  form: FCCFormGroup;
  lcConstant = new LcConstant();
  expiryDateofELC;
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  readonly = this.lcConstant.readonly;
  required = this.lcConstant.required;
  defaultVal = this.lcConstant.defaultValue;
  productCode: any;
  swiftXCharRegex: string;
  swiftZCharRegex: string;
  module = `${this.translateService.instant('transferConditions')}`;
  lcAmount;
  currency;
  modeOfTransmission;
  utilizedAmount;
  responseStatusCode = 200;
  allowedDecimals = -1;
  validatorPattern = FccGlobalConstant.AMOUNT_VALIDATION;
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
  amountreplaceregex: any;
  flagDecimalPlaces;
  beneEditToggleVisible: any;
  syBeneAdd: any;
  benePreviousValue: any;
  abbvNameList = [];
  entityAddressType: any;
  saveTogglePreviousValue: any;
  beneAbbvPreviousValue: any;
  entityNameList = [];
  enquiryRegex = '';

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
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected resolverService: ResolverService,
    protected confirmationService: ConfirmationService,
    protected utilityService: UtilityService,
    protected fileList: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected currencyConverterPipe: CurrencyConverterPipe, protected elProductService: ElProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService,
          customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileList,
          dialogRef, currencyConverterPipe, elProductService);
  }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.TRANSFER_DETAILS).get('transmissionMode').value;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nameRegex = response.BeneficiaryNameRegex;
        this.addressRegex = response.BeneficiaryAddressRegex;
        this.nameLength = response.BeneficiaryNameLength;
        this.swifCodeRegex = response.bigSwiftCode;
        this.address1TradeLength = response.address1TradeLength;
        this.address2TradeLength = response.address2TradeLength;
        this.domTradeLength = response.domTradeLength;
        this.address4TradeLength = response.address4TradeLength;
        this.enquiryRegex = response.swiftXCharacterSet;
        this.swiftXCharRegex = response.swiftXCharacterSet;
        this.swiftZCharRegex = response.swiftZChar;
        this.beneAbbvNameRegex = response.BeneficiaryAbbvNameRegex;
        this.onClickAdviseThru();
        this.form.get('transferPlaceOfExpiry').clearValidators();
        this.form.get('secondBeneficiaryName').clearValidators();
        this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_1).clearValidators();
        this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_2).clearValidators();
        this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_3).clearValidators();
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators('transferPlaceOfExpiry',Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators('secondBeneficiaryName', Validators.pattern(this.nameRegex), 0);
          this.form.addFCCValidators(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_1, Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_2, Validators.pattern(this.enquiryRegex), 0);
          this.form.addFCCValidators(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_3, Validators.pattern(this.enquiryRegex), 0);
        } else {
          this.form.addFCCValidators('secondBeneficiaryName', Validators.compose([Validators.maxLength(this.nameLength)]), 1);
          this.form.get('secondBeneficiaryName')[this.params][this.maxlength] = this.nameLength;
          this.form.get('secondBeneficiaryName').updateValueAndValidity();
          this.form.addFCCValidators(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_1, Validators.compose([Validators.required,
            Validators.maxLength(this.address1TradeLength)]), 1);
          this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_1)[this.params][this.maxlength] = this.address1TradeLength;
          this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_1).updateValueAndValidity();
          this.form.addFCCValidators(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_2,
          Validators.compose([Validators.maxLength(this.address2TradeLength)]), 1);
          this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_2)[this.params][this.maxlength] = this.address2TradeLength;
          this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_2).updateValueAndValidity();
          this.form.addFCCValidators(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_3,
            Validators.compose([Validators.maxLength(this.domTradeLength)]), 1);
          this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_3)[this.params][this.maxlength] = this.domTradeLength;
          this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_3).updateValueAndValidity();
          } if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators('transferPlaceOfExpiry', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('secondBeneficiaryName', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('secondBeneficiaryFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('secondBeneficiarySecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('secondBeneficiaryThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.get('transferPlaceOfExpiry').updateValueAndValidity();
          this.form.get('secondBeneficiaryName').updateValueAndValidity();
          this.form.get('secondBeneficiaryFirstAddress').updateValueAndValidity();
          this.form.get('secondBeneficiarySecondAddress').updateValueAndValidity();
          this.form.get('secondBeneficiaryThirdAddress').updateValueAndValidity();
        }
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
          this.form.get('secondBeneficiaryFourthAddress').clearValidators();
        } else {
          this.form.addFCCValidators('secondBeneficiaryFourthAddress', Validators.maxLength(this.address4TradeLength), 1);
          this.form.get('secondBeneficiaryFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
        }
        this.form.get('secondBeneficiaryFourthAddress').updateValueAndValidity();
      }
    });
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.lcAmount = this.stateService.getValue(FccGlobalConstant.TRANSFER_DETAILS, 'lcAmount', false);
    this.currency = this.stateService.getValue(FccGlobalConstant.TRANSFER_DETAILS, 'currency', false);
    this.lcAmount = this.commonService.replaceCurrency(this.lcAmount);
    if (this.commonService.isNonEmptyValue(this.form.get('utilizedAmount').value) &&
     this.commonService.isNonEmptyValue(this.currency)) {
      this.utilizedAmount = this.commonService.replaceCurrency(this.form.get('utilizedAmount').value);
      this.utilizedAmount = this.currencyConverterPipe.transform(this.utilizedAmount.toString(), this.currency);
    }
    // this.utilizedAmount = this.stateService.getValue(FccGlobalConstant.TRANSFER_DETAILS, 'utilizedAmount', false);
    if (this.utilizedAmount === '') {
      this.utilizedAmount = FccGlobalConstant.ZERO_STRING;
    }
    this.getBeneficiaries();
    // this.checkBeneSaveAllowed();
    this.form.get(this.currencyField)[this.params][this.rendered] = true;
    this.form.get(this.transferAmountField)[this.params][this.rendered] = true;
    this.onClickTransferExpiryDate();
    this.setTransferAmtNull = false;
    this.form.addFCCValidators(this.transferAmountField,
      Validators.compose([Validators.required, Validators.pattern(this.validatorPattern)]), 0);
    this.setAmountReplaceReqgex();
    this.populateAmountFields();
    this.updateSecBeneficiaryValue();
    if (this.form.get('secondBeneficiaryEntity').value !== undefined &&
    this.form.get('secondBeneficiaryEntity').value !== FccGlobalConstant.EMPTY_STRING) {
      this.benePreviousValue = this.form.get('secondBeneficiaryEntity').value;
    }
    if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) && this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value) {
      this.saveTogglePreviousValue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    }
    if (this.form.get(FccGlobalConstant.BENE_ABBV_NAME) &&
    this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value) &&
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value !== FccGlobalConstant.EMPTY_STRING) {
     this.beneAbbvPreviousValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    }

    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.mode === FccGlobalConstant.DRAFT_OPTION){
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  ngAfterViewInit() {
    const lcAmount = this.currencyConverterPipe.transform(this.lcAmount.toString(), this.currency);
    this.form.get('amount').setValue(this.currency.concat(' ').concat(lcAmount));
    const transferPlaceOfExpiry = 'transferPlaceOfExpiry';
    const transferPlaceOfExpiryValue = this.stateService.getValueObject(FccGlobalConstant.TRANSFER_DETAILS, transferPlaceOfExpiry, false);
    this.form.get(transferPlaceOfExpiry).setValue(this.commonService.decodeHtml(transferPlaceOfExpiryValue));
    this.form.get(transferPlaceOfExpiry).updateValueAndValidity();
    this.modeOfTransmission = this.form.get('transmissionMode').value;
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
      this.initialzeSwiftMode();
    } else {
      this.initialzeNonSwiftMode();
    }
    this.setPayload();
  }

  setPayload() {
    const amount = this.form.get('amount').value;
    const tnxAmt = this.stateService.getValue(FccGlobalConstant.TRANSFER_DETAILS, this.transferAmountField, false);
    const amountCurrency = amount.substr(0, amount.indexOf(' '));
    const amountValue = amount.substr(amount.indexOf(' ') + 1);
    this.form.get('currency').setValue(amountCurrency);
    this.form.get('amount').setValue(this.currency.concat(' ').concat(amountValue));
    this.form.get('transactionAmount').setValue(tnxAmt);
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.TRANSFER_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.setAmountLengthValidator(this.transferAmountField);
    this.form.addFCCValidators('secondBeneficiaryEntity', Validators.compose([Validators.required]), 0);
}

onClickAdviseThru() {
  const toggleValue = this.form.get('adviseThru').value;
  if (toggleValue === '01') {
    this.form.get('adviseThruBankHeader')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankName')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankFirstAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankSecondAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankThirdAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankFourthAddress')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankIcons')[this.params][this.rendered] = false;
    this.form.get('adviseThruBankName')[this.params][this.required] = false;
    this.form.get('adviseThruBankFirstAddress')[this.params][this.required] = false;
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
    this.setFieldsToBlank = ['adviseThruBankName', 'adviseThruBankFirstAddress',
    'adviseThruBankSecondAddress', 'adviseThruBankThirdAddress', 'adviseThruBankFourthAddress'];
    this.commonService.setFieldValuesToNull(this.setFieldsToBlank, this.form);
  } else {
    this.modeOfTransmission = this.form.get('transmissionMode').value;
    this.form.get('adviseThruBankIcons')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankHeader')[this.params][this.rendered] = true;

    this.form.get('adviseThruBankName')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankName')[this.params][this.required] = true;
    this.form.get('adviseThruBankName').clearValidators();
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators('adviseThruBankName', Validators.pattern(this.nameRegex), 0);
    } else {
      this.form.addFCCValidators('adviseThruBankName', Validators.compose([Validators.maxLength(this.nameLength)]), 1);
      this.form.get('adviseThruBankName')[this.params][this.maxlength] = this.nameLength;
      this.form.get('adviseThruBankName').updateValueAndValidity();
    }

    this.form.get('adviseThruBankFirstAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankFirstAddress').clearValidators();
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators('adviseThruBankFirstAddress', Validators.pattern(this.enquiryRegex), 0);
    } else {
      this.form.addFCCValidators('adviseThruBankFirstAddress', Validators.compose([Validators.maxLength(this.address1TradeLength)]), 1);
      this.form.get('adviseThruBankFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
      this.form.get('adviseThruBankFirstAddress').updateValueAndValidity();
    }

    this.form.get('adviseThruBankSecondAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankSecondAddress').clearValidators();
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators('adviseThruBankSecondAddress', Validators.pattern(this.enquiryRegex), 0);
    } else {
      this.form.addFCCValidators('adviseThruBankSecondAddress', Validators.compose([Validators.maxLength(this.address2TradeLength)]), 1);
      this.form.get('adviseThruBankSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
      this.form.get('adviseThruBankSecondAddress').updateValueAndValidity();
    }

    this.form.get('adviseThruBankThirdAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankThirdAddress').clearValidators();
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators('adviseThruBankThirdAddress', Validators.pattern(this.enquiryRegex), 0);
    } else {
      this.form.addFCCValidators('adviseThruBankThirdAddress', Validators.compose([Validators.maxLength(this.domTradeLength)]), 1);
      this.form.get('adviseThruBankThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
      this.form.get('adviseThruBankThirdAddress').updateValueAndValidity();
    }

    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT ) {
      this.form.get('adviseThruBankFourthAddress')[this.params][this.rendered] = false;
      this.form.get('adviseThruBankFourthAddress').clearValidators();
      this.form.get('adviseThruBankFourthAddress').updateValueAndValidity();
    } else {
      this.form.get('adviseThruBankFourthAddress')[this.params][this.rendered] = true;
      this.form.get('adviseThruBankFourthAddress').clearValidators();
      this.form.addFCCValidators('adviseThruBankFourthAddress', Validators.compose([Validators.maxLength(this.address4TradeLength)]), 1);
      this.form.get('adviseThruBankFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
      this.form.get('adviseThruBankFourthAddress').updateValueAndValidity();
    }
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators('adviseThruBankName', Validators.pattern(this.swiftXCharRegex), 0);
      this.form.addFCCValidators('adviseThruBankFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
      this.form.addFCCValidators('adviseThruBankSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
      this.form.addFCCValidators('adviseThruBankThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
      this.form.get('adviseThruBankName').updateValueAndValidity();
      this.form.get('adviseThruBankFirstAddress').updateValueAndValidity();
      this.form.get('adviseThruBankSecondAddress').updateValueAndValidity();
      this.form.get('adviseThruBankThirdAddress').updateValueAndValidity();
    }
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
    this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_1).setValue(event.value.swiftAddressLine1);
    this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_2).setValue(event.value.swiftAddressLine2);
    this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_3).setValue(event.value.swiftAddressLine3);
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
      this.form.get('secondBeneficiaryFourthAddress').setValue('');
    }
  }
}

onClickTransferExpiryDate() {
const transferExpiryDate = this.form.get('transferExpiryDate').value;
if (transferExpiryDate !== null && transferExpiryDate !== '') {
  this.validateTransferExpDate(transferExpiryDate);
  this.validateTransferExpDateOnLoad();
} else {
  this.form.get('transferExpiryDate').clearValidators();
  this.form.get('transferExpiryDate').markAsDirty();
  this.form.get('transferExpiryDate').setErrors({ required: true });
  }
}

onClickTransmissionMode() {
  this.modeOfTransmission = this.form.get('transmissionMode').value;
  if ( this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
    this.initialzeSwiftMode();
    this.form.addFCCValidators('transferPlaceOfExpiry', Validators.pattern(this.swiftXCharRegex), 0);
    this.form.addFCCValidators('secondBeneficiaryName', Validators.pattern(this.swiftXCharRegex), 0);
    this.form.addFCCValidators('secondBeneficiaryFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
    this.form.addFCCValidators('secondBeneficiarySecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
    this.form.addFCCValidators('secondBeneficiaryThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
    this.form.get('transferPlaceOfExpiry').updateValueAndValidity();
    this.form.get('secondBeneficiaryName').updateValueAndValidity();
    this.form.get('secondBeneficiaryFirstAddress').updateValueAndValidity();
    this.form.get('secondBeneficiarySecondAddress').updateValueAndValidity();
    this.form.get('secondBeneficiaryThirdAddress').updateValueAndValidity();
    this.form.addFCCValidators('adviseThruBankName', Validators.pattern(this.swiftXCharRegex), 0);
    this.form.addFCCValidators('adviseThruBankFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
    this.form.addFCCValidators('adviseThruBankSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
    this.form.addFCCValidators('adviseThruBankThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
    this.form.get('adviseThruBankName').updateValueAndValidity();
    this.form.get('adviseThruBankFirstAddress').updateValueAndValidity();
    this.form.get('adviseThruBankSecondAddress').updateValueAndValidity();
    this.form.get('adviseThruBankThirdAddress').updateValueAndValidity();
  } else {
    this.initialzeNonSwiftMode();
    this.removeValidators(this.form, ['transferPlaceOfExpiry', 'secondBeneficiaryName', 'secondBeneficiaryFirstAddress',
      'secondBeneficiarySecondAddress', 'secondBeneficiaryThirdAddress', 'adviseThruBankName', 'adviseThruBankFirstAddress',
      'adviseThruBankSecondAddress', 'adviseThruBankThirdAddress']);
  }
  if (this.modeOfTransmission === FccBusinessConstantsService.OTHER_99) {
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
  this.beneficiaryInputValValidation();
}

initialzeSwiftMode() {
  const toggleValue = this.form.get('adviseThru').value;
  if (toggleValue === '02') {
    this.form.get('adviseThruBankFirstAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankSecondAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankThirdAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankFourthAddress')[this.params][this.rendered] = false;
  }
  this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_1)[this.params][this.rendered] = true;
  this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_2)[this.params][this.rendered] = true;
  this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_3)[this.params][this.rendered] = true;
  this.form.get('secondBeneficiaryFourthAddress')[this.params][this.rendered] = false;

}
initialzeNonSwiftMode() {
  const toggleValue = this.form.get('adviseThru').value;
  if (toggleValue === '02') {
    this.form.get('adviseThruBankFirstAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankSecondAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankThirdAddress')[this.params][this.rendered] = true;
    this.form.get('adviseThruBankFourthAddress')[this.params][this.rendered] = true;
  }
  this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_1)[this.params][this.rendered] = true;
  this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_2)[this.params][this.rendered] = true;
  this.form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_3)[this.params][this.rendered] = true;
  this.form.get('secondBeneficiaryFourthAddress')[this.params][this.rendered] = true;
}

onBlurTransferAmount() {
  this.setAmountLengthValidator(this.transferAmountField);
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

onClickTransferAmount() {
  this.OnClickAmountFieldHandler(this.transferAmountField);
}

OnClickAmountFieldHandler(controlName: string) {
  if (this.getAmountOriginalValue(controlName)) {
    this.form.get(controlName).setValue(this.setAmountOriginalValue(controlName));
    this.form.get(controlName).updateValueAndValidity();
    this.form.updateValueAndValidity();
  }
}

setAmountOriginalValue(controlName: string) {
  if (this.form.get(controlName)) {
    this.form.get(controlName)[this.params][this.ORIGINAL_VALUE] = this.commonService.replaceCurrency(this.form.get(controlName).value);
  }
}

getAmountOriginalValue(controlName: string): string{
  return this.form.get(controlName)[this.params][this.ORIGINAL_VALUE];
}

 getBeneficiaries() {
  this.corporateCommonService.getCounterparties(
    this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.counterparties)
    .subscribe(response => {
        if (response.status === this.responseStatusCode) {
          this.getBeneficiariesAsList(response.body);
        }
        this.updateSecBeneficiaryValue();
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
      if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT) {
        this.form.get('adviseThruBankFourthAddress').patchValue('');
      } else {
        this.form.get('adviseThruBankFourthAddress').patchValue(responseAdvThru.responseData.ADDRESS_LINE_4);
      }
    }
  });
}

ngOnDestroy() {
  if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) !== null) {
    const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    if (togglevalue !== undefined && togglevalue === FccBusinessConstantsService.YES &&
      !this.form.get(FccGlobalConstant.BENE_ABBV_NAME).hasError('duplicateCounterpartyAbbvName')) {
      this.commonService.saveBeneficiary(this.getCounterPartyObject(this.form)).subscribe();
    }
  }
  if (this.adviseThroughBankResponse !== undefined) {
    this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
    this.adviseThroughBankResponse = null;
    this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
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
        FccGlobalConstant.TRANSFER_DETAILS,
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
    this.setTransferAmtNull = false;
    this.form.get('availableAmount').setValue(this.currency.concat(' ').concat(availableAmount));
  }

  setAmountFields(toggleValue, transferAmount) {
    this.form.get(this.transferAmountField).clearValidators();
    this.form.get(this.transferAmountField).setValue(transferAmount);
    if (toggleValue === FccBusinessConstantsService.NO) {
      this.form.get(this.transferAmountField)[this.params][this.readonly] = false;
    } else {
      this.form.get(this.transferAmountField)[this.params][this.readonly] = true;
      this.form.controls[this.transferAmountField].disable();
    }
    this.transferAmountValidation();
    this.form.get(this.transferAmountField).updateValueAndValidity();
  }

  transferAmountValidation() {
    const originalLCAmt = this.commonService.replaceCurrency(this.lcAmount);
    const utilizedAmount = this.commonService.replaceCurrency(this.stateService.getValue('transferDetails', 'utilizedAmount', false));
    const availableAmt = +originalLCAmt - +utilizedAmount;
    const availableFloatAmt = parseFloat(availableAmt.toString());
    let transferAmt = this.commonService.replaceCurrency(this.form.get(this.transferAmountField).value);
    transferAmt = this.currencyConverterPipe.transform(transferAmt.toString(), this.currency);
    const transferAmtFloatValue = parseFloat(transferAmt !== null ? this.commonService.replaceCurrency(transferAmt) : 0);
    if (this.commonService.isNonEmptyValue(transferAmtFloatValue) && this.commonService.isNonEmptyValue (transferAmt) !== null
        && transferAmtFloatValue <= 0) {
      this.form.get(this.transferAmountField).clearValidators();
      const amnt = this.form.get(this.transferAmountField);
      amnt.setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      this.form.addFCCValidators(this.transferAmountField,
        Validators.compose([Validators.required, amountCanNotBeZero]), 0);
      this.form.get(this.transferAmountField).setErrors({ amountCanNotBeZero: true });
      this.form.get(this.transferAmountField).markAsDirty();
      this.form.get(this.transferAmountField).markAsTouched();
      this.form.get(this.transferAmountField).updateValueAndValidity();
    } else if (this.commonService.isNonEmptyValue(transferAmtFloatValue)
    && transferAmtFloatValue > availableFloatAmt) {
      this.form.get(this.transferAmountField).clearValidators();
      this.form.addFCCValidators(this.transferAmountField,
        Validators.compose([Validators.required, transferAmtGreaterThanAvailableAmt]), 0);
      this.form.get(this.transferAmountField).setErrors({ transferAmtGreaterThanAvailableAmt: true });
      this.form.get(this.transferAmountField).markAsDirty();
      this.form.get(this.transferAmountField).markAsTouched();
      this.form.get(this.transferAmountField).updateValueAndValidity();
    } else if (this.commonService.isNonEmptyValue(transferAmtFloatValue) &&
    transferAmtFloatValue > 0 && transferAmtFloatValue < availableFloatAmt) {
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

  validateTransferExpDateOnLoad() {
    if (this.form.get('transferExpiryDate').hasError('transferExpiryDateLessThanCurrentDate')) {
      this.form.get('transferExpiryDate').setErrors({ transferExpiryDateLessThanCurrentDate: true });
      this.form.get('transferExpiryDate').markAsTouched({ onlySelf: true });
      this.form.get('transferExpiryDate').markAsDirty();
      this.form.get('transferExpiryDate').updateValueAndValidity();
    } else if (this.form.get('transferExpiryDate').hasError('transferExpiryDateLessThenOriginalexpiryDate')) {
      this.form.get('transferExpiryDate').setErrors({ transferExpiryDateLessThenOriginalexpiryDate: true });
      this.form.get('transferExpiryDate').markAsTouched({ onlySelf: true });
      this.form.get('transferExpiryDate').markAsDirty();
      this.form.get('transferExpiryDate').updateValueAndValidity();
    }
  }

  updateSecBeneficiaryValue() {
    if (this.form.get('secondBeneficiaryEntity').value) {
      const secondBeneficiaryEntity = this.stateService.getValue(FccGlobalConstant.TRANSFER_DETAILS, 'secondBeneficiaryEntity', false);
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
    this.beneficiaryInputValValidation();
  }

  validateTransferExpDate(transferExpiryDate: any) {
      const currentDate = new Date();
      this.expiryDateofELC = this.stateService.getValue('elgeneralDetails', 'expiryDate', false);
      if (this.expiryDateofELC !== null && this.expiryDateofELC !== '') {
      transferExpiryDate = `${transferExpiryDate.getDate()}/${(transferExpiryDate.getMonth() + 1)}/${transferExpiryDate.getFullYear()}`;
      transferExpiryDate = (transferExpiryDate !== '' && transferExpiryDate !== null) ?
                                  this.commonService.convertToDateFormat(transferExpiryDate) : '';
      this.expiryDateofELC = (this.expiryDateofELC !== '' && this.expiryDateofELC !== null) ?
                                  this.commonService.convertToDateFormat(this.expiryDateofELC) : '';
      this.form.get('transferExpiryDate').clearValidators();
      if (transferExpiryDate !== '' && this.expiryDateofELC !== '' && (transferExpiryDate > this.expiryDateofELC) ) {
        this.form.get('transferExpiryDate').setValidators([transferExpiryDateLessThenOriginalexpiryDate]);
        this.form.get('transferExpiryDate').updateValueAndValidity();
      } else if (transferExpiryDate !== '' && (transferExpiryDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) ) {
        this.form.get('transferExpiryDate').setValidators([transferExpiryDateLessThanCurrentDate]);
        this.form.get('transferExpiryDate').updateValueAndValidity();
      } else {
        this.form.get('transferExpiryDate').clearValidators();
        this.form.get('transferExpiryDate').updateValueAndValidity();
      }
    }
  }

  setAmountReplaceReqgex() {
    if (localStorage.getItem('language') === 'fr') {
      this.amountreplaceregex = /\s/g;
    } else {
      this.amountreplaceregex = /[^0-9.]/g;
    }
  }

  beneficiaryInputValValidation() {
    let beneEntity;
    if (this.commonService.isNonEmptyValue(this.form.get('secondBeneficiaryEntity').value) &&
    typeof(this.form.get('secondBeneficiaryEntity').value) === 'object'){
      beneEntity = this.form.get('secondBeneficiaryEntity')[FccGlobalConstant.VALUE][FccGlobalConstant.NAME];
    }
    else {
      beneEntity = this.form.get('secondBeneficiaryEntity')[FccGlobalConstant.VALUE];
    }
    if(beneEntity != null){
      this.form.get('secondBeneficiaryEntity').clearValidators();
      this.form.get('secondBeneficiaryEntity').setErrors(null);
      this.form.get('secondBeneficiaryEntity').updateValueAndValidity();
    }
    const beneNameReg = new RegExp(this.swiftXCharRegex);
    if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT)
    {
      if ((!beneNameReg.test(beneEntity)) && this.commonService.isnonEMptyString(beneEntity))
      {
        this.form.get('secondBeneficiaryEntity')
        .setErrors({ pattern: { field: this.form.get('secondBeneficiaryEntity')[this.params][FccGlobalConstant.LABEL] } });
        this.form.addFCCValidators('secondBeneficiaryEntity',
         Validators.compose([Validators.required , Validators.pattern(this.swiftXCharRegex)]), 0);
        this.form.get('secondBeneficiaryEntity').updateValueAndValidity();
      }
    }
   else if (this.modeOfTransmission !== FccBusinessConstantsService.SWIFT)
   {
    this.form.addFCCValidators('secondBeneficiaryEntity', Validators.compose([Validators.required]), 0);
    this.form.get('secondBeneficiaryEntity').updateValueAndValidity();
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
        this.beneficiaryInputValValidation();
      }
      this.onClickBeneficiarySaveToggle();
    }
    else{
      if (!this.syBeneAdd || !this.beneEditToggleVisible){
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
        this.clearBeneAbbvValidator();
        this.clearSecondBeneValidator();
      }
    }
    this.form.addFCCValidators('secondBeneficiaryEntity', Validators.compose([Validators.required]), 0);
    if (this.commonService.isEmptyValue(this.form.get('secondBeneficiaryEntity').value)) {
      this.form.get('secondBeneficiaryEntity').setErrors({ required: true });
      this.form.get('secondBeneficiaryEntity').markAsTouched();
    }
  }

  clearSecondBeneValidator() {
    this.form.get('secondBeneficiaryEntity').clearValidators();
    this.form.get('secondBeneficiaryEntity').updateValueAndValidity();
  }
  // clear bene abbv validator
  clearBeneAbbvValidator()
  {
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).clearValidators();
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
  }
  // Display bene abbv name after turning on bene save toggle
  onClickBeneficiarySaveToggle() {
    const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    if (togglevalue === FccBusinessConstantsService.YES) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = false;
      this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
        Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
    } else {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
      this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setValue(FccGlobalConstant.EMPTY_STRING);
      this.clearBeneAbbvValidator();
    }
  }
  // to create adhoc beneficiary object
  getCounterPartyObject(form: FCCFormGroup): CounterpartyRequest {
    const counterpartyRequest: CounterpartyRequest = {
      name: this.commonService.validateValue(form.get(FccGlobalConstant.TRANFER_BENEFICIARY_NAME).value),
      shortName: this.commonService.validateValue(form.get(FccGlobalConstant.BENE_ABBV_NAME).value),
      swiftAddress: {
        line1: this.commonService.validateValue(form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_1).value),
        line2: this.commonService.validateValue(form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_2).value),
        line3: this.commonService.validateValue(form.get(FccGlobalConstant.TRANSFER_BENEFICIARY_ADDRESS_3).value),
      },
      country: FccGlobalConstant.DEFAULT_COUNTRY,
      entityShortName: FccGlobalConstant.ENTITY_DEFAULT,
    };
    return counterpartyRequest;
  }

  // validation on change of beneAbbvName field
  onBlurBeneAbbvName() {
    const abbvName = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors(null);
    if (this.abbvNameList.indexOf(abbvName) > -1 && !this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly]) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ duplicateCounterpartyAbbvName: { abbvName } });
    }

    this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
      Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();

    if ((abbvName.split(' ').length-1) !== 0) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ whiteSpaceNotAllowed: { abbvName } });
    }

  }

  updateBeneSaveToggleDisplay(){
    if (this.benePreviousValue !== undefined &&
      (this.mode === FccGlobalConstant.DRAFT_OPTION)){
        if(this.benePreviousValue)
        {
          this.checkBeneSaveAllowedForAmend(this.benePreviousValue.name);
        }
      if (this.saveTogglePreviousValue === FccBusinessConstantsService.YES && this.beneAbbvPreviousValue){
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
      }
    }
    const beneAbbvNameValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    if (beneAbbvNameValue !== undefined && beneAbbvNameValue !== null && beneAbbvNameValue !== FccGlobalConstant.EMPTY_STRING){
      if (!(this.entityNameList.includes(this.benePreviousValue?.name ? this.benePreviousValue.name : this.benePreviousValue))){
        this.onBlurBeneAbbvName();
      } else {
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = true;
        this.clearBeneAbbvValidator();
      }
    }
  }

  checkBeneSaveAllowedForAmend(beneAmendValue: any) {
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    if (this.syBeneAdd && this.entityNameList !== undefined && this.entityNameList.length > 0
      && beneAmendValue !== FccGlobalConstant.EMPTY_STRING && !(this.entityNameList.includes(beneAmendValue))){
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
      if (this.form.get(FccGlobalConstant.TRANFER_BENEFICIARY_NAME).value !== undefined
        && this.form.get(FccGlobalConstant.TRANFER_BENEFICIARY_NAME).value !== FccGlobalConstant.EMPTY_STRING){
          this.form.get(FccGlobalConstant.TRANFER_BENEFICIARY_NAME)
          .setValue(this.form.get(FccGlobalConstant.TRANFER_BENEFICIARY_NAME).value);
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
}


